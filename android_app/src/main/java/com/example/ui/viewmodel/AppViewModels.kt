package com.example.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.data.SampleData
import com.example.data.model.Address
import com.example.data.model.CartItem
import com.example.data.model.Order
import com.example.data.model.OrderStatus
import com.example.data.model.Product
import com.example.data.remote.AuthResult
import com.example.data.remote.DarkStore
import com.example.data.remote.FirebaseAuthService
import com.example.data.remote.LocationIqService
import com.example.data.remote.LocationSearchResult
import com.example.data.remote.RazorpayOrder
import com.example.data.remote.RazorpayPaymentResponse
import com.example.data.remote.RazorpayService
import com.example.data.remote.RiderLocationUpdate
import com.example.data.remote.StoreAvailability
import com.example.data.remote.SupabaseRiderLocation
import com.example.data.remote.SupabaseService
import com.example.data.remote.UserProfile
import com.example.data.repository.AddressRepository
import com.example.data.repository.CartRepository
import com.example.data.repository.OrderRepository
import com.example.data.repository.ProductRepository
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.util.UUID

class CartViewModel(
    private val cartRepository: CartRepository
) : ViewModel() {

    val cartItems: StateFlow<List<CartItem>> = cartRepository.cartItems.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = emptyList()
    )

    private val _appliedCoupon = MutableStateFlow<com.example.data.model.Coupon?>(null)
    val appliedCoupon: StateFlow<com.example.data.model.Coupon?> = _appliedCoupon.asStateFlow()

    private val _deliveryTip = MutableStateFlow(0.0)
    val deliveryTip: StateFlow<Double> = _deliveryTip.asStateFlow()

    private val _selectedInstructions = MutableStateFlow<Set<String>>(emptySet())
    val selectedInstructions: StateFlow<Set<String>> = _selectedInstructions.asStateFlow()

    private val _isNoContactDelivery = MutableStateFlow(false)
    val isNoContactDelivery: StateFlow<Boolean> = _isNoContactDelivery.asStateFlow()

    val itemCount: StateFlow<Int> = cartItems.combine(MutableStateFlow(0)) { items, _ ->
        items.sumOf { it.quantity }
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = 0
    )

    val subtotal: StateFlow<Double> = cartItems.combine(MutableStateFlow(0)) { items, _ ->
        items.sumOf { it.product.price * it.quantity }
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = 0.0
    )

    fun applyCoupon(coupon: com.example.data.model.Coupon?): Boolean {
        if (coupon == null) {
            _appliedCoupon.value = null
            return true
        }
        if (subtotal.value >= coupon.minOrderValue) {
            _appliedCoupon.value = coupon
            return true
        }
        return false
    }

    fun applyCouponByCode(code: String): String? {
        val found = SampleData.availableCoupons.find { it.code.equals(code.trim(), ignoreCase = true) }
        if (found == null) return "Invalid coupon code"
        if (subtotal.value < found.minOrderValue) {
            return "Min order value for ${found.code} is ₹${found.minOrderValue.toInt()}"
        }
        _appliedCoupon.value = found
        return null
    }

    fun removeCoupon() {
        _appliedCoupon.value = null
    }

    fun setDeliveryTip(amount: Double) {
        _deliveryTip.value = if (_deliveryTip.value == amount) 0.0 else amount
    }

    fun toggleInstruction(instruction: String) {
        val current = _selectedInstructions.value.toMutableSet()
        if (current.contains(instruction)) {
            current.remove(instruction)
        } else {
            current.add(instruction)
        }
        _selectedInstructions.value = current
    }

    fun setNoContactDelivery(enabled: Boolean) {
        _isNoContactDelivery.value = enabled
    }

    fun addToCart(product: Product) {
        viewModelScope.launch {
            cartRepository.addToCart(product)
        }
    }

    fun updateQuantity(productId: String, newQuantity: Int) {
        viewModelScope.launch {
            cartRepository.updateQuantity(productId, newQuantity)
        }
    }

    fun removeFromCart(productId: String) {
        viewModelScope.launch {
            cartRepository.removeFromCart(productId)
        }
    }

    fun clearCart() {
        viewModelScope.launch {
            cartRepository.clearCart()
            _appliedCoupon.value = null
            _deliveryTip.value = 0.0
        }
    }

    fun getQuantityForProduct(productId: String): Int {
        return cartItems.value.find { it.product.id == productId }?.quantity ?: 0
    }
}

class AddressViewModel(
    private val addressRepository: AddressRepository,
    private val locationIqService: LocationIqService
) : ViewModel() {

    val addresses: StateFlow<List<Address>> = addressRepository.addresses.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = SampleData.defaultAddresses
    )

    val selectedAddress: StateFlow<Address?> = addresses.combine(MutableStateFlow(0)) { list, _ ->
        list.find { it.isDefault } ?: list.firstOrNull()
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = SampleData.defaultAddresses.firstOrNull()
    )

    fun addAddress(tag: String, line1: String, line2: String, phone: String, isDefault: Boolean) {
        viewModelScope.launch {
            val newAddress = Address(
                id = "addr_${UUID.randomUUID().toString().take(8)}",
                tag = tag,
                line1 = line1,
                line2 = line2,
                cityStateZip = "$line2, 751024",
                phone = phone,
                isDefault = isDefault
            )
            addressRepository.addAddress(newAddress)
        }
    }

    fun setGpsLocation(lat: Double, lon: Double, onResult: (Address) -> Unit = {}) {
        viewModelScope.launch {
            val loc = locationIqService.reverseGeocode(lat, lon)
            val streetName = if (loc.road.isNotBlank()) loc.road else loc.displayName.split(",").firstOrNull() ?: "Current Location"
            val areaCity = listOfNotNull(
                loc.suburb.takeIf { it.isNotBlank() },
                loc.city.takeIf { it.isNotBlank() },
                loc.postcode.takeIf { it.isNotBlank() }
            ).joinToString(", ")

            val newAddress = Address(
                id = "addr_gps_${System.currentTimeMillis() % 100000}",
                tag = "Current Location",
                line1 = "$streetName (GPS Detected)",
                line2 = if (areaCity.isNotBlank()) areaCity else loc.displayName,
                cityStateZip = if (loc.city.isNotBlank()) "${loc.city}, ${loc.postcode}" else "Bhubaneswar, 751024",
                phone = "+91 98765 43210",
                isDefault = true
            )
            addressRepository.addAddress(newAddress)
            addressRepository.setDefaultAddress(newAddress.id)
            onResult(newAddress)
        }
    }

    fun setAddressFromLocationResult(loc: LocationSearchResult, onResult: (Address) -> Unit = {}) {
        viewModelScope.launch {
            val streetName = if (loc.road.isNotBlank()) loc.road else loc.displayName.split(",").firstOrNull() ?: loc.displayName
            val areaCity = listOfNotNull(
                loc.suburb.takeIf { it.isNotBlank() },
                loc.city.takeIf { it.isNotBlank() },
                loc.postcode.takeIf { it.isNotBlank() }
            ).joinToString(", ")

            val newAddress = Address(
                id = "addr_loc_${System.currentTimeMillis() % 100000}",
                tag = if (loc.suburb.isNotBlank()) loc.suburb else "Delivery Location",
                line1 = streetName,
                line2 = if (areaCity.isNotBlank()) areaCity else loc.displayName,
                cityStateZip = if (loc.city.isNotBlank()) "${loc.city}, ${loc.postcode}" else "Bhubaneswar, 751024",
                phone = "+91 98765 43210",
                isDefault = true
            )
            addressRepository.addAddress(newAddress)
            addressRepository.setDefaultAddress(newAddress.id)
            onResult(newAddress)
        }
    }

    fun updateAddress(address: Address) {
        viewModelScope.launch {
            addressRepository.updateAddress(address)
        }
    }

    fun deleteAddress(id: String) {
        viewModelScope.launch {
            addressRepository.deleteAddress(id)
        }
    }

    fun selectDefaultAddress(id: String) {
        viewModelScope.launch {
            addressRepository.setDefaultAddress(id)
        }
    }
}

class LocationStoreViewModel(
    private val locationIqService: LocationIqService,
    private val supabaseService: SupabaseService
) : ViewModel() {

    private val _storeAvailability = MutableStateFlow(
        locationIqService.checkStoreAvailability(20.3533, 85.8178, "KIIT Road, Patia, Bhubaneswar")
    )
    val storeAvailability: StateFlow<StoreAvailability> = _storeAvailability.asStateFlow()

    private val _searchResults = MutableStateFlow<List<LocationSearchResult>>(emptyList())
    val searchResults: StateFlow<List<LocationSearchResult>> = _searchResults.asStateFlow()

    private val _isSearching = MutableStateFlow(false)
    val isSearching: StateFlow<Boolean> = _isSearching.asStateFlow()

    private val _lastDetectedLocation = MutableStateFlow<LocationSearchResult?>(null)
    val lastDetectedLocation: StateFlow<LocationSearchResult?> = _lastDetectedLocation.asStateFlow()

    val darkStores: List<DarkStore> = locationIqService.darkStores

    fun searchLocation(query: String) {
        if (query.isBlank()) {
            _searchResults.value = emptyList()
            return
        }
        viewModelScope.launch {
            _isSearching.value = true
            val results = locationIqService.searchAddress(query)
            _searchResults.value = results
            _isSearching.value = false
        }
    }

    fun confirmAddressAndCheckStore(location: LocationSearchResult) {
        _lastDetectedLocation.value = location
        val availability = locationIqService.checkStoreAvailability(
            location.latitude,
            location.longitude,
            location.displayName
        )
        _storeAvailability.value = availability
    }

    fun checkAvailabilityForCoordinates(lat: Double, lon: Double, addressHint: String) {
        _storeAvailability.value = locationIqService.checkStoreAvailability(lat, lon, addressHint)
    }

    fun useCurrentLocation(lat: Double = 20.3535, lon: Double = 85.8180, onResolved: (LocationSearchResult) -> Unit = {}) {
        viewModelScope.launch {
            _isSearching.value = true
            val current = locationIqService.reverseGeocode(lat, lon)
            confirmAddressAndCheckStore(current)
            _isSearching.value = false
            onResolved(current)
        }
    }
}

class AuthViewModel(
    private val firebaseAuthService: FirebaseAuthService
) : ViewModel() {

    private val _currentUser = MutableStateFlow<UserProfile?>(
        UserProfile(
            uid = "usr_alex_01",
            name = "Alex Mercer",
            email = "alex.mercer@cartcraze.com",
            phone = "+91 98765 43210",
            isGuest = false,
            isPlusMember = true
        )
    )
    val currentUser: StateFlow<UserProfile?> = _currentUser.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _authError = MutableStateFlow<String?>(null)
    val authError: StateFlow<String?> = _authError.asStateFlow()

    fun signInWithEmail(email: String, pass: String, onSuccess: () -> Unit = {}) {
        viewModelScope.launch {
            _isLoading.value = true
            _authError.value = null
            when (val result = firebaseAuthService.signInWithEmail(email, pass)) {
                is AuthResult.Success -> {
                    _currentUser.value = result.user
                    _isLoading.value = false
                    onSuccess()
                }
                is AuthResult.Error -> {
                    _authError.value = result.message
                    _isLoading.value = false
                }
            }
        }
    }

    fun signUpWithEmail(name: String, email: String, pass: String, phone: String, onSuccess: () -> Unit = {}) {
        viewModelScope.launch {
            _isLoading.value = true
            _authError.value = null
            when (val result = firebaseAuthService.signUpWithEmail(name, email, pass, phone)) {
                is AuthResult.Success -> {
                    _currentUser.value = result.user
                    _isLoading.value = false
                    onSuccess()
                }
                is AuthResult.Error -> {
                    _authError.value = result.message
                    _isLoading.value = false
                }
            }
        }
    }

    fun verifyPhoneOtp(phone: String, otp: String, onSuccess: () -> Unit = {}) {
        viewModelScope.launch {
            _isLoading.value = true
            _authError.value = null
            when (val result = firebaseAuthService.verifyPhoneOtp(phone, otp)) {
                is AuthResult.Success -> {
                    _currentUser.value = result.user
                    _isLoading.value = false
                    onSuccess()
                }
                is AuthResult.Error -> {
                    _authError.value = result.message
                    _isLoading.value = false
                }
            }
        }
    }

    fun signInWithGoogle(onSuccess: () -> Unit = {}) {
        viewModelScope.launch {
            _isLoading.value = true
            when (val result = firebaseAuthService.signInWithGoogle()) {
                is AuthResult.Success -> {
                    _currentUser.value = result.user
                    _isLoading.value = false
                    onSuccess()
                }
                is AuthResult.Error -> {
                    _authError.value = result.message
                    _isLoading.value = false
                }
            }
        }
    }

    fun continueAsGuest() {
        _currentUser.value = UserProfile(
            uid = "usr_guest_${UUID.randomUUID().toString().take(6)}",
            name = "Guest Shopper",
            email = "guest@cartcraze.com",
            phone = "+91 99999 00000",
            isGuest = true,
            isPlusMember = false
        )
    }

    fun signOut() {
        _currentUser.value = null
    }

    fun clearError() {
        _authError.value = null
    }
}

class ProductViewModel(
    private val productRepository: ProductRepository
) : ViewModel() {

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _selectedCategory = MutableStateFlow<String?>(null)
    val selectedCategory: StateFlow<String?> = _selectedCategory.asStateFlow()

    private val _selectedPriceFilter = MutableStateFlow<String?>(null)
    val selectedPriceFilter: StateFlow<String?> = _selectedPriceFilter.asStateFlow()

    private val _selectedRatingFilter = MutableStateFlow<Double?>(null)
    val selectedRatingFilter: StateFlow<Double?> = _selectedRatingFilter.asStateFlow()

    private val _selectedBrandFilter = MutableStateFlow<String?>(null)
    val selectedBrandFilter: StateFlow<String?> = _selectedBrandFilter.asStateFlow()

    val allProducts: StateFlow<List<Product>> = productRepository.products

    fun onSearchQueryChanged(query: String) {
        _searchQuery.value = query
    }

    fun onCategorySelected(categoryName: String?) {
        _selectedCategory.value = if (_selectedCategory.value == categoryName) null else categoryName
    }

    fun onPriceFilterSelected(filter: String?) {
        _selectedPriceFilter.value = if (_selectedPriceFilter.value == filter) null else filter
    }

    fun onRatingFilterSelected(rating: Double?) {
        _selectedRatingFilter.value = if (_selectedRatingFilter.value == rating) null else rating
    }

    fun onBrandFilterSelected(brand: String?) {
        _selectedBrandFilter.value = if (_selectedBrandFilter.value == brand) null else brand
    }

    fun getFilteredProducts(): List<Product> {
        var list = if (_searchQuery.value.isNotBlank()) {
            productRepository.searchProducts(_searchQuery.value)
        } else {
            productRepository.products.value
        }

        _selectedCategory.value?.let { cat ->
            list = list.filter { it.category.equals(cat, ignoreCase = true) }
        }

        _selectedBrandFilter.value?.let { b ->
            list = list.filter { it.brand.equals(b, ignoreCase = true) }
        }

        _selectedRatingFilter.value?.let { r ->
            list = list.filter { it.rating >= r }
        }

        _selectedPriceFilter.value?.let { p ->
            list = when (p) {
                "Low to High" -> list.sortedBy { it.price }
                "High to Low" -> list.sortedByDescending { it.price }
                "Under ₹50" -> list.filter { it.price < 50 }
                else -> list
            }
        }

        return list
    }

    fun getProductById(id: String): Product? {
        return productRepository.getProductById(id)
    }
}

class OrderViewModel(
    private val orderRepository: OrderRepository,
    private val cartRepository: CartRepository,
    private val locationIqService: LocationIqService,
    private val supabaseService: SupabaseService,
    private val razorpayService: RazorpayService
) : ViewModel() {

    val orders: StateFlow<List<Order>> = orderRepository.orders.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = emptyList()
    )

    private val _currentActiveOrder = MutableStateFlow<Order?>(null)
    val currentActiveOrder: StateFlow<Order?> = _currentActiveOrder.asStateFlow()

    private val _riderLocation = MutableStateFlow(
        RiderLocationUpdate(
            latitude = 20.3533,
            longitude = 85.8178,
            bearing = 45f,
            distanceRemainingKm = 1.2,
            etaMinutes = 8,
            stepIndex = 10,
            statusText = "Rider assigned at Patia DarkStore Hub"
        )
    )
    val riderLocation: StateFlow<RiderLocationUpdate> = _riderLocation.asStateFlow()

    private val _riderProgress = MutableStateFlow(0.15f)
    val riderProgress: StateFlow<Float> = _riderProgress.asStateFlow()

    private var trackingJob: Job? = null

    /**
     * Create Razorpay Order before payment checkout
     */
    suspend fun createRazorpayOrder(amountRupees: Double): RazorpayOrder {
        return razorpayService.createOrder(amountRupees)
    }

    /**
     * Process Razorpay payment & signature verification
     */
    suspend fun processRazorpayPayment(order: RazorpayOrder, method: String): RazorpayPaymentResponse {
        return razorpayService.processPayment(order, method)
    }

    fun placeOrder(
        items: List<CartItem>,
        address: Address,
        paymentMethod: String,
        deliveryFee: Double = 25.0,
        taxes: Double = 15.0,
        currency: String = "₹",
        discount: Double = 0.0,
        tip: Double = 0.0,
        userId: String = "usr_active_session",
        onSuccess: (Order) -> Unit
    ) {
        val subtotal = items.sumOf { it.product.price * it.quantity }
        val total = (subtotal + deliveryFee + taxes + tip - discount).coerceAtLeast(0.0)
        val randomOrderNum = (100000..999999).random()
        val order = Order(
            orderId = "#CC$randomOrderNum",
            timestamp = System.currentTimeMillis(),
            items = items,
            subtotal = subtotal,
            deliveryFee = deliveryFee,
            taxes = taxes,
            total = total,
            address = address,
            paymentMethod = paymentMethod,
            status = OrderStatus.CONFIRMED,
            etaMinutes = 8,
            riderName = "Rajesh K.",
            riderRating = 4.9,
            riderDeliveries = "340+ deliveries",
            currency = currency
        )

        viewModelScope.launch {
            orderRepository.placeOrder(order, userId)
            _currentActiveOrder.value = order
            cartRepository.clearCart()
            startRealtimeRiderTracking(order)
            onSuccess(order)
        }
    }

    fun startRealtimeRiderTracking(order: Order) {
        trackingJob?.cancel()
        trackingJob = viewModelScope.launch {
            val darkStore = locationIqService.darkStores.first()
            val destLat = 20.3580
            val destLon = 85.8145

            var progress = 0.10f
            while (progress <= 1.0f) {
                _riderProgress.value = progress

                val update = locationIqService.getRiderRouteCoordinates(
                    storeLat = darkStore.latitude,
                    storeLon = darkStore.longitude,
                    destLat = destLat,
                    destLon = destLon,
                    progressFraction = progress
                )
                _riderLocation.value = update

                // Sync live rider coordinates to Supabase
                supabaseService.updateRiderLocation(
                    SupabaseRiderLocation(
                        orderId = order.orderId,
                        riderId = "rider_rajesh",
                        latitude = update.latitude,
                        longitude = update.longitude,
                        speedKmph = 32.5,
                        heading = update.bearing
                    )
                )

                // Update order status milestones
                val newStatus = when {
                    progress >= 0.95f -> OrderStatus.DELIVERED
                    progress >= 0.35f -> OrderStatus.ON_THE_WAY
                    progress >= 0.15f -> OrderStatus.PREPARING
                    else -> OrderStatus.CONFIRMED
                }

                if (_currentActiveOrder.value?.status != newStatus) {
                    val updatedOrder = _currentActiveOrder.value?.copy(
                        status = newStatus,
                        etaMinutes = update.etaMinutes
                    )
                    if (updatedOrder != null) {
                        _currentActiveOrder.value = updatedOrder
                        orderRepository.updateStatus(order.orderId, newStatus)
                    }
                }

                delay(3000)
                progress += 0.08f
            }
        }
    }

    fun startRealtimeRiderTracking(orderId: String) {
        val active = _currentActiveOrder.value
        if (active != null && active.orderId == orderId) {
            startRealtimeRiderTracking(active)
        } else {
            loadOrderById(orderId)
        }
    }

    fun setActiveOrder(order: Order) {
        _currentActiveOrder.value = order
        startRealtimeRiderTracking(order)
    }

    fun loadOrderById(orderId: String) {
        viewModelScope.launch {
            val order = orderRepository.getOrderById(orderId)
            if (order != null) {
                _currentActiveOrder.value = order
                startRealtimeRiderTracking(order)
            }
        }
    }
}

class ViewModelFactory(
    private val productRepository: ProductRepository,
    private val cartRepository: CartRepository,
    private val addressRepository: AddressRepository,
    private val orderRepository: OrderRepository,
    private val locationIqService: LocationIqService,
    private val supabaseService: SupabaseService,
    private val firebaseAuthService: FirebaseAuthService,
    private val razorpayService: RazorpayService
) : ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return when {
            modelClass.isAssignableFrom(CartViewModel::class.java) -> {
                CartViewModel(cartRepository) as T
            }
            modelClass.isAssignableFrom(AddressViewModel::class.java) -> {
                AddressViewModel(addressRepository, locationIqService) as T
            }
            modelClass.isAssignableFrom(LocationStoreViewModel::class.java) -> {
                LocationStoreViewModel(locationIqService, supabaseService) as T
            }
            modelClass.isAssignableFrom(AuthViewModel::class.java) -> {
                AuthViewModel(firebaseAuthService) as T
            }
            modelClass.isAssignableFrom(ProductViewModel::class.java) -> {
                ProductViewModel(productRepository) as T
            }
            modelClass.isAssignableFrom(OrderViewModel::class.java) -> {
                OrderViewModel(orderRepository, cartRepository, locationIqService, supabaseService, razorpayService) as T
            }
            else -> throw IllegalArgumentException("Unknown ViewModel class: ${modelClass.name}")
        }
    }
}

