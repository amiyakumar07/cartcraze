package com.example.data.local

import androidx.room.Dao
import androidx.room.Database
import androidx.room.Delete
import androidx.room.Entity
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.PrimaryKey
import androidx.room.Query
import androidx.room.RoomDatabase
import androidx.room.TypeConverter
import androidx.room.TypeConverters
import androidx.room.Update
import com.example.data.model.Address
import com.example.data.model.CartItem
import com.example.data.model.OrderStatus
import com.example.data.model.Product
import kotlinx.coroutines.flow.Flow
import org.json.JSONArray
import org.json.JSONObject

@Entity(tableName = "addresses")
data class AddressEntity(
    @PrimaryKey val id: String,
    val tag: String,
    val line1: String,
    val line2: String,
    val cityStateZip: String,
    val phone: String,
    val isDefault: Boolean
) {
    fun toAddress() = Address(
        id = id,
        tag = tag,
        line1 = line1,
        line2 = line2,
        cityStateZip = cityStateZip,
        phone = phone,
        isDefault = isDefault
    )

    companion object {
        fun fromAddress(address: Address) = AddressEntity(
            id = address.id,
            tag = address.tag,
            line1 = address.line1,
            line2 = address.line2,
            cityStateZip = address.cityStateZip,
            phone = address.phone,
            isDefault = address.isDefault
        )
    }
}

@Entity(tableName = "cart_items")
data class CartItemEntity(
    @PrimaryKey val productId: String,
    val quantity: Int
)

@Entity(tableName = "orders")
data class OrderEntity(
    @PrimaryKey val orderId: String,
    val timestamp: Long,
    val itemsJson: String, // serialized cart items
    val subtotal: Double,
    val deliveryFee: Double,
    val taxes: Double,
    val total: Double,
    val addressJson: String,
    val paymentMethod: String,
    val status: String,
    val etaMinutes: Int,
    val riderName: String,
    val riderRating: Double,
    val riderDeliveries: String,
    val riderPhotoUrl: String,
    val currency: String
)

@Dao
interface AddressDao {
    @Query("SELECT * FROM addresses ORDER BY isDefault DESC, id ASC")
    fun getAllAddresses(): Flow<List<AddressEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAddress(address: AddressEntity)

    @Update
    suspend fun updateAddress(address: AddressEntity)

    @Query("DELETE FROM addresses WHERE id = :id")
    suspend fun deleteAddressById(id: String)

    @Query("UPDATE addresses SET isDefault = CASE WHEN id = :selectedId THEN 1 ELSE 0 END")
    suspend fun setDefaultAddress(selectedId: String)
}

@Dao
interface CartDao {
    @Query("SELECT * FROM cart_items")
    fun getAllCartItems(): Flow<List<CartItemEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdate(item: CartItemEntity)

    @Query("DELETE FROM cart_items WHERE productId = :productId")
    suspend fun removeItem(productId: String)

    @Query("DELETE FROM cart_items")
    suspend fun clearCart()
}

@Dao
interface OrderDao {
    @Query("SELECT * FROM orders ORDER BY timestamp DESC")
    fun getAllOrders(): Flow<List<OrderEntity>>

    @Query("SELECT * FROM orders WHERE orderId = :orderId LIMIT 1")
    suspend fun getOrderById(orderId: String): OrderEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrder(order: OrderEntity)

    @Query("UPDATE orders SET status = :status WHERE orderId = :orderId")
    suspend fun updateOrderStatus(orderId: String, status: String)
}

@Database(
    entities = [AddressEntity::class, CartItemEntity::class, OrderEntity::class],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun addressDao(): AddressDao
    abstract fun cartDao(): CartDao
    abstract fun orderDao(): OrderDao
}
