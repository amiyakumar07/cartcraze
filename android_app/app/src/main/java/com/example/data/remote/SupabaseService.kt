package com.example.data.remote

import android.util.Log
import com.example.BuildConfig
import com.example.data.model.Address
import com.example.data.model.CartItem
import com.example.data.model.Order
import com.example.data.model.OrderStatus
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.TimeUnit

data class SupabaseStore(
    val id: String,
    val name: String,
    val code: String,
    val lat: Double,
    val lon: Double,
    val radiusKm: Double,
    val isActive: Boolean
)

data class SupabaseRiderLocation(
    val orderId: String,
    val riderId: String,
    val latitude: Double,
    val longitude: Double,
    val speedKmph: Double,
    val heading: Float,
    val updatedAt: Long = System.currentTimeMillis()
)

data class SupabaseLiveOrder(
    val orderId: String,
    val userId: String,
    val status: String,
    val subtotal: Double,
    val deliveryFee: Double,
    val total: Double,
    val paymentMethod: String,
    val deliveryAddress: String,
    val etaMinutes: Int,
    val riderName: String,
    val createdAt: Long
)

class SupabaseService(
    private val supabaseUrl: String = BuildConfig.SUPABASE_URL,
    private val anonKey: String = BuildConfig.SUPABASE_ANON_KEY
) {
    private val client = OkHttpClient.Builder()
        .connectTimeout(12, TimeUnit.SECONDS)
        .readTimeout(12, TimeUnit.SECONDS)
        .writeTimeout(12, TimeUnit.SECONDS)
        .build()

    private val jsonMediaType = "application/json; charset=utf-8".toMediaType()

    val isConfigured: Boolean
        get() = supabaseUrl.isNotBlank() &&
                supabaseUrl != "https://your-supabase-project.supabase.co" &&
                anonKey.isNotBlank() &&
                !anonKey.startsWith("YOUR_")

    /**
     * Fetch Dark Stores from Supabase cloud database
     */
    suspend fun fetchStores(): List<SupabaseStore> = withContext(Dispatchers.IO) {
        if (!isConfigured) {
            return@withContext listOf(
                SupabaseStore("store_patia_01", "CartCraze DarkStore Hub #3", "PATIA-EXP-03", 20.3533, 85.8178, 7.5, true),
                SupabaseStore("store_jaydev_02", "CartCraze Express Hub #2", "JAYDEV-EXP-02", 20.3010, 85.8245, 6.0, true),
                SupabaseStore("store_saheed_03", "CartCraze SuperCenter Hub #1", "SAHEED-EXP-01", 20.2885, 85.8428, 8.0, true)
            )
        }

        try {
            val url = "$supabaseUrl/rest/v1/stores?select=*&is_active=eq.true"
            val request = Request.Builder()
                .url(url)
                .addHeader("apikey", anonKey)
                .addHeader("Authorization", "Bearer $anonKey")
                .build()

            val response = client.newCall(request).execute()
            if (response.isSuccessful) {
                val body = response.body?.string() ?: ""
                val array = JSONArray(body)
                val list = mutableListOf<SupabaseStore>()
                for (i in 0 until array.length()) {
                    val obj = array.getJSONObject(i)
                    list.add(
                        SupabaseStore(
                            id = obj.optString("id", "store_$i"),
                            name = obj.optString("name", "DarkStore Hub"),
                            code = obj.optString("code", "EXP-$i"),
                            lat = obj.optDouble("latitude", 20.3533),
                            lon = obj.optDouble("longitude", 85.8178),
                            radiusKm = obj.optDouble("service_radius_km", 6.0),
                            isActive = obj.optBoolean("is_active", true)
                        )
                    )
                }
                if (list.isNotEmpty()) return@withContext list
            }
        } catch (e: Exception) {
            Log.w("SupabaseService", "Fetch stores failed: ${e.message}")
        }

        listOf(
            SupabaseStore("store_patia_01", "CartCraze DarkStore Hub #3", "PATIA-EXP-03", 20.3533, 85.8178, 7.5, true)
        )
    }

    /**
     * Insert customer order into live Supabase database
     */
    suspend fun insertOrder(order: Order, userId: String = "guest_user"): Boolean = withContext(Dispatchers.IO) {
        if (!isConfigured) {
            Log.d("SupabaseService", "Mock mode: Order ${order.orderId} recorded locally")
            return@withContext true
        }

        try {
            val url = "$supabaseUrl/rest/v1/orders"
            val json = JSONObject().apply {
                put("order_id", order.orderId)
                put("user_id", userId)
                put("status", order.status.name)
                put("subtotal", order.subtotal)
                put("delivery_fee", order.deliveryFee)
                put("total", order.total)
                put("payment_method", order.paymentMethod)
                put("delivery_address", "${order.address.line1}, ${order.address.line2}")
                put("eta_minutes", order.etaMinutes)
                put("rider_name", order.riderName)
                put("created_at", System.currentTimeMillis())
            }

            val body = json.toString().toRequestBody(jsonMediaType)
            val request = Request.Builder()
                .url(url)
                .addHeader("apikey", anonKey)
                .addHeader("Authorization", "Bearer $anonKey")
                .addHeader("Prefer", "return=minimal")
                .post(body)
                .build()

            val response = client.newCall(request).execute()
            return@withContext response.isSuccessful
        } catch (e: Exception) {
            Log.w("SupabaseService", "Order sync to Supabase failed: ${e.message}")
            return@withContext false
        }
    }

    /**
     * Fetch all live orders for Store App fulfillment and Rider dispatch
     */
    suspend fun fetchLiveOrders(): List<SupabaseLiveOrder> = withContext(Dispatchers.IO) {
        if (!isConfigured) return@withContext emptyList()

        try {
            val url = "$supabaseUrl/rest/v1/orders?select=*&order=created_at.desc&limit=50"
            val request = Request.Builder()
                .url(url)
                .addHeader("apikey", anonKey)
                .addHeader("Authorization", "Bearer $anonKey")
                .build()

            val response = client.newCall(request).execute()
            if (response.isSuccessful) {
                val body = response.body?.string() ?: ""
                val array = JSONArray(body)
                val list = mutableListOf<SupabaseLiveOrder>()
                for (i in 0 until array.length()) {
                    val obj = array.getJSONObject(i)
                    list.add(
                        SupabaseLiveOrder(
                            orderId = obj.optString("order_id", ""),
                            userId = obj.optString("user_id", "guest"),
                            status = obj.optString("status", "CONFIRMED"),
                            subtotal = obj.optDouble("subtotal", 0.0),
                            deliveryFee = obj.optDouble("delivery_fee", 0.0),
                            total = obj.optDouble("total", 0.0),
                            paymentMethod = obj.optString("payment_method", "UPI"),
                            deliveryAddress = obj.optString("delivery_address", "Delivery Address"),
                            etaMinutes = obj.optInt("eta_minutes", 10),
                            riderName = obj.optString("rider_name", "Assigned Rider"),
                            createdAt = obj.optLong("created_at", System.currentTimeMillis())
                        )
                    )
                }
                return@withContext list
            }
        } catch (e: Exception) {
            Log.w("SupabaseService", "Fetch live orders failed: ${e.message}")
        }
        emptyList()
    }

    /**
     * Update order status in Supabase (e.g. from Store or Rider action)
     */
    suspend fun updateOrderStatus(orderId: String, status: String, riderName: String? = null): Boolean = withContext(Dispatchers.IO) {
        if (!isConfigured) return@withContext true

        try {
            val url = "$supabaseUrl/rest/v1/orders?order_id=eq.$orderId"
            val json = JSONObject().apply {
                put("status", status)
                if (riderName != null) {
                    put("rider_name", riderName)
                }
            }

            val body = json.toString().toRequestBody(jsonMediaType)
            val request = Request.Builder()
                .url(url)
                .addHeader("apikey", anonKey)
                .addHeader("Authorization", "Bearer $anonKey")
                .patch(body)
                .build()

            val response = client.newCall(request).execute()
            return@withContext response.isSuccessful
        } catch (e: Exception) {
            Log.w("SupabaseService", "Update order status failed: ${e.message}")
            return@withContext false
        }
    }

    /**
     * Push real-time rider location coordinates to Supabase table
     */
    suspend fun updateRiderLocation(update: SupabaseRiderLocation): Boolean = withContext(Dispatchers.IO) {
        if (!isConfigured) return@withContext true

        try {
            val url = "$supabaseUrl/rest/v1/rider_locations"
            val json = JSONObject().apply {
                put("order_id", update.orderId)
                put("rider_id", update.riderId)
                put("latitude", update.latitude)
                put("longitude", update.longitude)
                put("speed_kmph", update.speedKmph)
                put("heading", update.heading)
                put("updated_at", update.updatedAt)
            }

            val body = json.toString().toRequestBody(jsonMediaType)
            val request = Request.Builder()
                .url(url)
                .addHeader("apikey", anonKey)
                .addHeader("Authorization", "Bearer $anonKey")
                .addHeader("Prefer", "resolution=merge-duplicates")
                .post(body)
                .build()

            val response = client.newCall(request).execute()
            return@withContext response.isSuccessful
        } catch (e: Exception) {
            Log.w("SupabaseService", "Rider tracking update error: ${e.message}")
            return@withContext false
        }
    }

    /**
     * Fetch latest real-time rider position for Customer App live tracking
     */
    suspend fun fetchRiderLocation(orderId: String): SupabaseRiderLocation? = withContext(Dispatchers.IO) {
        if (!isConfigured) return@withContext null

        try {
            val url = "$supabaseUrl/rest/v1/rider_locations?order_id=eq.$orderId&order=updated_at.desc&limit=1"
            val request = Request.Builder()
                .url(url)
                .addHeader("apikey", anonKey)
                .addHeader("Authorization", "Bearer $anonKey")
                .build()

            val response = client.newCall(request).execute()
            if (response.isSuccessful) {
                val body = response.body?.string() ?: ""
                val array = JSONArray(body)
                if (array.length() > 0) {
                    val obj = array.getJSONObject(0)
                    return@withContext SupabaseRiderLocation(
                        orderId = obj.optString("order_id", orderId),
                        riderId = obj.optString("rider_id", "rider_1"),
                        latitude = obj.optDouble("latitude", 20.3533),
                        longitude = obj.optDouble("longitude", 85.8178),
                        speedKmph = obj.optDouble("speed_kmph", 28.0),
                        heading = obj.optDouble("heading", 45.0).toFloat(),
                        updatedAt = obj.optLong("updated_at", System.currentTimeMillis())
                    )
                }
            }
        } catch (e: Exception) {
            Log.w("SupabaseService", "Fetch rider location failed: ${e.message}")
        }
        null
    }
}
