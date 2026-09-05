package com.example.data.remote

import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.logging.HttpLoggingInterceptor
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.TimeUnit

/**
 * Central API Service connecting to the CartCraze Express.js backend.
 * Base URL: https://cartcraze-95gt.onrender.com/api
 * Local dev: http://10.0.2.2:4000/api (Android emulator)
 */
class CartCrazeApiService(
    private val baseUrl: String = "https://cartcraze-95gt.onrender.com/api"
) {
    private val client = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(15, TimeUnit.SECONDS)
        .writeTimeout(15, TimeUnit.SECONDS)
        .addInterceptor(HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BASIC
        })
        .build()

    private val jsonMediaType = "application/json; charset=utf-8".toMediaType()

    // ==========================================
    // HEALTH CHECK
    // ==========================================
    suspend fun healthCheck(): Boolean = withContext(Dispatchers.IO) {
        try {
            val request = Request.Builder()
                .url("$baseUrl/health")
                .build()
            val response = client.newCall(request).execute()
            response.isSuccessful
        } catch (e: Exception) {
            Log.w("CartCrazeAPI", "Health check failed: ${e.message}")
            false
        }
    }

    // ==========================================
    // PRODUCT APIs
    // ==========================================
    suspend fun fetchProducts(shopId: String? = null): List<ApiProduct> = withContext(Dispatchers.IO) {
        try {
            val url = if (shopId != null) "$baseUrl/products?shopId=$shopId" else "$baseUrl/products"
            val request = Request.Builder().url(url).build()
            val response = client.newCall(request).execute()
            if (response.isSuccessful) {
                val body = response.body?.string() ?: "[]"
                parseProductsArray(JSONArray(body))
            } else {
                Log.w("CartCrazeAPI", "Fetch products failed: ${response.code}")
                emptyList()
            }
        } catch (e: Exception) {
            Log.w("CartCrazeAPI", "Fetch products error: ${e.message}")
            emptyList()
        }
    }

    suspend fun fetchNearbyProducts(lat: Double, lon: Double, radiusKm: Double = 5.0): NearbyProductsResponse = withContext(Dispatchers.IO) {
        try {
            val url = "$baseUrl/products/nearby?lat=$lat&lon=$lon&radiusKm=$radiusKm"
            val request = Request.Builder().url(url).build()
            val response = client.newCall(request).execute()
            if (response.isSuccessful) {
                val body = response.body?.string() ?: "{}"
                val json = JSONObject(body)
                NearbyProductsResponse(
                    success = json.optBoolean("success", false),
                    inCoverageRange = json.optBoolean("inCoverageRange", false),
                    products = parseProductsArray(json.optJSONArray("products") ?: JSONArray()),
                    message = json.optString("message", "")
                )
            } else {
                NearbyProductsResponse(success = false, inCoverageRange = false, products = emptyList(), message = "Server error")
            }
        } catch (e: Exception) {
            Log.w("CartCrazeAPI", "Nearby products error: ${e.message}")
            NearbyProductsResponse(success = false, inCoverageRange = false, products = emptyList(), message = e.message ?: "Network error")
        }
    }

    // ==========================================
    // ORDER APIs
    // ==========================================
    suspend fun fetchOrders(): List<ApiOrder> = withContext(Dispatchers.IO) {
        try {
            val request = Request.Builder().url("$baseUrl/orders").build()
            val response = client.newCall(request).execute()
            if (response.isSuccessful) {
                val body = response.body?.string() ?: "[]"
                parseOrdersArray(JSONArray(body))
            } else emptyList()
        } catch (e: Exception) {
            Log.w("CartCrazeAPI", "Fetch orders error: ${e.message}")
            emptyList()
        }
    }

    suspend fun createOrder(orderData: JSONObject): ApiOrderResponse = withContext(Dispatchers.IO) {
        try {
            val body = orderData.toString().toRequestBody(jsonMediaType)
            val request = Request.Builder()
                .url("$baseUrl/orders")
                .post(body)
                .build()
            val response = client.newCall(request).execute()
            val resBody = response.body?.string() ?: "{}"
            val json = JSONObject(resBody)
            ApiOrderResponse(
                success = json.optBoolean("success", false),
                orderId = json.optJSONObject("order")?.optString("id", "") ?: "",
                status = json.optJSONObject("order")?.optString("status", "NEW") ?: "NEW",
                otp = json.optJSONObject("order")?.optString("otp", "") ?: ""
            )
        } catch (e: Exception) {
            Log.w("CartCrazeAPI", "Create order error: ${e.message}")
            ApiOrderResponse(success = false, orderId = "", status = "ERROR", otp = "")
        }
    }

    suspend fun updateOrderStatus(orderId: String, status: String): Boolean = withContext(Dispatchers.IO) {
        try {
            val json = JSONObject().apply { put("status", status) }
            val body = json.toString().toRequestBody(jsonMediaType)
            val request = Request.Builder()
                .url("$baseUrl/orders/$orderId")
                .patch(body)
                .build()
            val response = client.newCall(request).execute()
            response.isSuccessful
        } catch (e: Exception) {
            Log.w("CartCrazeAPI", "Update order status error: ${e.message}")
            false
        }
    }

    // ==========================================
    // USER APIs
    // ==========================================
    suspend fun registerUser(name: String, email: String, phone: String): ApiUser? = withContext(Dispatchers.IO) {
        try {
            val json = JSONObject().apply {
                put("name", name)
                put("email", email)
                put("phone", phone)
            }
            val body = json.toString().toRequestBody(jsonMediaType)
            val request = Request.Builder()
                .url("$baseUrl/users/register")
                .post(body)
                .build()
            val response = client.newCall(request).execute()
            if (response.isSuccessful) {
                val resBody = response.body?.string() ?: "{}"
                val resJson = JSONObject(resBody)
                if (resJson.optBoolean("success", false)) {
                    parseApiUser(resJson.optJSONObject("user") ?: JSONObject())
                } else null
            } else null
        } catch (e: Exception) {
            Log.w("CartCrazeAPI", "Register user error: ${e.message}")
            null
        }
    }

    suspend fun updateUserLocation(userId: String?, lat: Double, lon: Double, source: String = "LOGIN"): Boolean = withContext(Dispatchers.IO) {
        try {
            val json = JSONObject().apply {
                if (userId != null) put("userId", userId)
                put("lat", lat)
                put("lon", lon)
                put("source", source)
            }
            val body = json.toString().toRequestBody(jsonMediaType)
            val request = Request.Builder()
                .url("$baseUrl/users/update-location")
                .post(body)
                .build()
            val response = client.newCall(request).execute()
            response.isSuccessful
        } catch (e: Exception) {
            Log.w("CartCrazeAPI", "Update location error: ${e.message}")
            false
        }
    }

    // ==========================================
    // RAZORPAY PAYMENT APIs
    // ==========================================
    suspend fun createRazorpayOrder(amountRupees: Double): RazorpayApiResponse = withContext(Dispatchers.IO) {
        try {
            val json = JSONObject().apply { put("amount", amountRupees) }
            val body = json.toString().toRequestBody(jsonMediaType)
            val request = Request.Builder()
                .url("$baseUrl/razorpay/create-order")
                .post(body)
                .build()
            val response = client.newCall(request).execute()
            val resBody = response.body?.string() ?: "{}"
            val resJson = JSONObject(resBody)
            RazorpayApiResponse(
                success = resJson.optBoolean("success", false),
                key = resJson.optString("key", ""),
                orderId = resJson.optJSONObject("order")?.optString("id", "") ?: "",
                amount = resJson.optJSONObject("order")?.optLong("amount", 0) ?: 0
            )
        } catch (e: Exception) {
            Log.w("CartCrazeAPI", "Razorpay create order error: ${e.message}")
            RazorpayApiResponse(success = false, key = "", orderId = "", amount = 0)
        }
    }

    suspend fun verifyPayment(paymentId: String, orderId: String, signature: String): Boolean = withContext(Dispatchers.IO) {
        try {
            val json = JSONObject().apply {
                put("razorpay_payment_id", paymentId)
                put("razorpay_order_id", orderId)
                put("razorpay_signature", signature)
            }
            val body = json.toString().toRequestBody(jsonMediaType)
            val request = Request.Builder()
                .url("$baseUrl/razorpay/verify-payment")
                .post(body)
                .build()
            val response = client.newCall(request).execute()
            response.isSuccessful
        } catch (e: Exception) {
            Log.w("CartCrazeAPI", "Verify payment error: ${e.message}")
            false
        }
    }

    // ==========================================
    // RIDER APIs
    // ==========================================
    suspend fun fetchRiderLocation(orderId: String): RiderApiLocation? = withContext(Dispatchers.IO) {
        try {
            val request = Request.Builder()
                .url("$baseUrl/locationiq/order-location/$orderId")
                .build()
            val response = client.newCall(request).execute()
            if (response.isSuccessful) {
                val body = response.body?.string() ?: "{}"
                val json = JSONObject(body)
                val loc = json.optJSONObject("location")
                if (loc != null) {
                    RiderApiLocation(
                        riderId = loc.optString("riderId", ""),
                        riderName = loc.optString("riderName", "Delivery Partner"),
                        lat = loc.optDouble("lat", 0.0),
                        lon = loc.optDouble("lon", 0.0),
                        speed = loc.optDouble("speed", 0.0),
                        distanceRemainingKm = loc.optDouble("distanceRemainingKm", 0.0),
                        etaMinutes = loc.optInt("etaMinutes", 0),
                        status = loc.optString("status", "EN_ROUTE")
                    )
                } else null
            } else null
        } catch (e: Exception) {
            Log.w("CartCrazeAPI", "Fetch rider location error: ${e.message}")
            null
        }
    }

    // ==========================================
    // SHOP APIs
    // ==========================================
    suspend fun fetchShops(): List<ApiShop> = withContext(Dispatchers.IO) {
        try {
            val request = Request.Builder().url("$baseUrl/shops").build()
            val response = client.newCall(request).execute()
            if (response.isSuccessful) {
                val body = response.body?.string() ?: "{}"
                val json = JSONObject(body)
                val shops = json.optJSONArray("shops") ?: JSONArray()
                val list = mutableListOf<ApiShop>()
                for (i in 0 until shops.length()) {
                    val s = shops.getJSONObject(i)
                    list.add(ApiShop(
                        id = s.optString("id"),
                        name = s.optString("name"),
                        email = s.optString("email"),
                        phone = s.optString("phone"),
                        address = s.optString("address"),
                        lat = s.optDouble("lat", 0.0),
                        lon = s.optDouble("lon", 0.0),
                        status = s.optString("status")
                    ))
                }
                list
            } else emptyList()
        } catch (e: Exception) {
            Log.w("CartCrazeAPI", "Fetch shops error: ${e.message}")
            emptyList()
        }
    }

    suspend fun updateProductStock(productId: String, stockCount: Int, inStock: Boolean): Boolean = withContext(Dispatchers.IO) {
        try {
            val json = JSONObject().apply {
                put("stockCount", stockCount)
                put("inStock", inStock)
            }
            val body = json.toString().toRequestBody(jsonMediaType)
            val request = Request.Builder()
                .url("$baseUrl/products/$productId")
                .patch(body)
                .build()
            val response = client.newCall(request).execute()
            response.isSuccessful
        } catch (e: Exception) {
            Log.w("CartCrazeAPI", "Update stock error: ${e.message}")
            false
        }
    }

    // ==========================================
    // DARKSTORE APIs
    // ==========================================
    suspend fun fetchDarkstores(): List<ApiDarkstore> = withContext(Dispatchers.IO) {
        try {
            val request = Request.Builder().url("$baseUrl/darkstores").build()
            val response = client.newCall(request).execute()
            if (response.isSuccessful) {
                val body = response.body?.string() ?: "[]"
                val arr = JSONArray(body)
                val list = mutableListOf<ApiDarkstore>()
                for (i in 0 until arr.length()) {
                    val d = arr.getJSONObject(i)
                    list.add(ApiDarkstore(
                        id = d.optString("id"),
                        name = d.optString("name"),
                        lat = d.optDouble("lat", 0.0),
                        lon = d.optDouble("lon", 0.0),
                        status = d.optString("status")
                    ))
                }
                list
            } else emptyList()
        } catch (e: Exception) {
            Log.w("CartCrazeAPI", "Fetch darkstores error: ${e.message}")
            emptyList()
        }
    }

    // ==========================================
    // PARSING HELPERS
    // ==========================================
    private fun parseProductsArray(array: JSONArray): List<ApiProduct> {
        val list = mutableListOf<ApiProduct>()
        for (i in 0 until array.length()) {
            val p = array.getJSONObject(i)
            list.add(ApiProduct(
                id = p.optString("id", "p$i"),
                shopId = p.optString("shopId", ""),
                name = p.optString("name", "Product"),
                description = p.optString("description", ""),
                category = p.optString("category", "General"),
                price = p.optDouble("price", 0.0),
                originalPrice = p.optDouble("originalPrice", 0.0),
                weight = p.optString("weight", "1 unit"),
                stockCount = p.optInt("stockCount", 0),
                inStock = p.optBoolean("inStock", true),
                image = p.optString("image", ""),
                barcode = p.optString("barcode", ""),
                shelfLocation = p.optString("shelfLocation", ""),
                origin = p.optString("origin", ""),
                shelfLife = p.optString("shelfLife", ""),
                shopName = p.optString("shopName", "")
            ))
        }
        return list
    }

    private fun parseOrdersArray(array: JSONArray): List<ApiOrder> {
        val list = mutableListOf<ApiOrder>()
        for (i in 0 until array.length()) {
            val o = array.getJSONObject(i)
            list.add(ApiOrder(
                id = o.optString("id", ""),
                status = o.optString("status", "NEW"),
                orderTime = o.optString("orderTime", ""),
                shopId = o.optString("shopId", ""),
                darkstoreName = o.optString("darkstoreName", ""),
                customerName = o.optString("customerName", ""),
                customerPhone = o.optString("customerPhone", ""),
                finalTotal = o.optDouble("finalTotal", 0.0),
                paymentMethod = o.optString("paymentMethod", "UPI"),
                paymentStatus = o.optString("paymentStatus", "PAID"),
                otp = o.optString("otp", "")
            ))
        }
        return list
    }

    private fun parseApiUser(obj: JSONObject): ApiUser {
        return ApiUser(
            id = obj.optString("id", ""),
            name = obj.optString("name", ""),
            email = obj.optString("email", ""),
            phone = obj.optString("phone", ""),
            status = obj.optString("status", "ACTIVE")
        )
    }
}

// ==========================================
// API DATA CLASSES
// ==========================================
data class ApiProduct(
    val id: String,
    val shopId: String,
    val name: String,
    val description: String = "",
    val category: String,
    val price: Double,
    val originalPrice: Double,
    val weight: String,
    val stockCount: Int,
    val inStock: Boolean,
    val image: String,
    val barcode: String = "",
    val shelfLocation: String = "",
    val origin: String = "",
    val shelfLife: String = "",
    val shopName: String = ""
)

data class ApiOrder(
    val id: String,
    val status: String,
    val orderTime: String,
    val shopId: String,
    val darkstoreName: String,
    val customerName: String,
    val customerPhone: String,
    val finalTotal: Double,
    val paymentMethod: String,
    val paymentStatus: String,
    val otp: String
)

data class ApiOrderResponse(
    val success: Boolean,
    val orderId: String,
    val status: String,
    val otp: String
)

data class NearbyProductsResponse(
    val success: Boolean,
    val inCoverageRange: Boolean,
    val products: List<ApiProduct>,
    val message: String
)

data class RazorpayApiResponse(
    val success: Boolean,
    val key: String,
    val orderId: String,
    val amount: Long
)

data class ApiUser(
    val id: String,
    val name: String,
    val email: String,
    val phone: String,
    val status: String
)

data class RiderApiLocation(
    val riderId: String,
    val riderName: String,
    val lat: Double,
    val lon: Double,
    val speed: Double,
    val distanceRemainingKm: Double,
    val etaMinutes: Int,
    val status: String
)

data class ApiShop(
    val id: String,
    val name: String,
    val email: String,
    val phone: String,
    val address: String,
    val lat: Double,
    val lon: Double,
    val status: String
)

data class ApiDarkstore(
    val id: String,
    val name: String,
    val lat: Double,
    val lon: Double,
    val status: String
)
