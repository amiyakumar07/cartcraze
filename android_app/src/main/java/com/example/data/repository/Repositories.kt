package com.example.data.repository

import android.content.Context
import androidx.room.Room
import com.example.data.SampleData
import com.example.data.local.AddressEntity
import com.example.data.local.AppDatabase
import com.example.data.local.CartItemEntity
import com.example.data.local.OrderEntity
import com.example.data.model.Address
import com.example.data.model.CartItem
import com.example.data.model.Order
import com.example.data.model.OrderStatus
import com.example.data.model.Product
import com.example.data.remote.FirebaseAuthService
import com.example.data.remote.LocationIqService
import com.example.data.remote.RazorpayService
import com.example.data.remote.SupabaseService
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.launch
import org.json.JSONArray
import org.json.JSONObject

class ProductRepository {
    private val _products = MutableStateFlow(SampleData.products)
    val products: StateFlow<List<Product>> = _products.asStateFlow()

    fun getProductById(id: String): Product? {
        return _products.value.find { it.id == id }
    }

    fun searchProducts(query: String): List<Product> {
        if (query.isBlank()) return _products.value
        val q = query.lowercase().trim()
        return _products.value.filter {
            it.name.lowercase().contains(q) ||
            it.brand.lowercase().contains(q) ||
            it.category.lowercase().contains(q) ||
            it.description.lowercase().contains(q)
        }
    }

    fun getProductsByCategory(categoryName: String): List<Product> {
        return _products.value.filter { it.category.equals(categoryName, ignoreCase = true) }
    }
}

class CartRepository(
    private val database: AppDatabase,
    private val productRepository: ProductRepository
) {
    val cartItems: Flow<List<CartItem>> = database.cartDao().getAllCartItems().map { entityList ->
        entityList.mapNotNull { entity ->
            val product = productRepository.getProductById(entity.productId)
            product?.let { CartItem(product = it, quantity = entity.quantity) }
        }
    }

    suspend fun addToCart(product: Product) {
        val currentEntities = database.cartDao().getAllCartItems().first()
        val existing = currentEntities.find { it.productId == product.id }
        if (existing != null) {
            database.cartDao().insertOrUpdate(CartItemEntity(product.id, existing.quantity + 1))
        } else {
            database.cartDao().insertOrUpdate(CartItemEntity(product.id, 1))
        }
    }

    suspend fun updateQuantity(productId: String, newQuantity: Int) {
        if (newQuantity <= 0) {
            database.cartDao().removeItem(productId)
        } else {
            database.cartDao().insertOrUpdate(CartItemEntity(productId, newQuantity))
        }
    }

    suspend fun removeFromCart(productId: String) {
        database.cartDao().removeItem(productId)
    }

    suspend fun clearCart() {
        database.cartDao().clearCart()
    }
}

class AddressRepository(
    private val database: AppDatabase
) {
    val addresses: Flow<List<Address>> = database.addressDao().getAllAddresses().map { list ->
        list.map { it.toAddress() }
    }

    suspend fun addAddress(address: Address) {
        database.addressDao().insertAddress(AddressEntity.fromAddress(address))
        if (address.isDefault) {
            database.addressDao().setDefaultAddress(address.id)
        }
    }

    suspend fun updateAddress(address: Address) {
        database.addressDao().updateAddress(AddressEntity.fromAddress(address))
        if (address.isDefault) {
            database.addressDao().setDefaultAddress(address.id)
        }
    }

    suspend fun deleteAddress(id: String) {
        database.addressDao().deleteAddressById(id)
    }

    suspend fun setDefaultAddress(id: String) {
        database.addressDao().setDefaultAddress(id)
    }

    suspend fun initializeDefaultsIfNeeded() {
        val current = database.addressDao().getAllAddresses().first()
        if (current.isEmpty()) {
            SampleData.defaultAddresses.forEach {
                database.addressDao().insertAddress(AddressEntity.fromAddress(it))
            }
        }
    }
}

class OrderRepository(
    private val database: AppDatabase,
    private val productRepository: ProductRepository,
    private val supabaseService: SupabaseService
) {
    val orders: Flow<List<Order>> = database.orderDao().getAllOrders().map { entityList ->
        entityList.map { entity ->
            parseOrderEntity(entity)
        }
    }

    suspend fun placeOrder(order: Order, userId: String = "usr_active_session") {
        database.orderDao().insertOrder(serializeOrder(order))
        // Sync order to Supabase backend in background
        CoroutineScope(Dispatchers.IO).launch {
            supabaseService.insertOrder(order, userId)
        }
    }

    suspend fun getOrderById(orderId: String): Order? {
        val entity = database.orderDao().getOrderById(orderId)
        return entity?.let { parseOrderEntity(it) }
    }

    suspend fun updateStatus(orderId: String, status: OrderStatus) {
        database.orderDao().updateOrderStatus(orderId, status.name)
    }

    private fun serializeOrder(order: Order): OrderEntity {
        val itemsArr = JSONArray()
        order.items.forEach { item ->
            val obj = JSONObject()
            obj.put("productId", item.product.id)
            obj.put("quantity", item.quantity)
            itemsArr.put(obj)
        }

        val addrObj = JSONObject()
        addrObj.put("id", order.address.id)
        addrObj.put("tag", order.address.tag)
        addrObj.put("line1", order.address.line1)
        addrObj.put("line2", order.address.line2)
        addrObj.put("cityStateZip", order.address.cityStateZip)
        addrObj.put("phone", order.address.phone)
        addrObj.put("isDefault", order.address.isDefault)

        return OrderEntity(
            orderId = order.orderId,
            timestamp = order.timestamp,
            itemsJson = itemsArr.toString(),
            subtotal = order.subtotal,
            deliveryFee = order.deliveryFee,
            taxes = order.taxes,
            total = order.total,
            addressJson = addrObj.toString(),
            paymentMethod = order.paymentMethod,
            status = order.status.name,
            etaMinutes = order.etaMinutes,
            riderName = order.riderName,
            riderRating = order.riderRating,
            riderDeliveries = order.riderDeliveries,
            riderPhotoUrl = order.riderPhotoUrl,
            currency = order.currency
        )
    }

    private fun parseOrderEntity(entity: OrderEntity): Order {
        val items = mutableListOf<CartItem>()
        try {
            val arr = JSONArray(entity.itemsJson)
            for (i in 0 until arr.length()) {
                val obj = arr.getJSONObject(i)
                val prodId = obj.getString("productId")
                val qty = obj.getInt("quantity")
                val prod = productRepository.getProductById(prodId)
                if (prod != null) {
                    items.add(CartItem(prod, qty))
                }
            }
        } catch (_: Exception) {}

        val addr = try {
            val obj = JSONObject(entity.addressJson)
            Address(
                id = obj.optString("id", "addr_default"),
                tag = obj.optString("tag", "Home"),
                line1 = obj.optString("line1", "Patia"),
                line2 = obj.optString("line2", "Bhubaneswar"),
                cityStateZip = obj.optString("cityStateZip", "Bhubaneswar 751024"),
                phone = obj.optString("phone", "+91 98765 43210"),
                isDefault = obj.optBoolean("isDefault", true)
            )
        } catch (_: Exception) {
            SampleData.defaultAddresses.first()
        }

        val status = try {
            OrderStatus.valueOf(entity.status)
        } catch (_: Exception) {
            OrderStatus.CONFIRMED
        }

        return Order(
            orderId = entity.orderId,
            timestamp = entity.timestamp,
            items = items,
            subtotal = entity.subtotal,
            deliveryFee = entity.deliveryFee,
            taxes = entity.taxes,
            total = entity.total,
            address = addr,
            paymentMethod = entity.paymentMethod,
            status = status,
            etaMinutes = entity.etaMinutes,
            riderName = entity.riderName,
            riderRating = entity.riderRating,
            riderDeliveries = entity.riderDeliveries,
            riderPhotoUrl = entity.riderPhotoUrl,
            currency = entity.currency
        )
    }
}

class AppContainer(context: Context) {
    val database: AppDatabase = Room.databaseBuilder(
        context.applicationContext,
        AppDatabase::class.java,
        "cartcraze_db"
    ).fallbackToDestructiveMigration().build()

    val locationIqService: LocationIqService = LocationIqService()
    val supabaseService: SupabaseService = SupabaseService()
    val firebaseAuthService: FirebaseAuthService = FirebaseAuthService()
    val razorpayService: RazorpayService = RazorpayService()

    val productRepository: ProductRepository = ProductRepository()
    val cartRepository: CartRepository = CartRepository(database, productRepository)
    val addressRepository: AddressRepository = AddressRepository(database)
    val orderRepository: OrderRepository = OrderRepository(database, productRepository, supabaseService)

    init {
        CoroutineScope(Dispatchers.IO).launch {
            addressRepository.initializeDefaultsIfNeeded()
            val cartList = database.cartDao().getAllCartItems().first()
            if (cartList.isEmpty()) {
                database.cartDao().insertOrUpdate(CartItemEntity("prod_toned_milk", 1))
            }
        }
    }
}

