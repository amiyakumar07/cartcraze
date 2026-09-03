package com.example.data.model

data class Product(
    val id: String,
    val name: String,
    val brand: String,
    val weight: String,
    val price: Double,
    val originalPrice: Double? = null,
    val discountPercent: Int? = null,
    val deliveryMinutes: Int = 10,
    val imageUrl: String,
    val category: String,
    val rating: Double = 4.5,
    val reviewCount: Int = 120,
    val description: String = "",
    val isBestSeller: Boolean = false,
    val isFreshDeal: Boolean = false,
    val unitCurrency: String = "₹"
)

data class Category(
    val id: String,
    val name: String,
    val imageUrl: String,
    val itemCount: Int = 24
)

data class CartItem(
    val product: Product,
    val quantity: Int
)

data class Address(
    val id: String,
    val tag: String, // "Home", "Work", "Other"
    val line1: String,
    val line2: String,
    val cityStateZip: String,
    val phone: String,
    val isDefault: Boolean = false
)

enum class OrderStatus(val title: String, val subtitle: String) {
    CONFIRMED("Order Confirmed", "12:30 PM"),
    PREPARING("Preparing your order", "The store is packing your items safely."),
    ON_THE_WAY("On the Way", "Delivery partner is heading to your location."),
    DELIVERED("Delivered", "Package handed over at your doorstep.")
}

data class Order(
    val orderId: String,
    val timestamp: Long = System.currentTimeMillis(),
    val items: List<CartItem>,
    val subtotal: Double,
    val deliveryFee: Double,
    val taxes: Double,
    val total: Double,
    val address: Address,
    val paymentMethod: String,
    val status: OrderStatus = OrderStatus.CONFIRMED,
    val etaMinutes: Int = 18,
    val riderName: String = "Alex M.",
    val riderRating: Double = 4.9,
    val riderDeliveries: String = "120+ deliveries",
    val riderPhotoUrl: String = "https://lh3.googleusercontent.com/aida-public/AB6AXuDmTWIgXJsfK89FtvDQrlqV9Dbq1wfSGzMnM8uqrNs2c3QSzUQfdq0hwm9q9pwF0xi_HMDw-DxRmk1xeYWcDkwEX5WMzoYaj1Oojlv1B5-WtzNTDZQ6Osw5H6Na53_rERdTuVq9_Li8H5M4207G9pxuSPEhsX2VXFWAL1yTwIaoIFPIF1ZT-S9-96GfQr5cGqlPh8gTWxusrIuTZ9n6YXxsN3QImlD4KuDuPcL1IF2Ko_G-N5O52SKf",
    val currency: String = "₹"
)

data class Coupon(
    val code: String,
    val title: String,
    val description: String,
    val discountAmount: Double,
    val minOrderValue: Double,
    val tag: String = "BEST VALUE",
    val expiryText: String = "Expires in 2 days"
)

data class BankOffer(
    val bankName: String,
    val title: String,
    val description: String,
    val discountPercent: Int = 10,
    val maxDiscount: Double = 100.0,
    val minOrder: Double = 399.0,
    val couponCode: String
)
