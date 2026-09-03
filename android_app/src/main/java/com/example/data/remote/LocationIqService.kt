package com.example.data.remote

import android.util.Log
import com.example.BuildConfig
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import org.json.JSONArray
import org.json.JSONObject
import java.net.URLEncoder
import java.util.concurrent.TimeUnit
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.sin
import kotlin.math.sqrt

data class DarkStore(
    val id: String,
    val name: String,
    val code: String,
    val address: String,
    val latitude: Double,
    val longitude: Double,
    val serviceRadiusKm: Double = 6.0,
    val avgDeliveryMinutes: Int = 10,
    val isOpen: Boolean = true
)

data class StoreAvailability(
    val isAvailable: Boolean,
    val nearestStore: DarkStore?,
    val distanceKm: Double,
    val estimatedMinutes: Int,
    val statusMessage: String,
    val conformedAddress: String,
    val isExpressAvailable: Boolean
)

data class LocationSearchResult(
    val placeId: String,
    val displayName: String,
    val latitude: Double,
    val longitude: Double,
    val road: String = "",
    val suburb: String = "",
    val city: String = "",
    val postcode: String = ""
)

data class RiderLocationUpdate(
    val latitude: Double,
    val longitude: Double,
    val bearing: Float,
    val distanceRemainingKm: Double,
    val etaMinutes: Int,
    val stepIndex: Int,
    val statusText: String
)

class LocationIqService(
    private val apiKey: String = BuildConfig.LOCATIONIQ_API_KEY
) {
    private val client = OkHttpClient.Builder()
        .connectTimeout(10, TimeUnit.SECONDS)
        .readTimeout(10, TimeUnit.SECONDS)
        .build()

    // Pre-configured network of Express Dark Stores in city hubs
    val darkStores = listOf(
        DarkStore(
            id = "store_patia_01",
            name = "CartCraze DarkStore Hub #3",
            code = "PATIA-EXP-03",
            address = "KIIT Road, Patia, Bhubaneswar, 751024",
            latitude = 20.3533,
            longitude = 85.8178,
            serviceRadiusKm = 7.5,
            avgDeliveryMinutes = 8,
            isOpen = true
        ),
        DarkStore(
            id = "store_jaydev_02",
            name = "CartCraze Express Hub #2",
            code = "JAYDEV-EXP-02",
            address = "Jaydev Vihar Sq, Nayapalli, Bhubaneswar, 751015",
            latitude = 20.3010,
            longitude = 85.8245,
            serviceRadiusKm = 6.0,
            avgDeliveryMinutes = 10,
            isOpen = true
        ),
        DarkStore(
            id = "store_saheed_03",
            name = "CartCraze SuperCenter Hub #1",
            code = "SAHEED-EXP-01",
            address = "Janpath Road, Saheed Nagar, Bhubaneswar, 751007",
            latitude = 20.2885,
            longitude = 85.8428,
            serviceRadiusKm = 8.0,
            avgDeliveryMinutes = 10,
            isOpen = true
        ),
        DarkStore(
            id = "store_chandrasekharpur_04",
            name = "CartCraze QuickMart Hub #4",
            code = "CSPUR-EXP-04",
            address = "Damana Square, Chandrasekharpur, Bhubaneswar, 751016",
            latitude = 20.3275,
            longitude = 85.8190,
            serviceRadiusKm = 6.5,
            avgDeliveryMinutes = 9,
            isOpen = true
        )
    )

    /**
     * Search address or geocode using LocationIQ API with graceful offline fallback
     */
    suspend fun searchAddress(query: String): List<LocationSearchResult> = withContext(Dispatchers.IO) {
        if (query.isBlank()) return@withContext emptyList()

        if (apiKey.isNotBlank() && apiKey != "MY_LOCATIONIQ_KEY" && !apiKey.startsWith("YOUR_")) {
            try {
                val encoded = URLEncoder.encode(query, "UTF-8")
                val url = "https://us1.locationiq.com/v1/search?key=$apiKey&q=$encoded&format=json&addressdetails=1&countrycodes=in&limit=5"
                val request = Request.Builder().url(url).build()
                val response = client.newCall(request).execute()
                if (response.isSuccessful) {
                    val body = response.body?.string() ?: ""
                    val jsonArray = JSONArray(body)
                    val results = mutableListOf<LocationSearchResult>()
                    for (i in 0 until jsonArray.length()) {
                        val obj = jsonArray.getJSONObject(i)
                        val addressObj = obj.optJSONObject("address")
                        results.add(
                            LocationSearchResult(
                                placeId = obj.optString("place_id", i.toString()),
                                displayName = obj.optString("display_name", query),
                                latitude = obj.optDouble("lat", 20.3533),
                                longitude = obj.optDouble("lon", 85.8178),
                                road = addressObj?.optString("road", "") ?: "",
                                suburb = addressObj?.optString("suburb", "") ?: "",
                                city = addressObj?.optString("city", "Bhubaneswar") ?: "Bhubaneswar",
                                postcode = addressObj?.optString("postcode", "751024") ?: "751024"
                            )
                        )
                    }
                    if (results.isNotEmpty()) return@withContext results
                }
            } catch (e: Exception) {
                Log.w("LocationIqService", "LocationIQ search API error: ${e.message}")
            }
        }

        // High fidelity simulated geocoding for Indian cities & local areas
        val q = query.lowercase().trim()
        val mockPlaces = listOf(
            LocationSearchResult("p1", "Patia, KIIT Square, Bhubaneswar, Odisha 751024", 20.3535, 85.8180, "KIIT Road", "Patia", "Bhubaneswar", "751024"),
            LocationSearchResult("p2", "Infocity DLF Cybercity, Patia, Bhubaneswar, 751024", 20.3580, 85.8145, "Infocity Avenue", "Patia", "Bhubaneswar", "751024"),
            LocationSearchResult("p3", "Jaydev Vihar Square, Bhubaneswar, Odisha 751015", 20.3015, 85.8240, "Nandankanan Road", "Jaydev Vihar", "Bhubaneswar", "751015"),
            LocationSearchResult("p4", "Saheed Nagar, Janpath, Bhubaneswar, Odisha 751007", 20.2890, 85.8430, "Janpath Road", "Saheed Nagar", "Bhubaneswar", "751007"),
            LocationSearchResult("p5", "Chandrasekharpur Damana Square, Bhubaneswar, 751016", 20.3280, 85.8195, "Damana Road", "CSPur", "Bhubaneswar", "751016"),
            LocationSearchResult("p6", "Khandagiri Square, NH16, Bhubaneswar, 751030", 20.2600, 85.7850, "Khandagiri Road", "Khandagiri", "Bhubaneswar", "751030"),
            LocationSearchResult("p7", "Koramangala 4th Block, Bangalore, Karnataka 560034", 12.9352, 77.6245, "100 Feet Road", "Koramangala", "Bengaluru", "560034"),
            LocationSearchResult("p8", "Indiranagar 100ft Road, Bangalore, 560038", 12.9784, 77.6408, "100ft Road", "Indiranagar", "Bengaluru", "560038"),
            LocationSearchResult("p9", "HSR Layout Sector 1, Bengaluru, Karnataka 560102", 12.9121, 77.6446, "27th Main", "HSR Layout", "Bengaluru", "560102")
        )

        val filtered = mockPlaces.filter { it.displayName.lowercase().contains(q) || it.road.lowercase().contains(q) || it.suburb.lowercase().contains(q) }
        if (filtered.isNotEmpty()) filtered else listOf(
            LocationSearchResult(
                placeId = "custom_loc",
                displayName = "$query, Bhubaneswar, Odisha 751024",
                latitude = 20.3540,
                longitude = 85.8190,
                road = query,
                suburb = "Patia",
                city = "Bhubaneswar",
                postcode = "751024"
            )
        )
    }

    /**
     * Reverse Geocode coordinates to an address using LocationIQ
     */
    suspend fun reverseGeocode(lat: Double, lon: Double): LocationSearchResult = withContext(Dispatchers.IO) {
        if (apiKey.isNotBlank() && apiKey != "MY_LOCATIONIQ_KEY" && !apiKey.startsWith("YOUR_")) {
            try {
                val url = "https://us1.locationiq.com/v1/reverse?key=$apiKey&lat=$lat&lon=$lon&format=json&addressdetails=1"
                val request = Request.Builder().url(url).build()
                val response = client.newCall(request).execute()
                if (response.isSuccessful) {
                    val body = response.body?.string() ?: ""
                    val obj = JSONObject(body)
                    val addr = obj.optJSONObject("address")
                    return@withContext LocationSearchResult(
                        placeId = obj.optString("place_id", "rev_1"),
                        displayName = obj.optString("display_name", "Current Location"),
                        latitude = lat,
                        longitude = lon,
                        road = addr?.optString("road", "") ?: "",
                        suburb = addr?.optString("suburb", "") ?: "",
                        city = addr?.optString("city", "Bhubaneswar") ?: "Bhubaneswar",
                        postcode = addr?.optString("postcode", "751024") ?: "751024"
                    )
                }
            } catch (e: Exception) {
                Log.w("LocationIqService", "Reverse geocode error: ${e.message}")
            }
        }

        LocationSearchResult(
            placeId = "current_pin",
            displayName = "Patia, KIIT Square, Bhubaneswar, Odisha 751024",
            latitude = lat,
            longitude = lon,
            road = "KIIT Road",
            suburb = "Patia",
            city = "Bhubaneswar",
            postcode = "751024"
        )
    }

    /**
     * Check if user's address/coordinates are within dark store delivery radius
     */
    fun checkStoreAvailability(lat: Double, lon: Double, addressHint: String = "Your Address"): StoreAvailability {
        var nearest: DarkStore? = null
        var minDistance = Double.MAX_VALUE

        for (store in darkStores) {
            val dist = calculateDistanceKm(lat, lon, store.latitude, store.longitude)
            if (dist < minDistance) {
                minDistance = dist
                nearest = store
            }
        }

        val nearestStore = nearest ?: darkStores.first()
        val isDeliverable = minDistance <= nearestStore.serviceRadiusKm && nearestStore.isOpen
        val etaMinutes = if (minDistance <= 2.0) 8 else if (minDistance <= 4.0) 10 else 15

        val status = when {
            isDeliverable -> "✅ 8-10 Min Express Delivery Available from ${nearestStore.name} (${String.format("%.1f", minDistance)} km away)"
            minDistance <= 12.0 -> "⚠️ Standard 30-45 Min Delivery available (Nearest Hub is ${String.format("%.1f", minDistance)} km away)"
            else -> "❌ Location currently outside our dark store network (Nearest Hub: ${String.format("%.1f", minDistance)} km)"
        }

        return StoreAvailability(
            isAvailable = isDeliverable,
            nearestStore = nearestStore,
            distanceKm = minDistance,
            estimatedMinutes = if (isDeliverable) etaMinutes else 35,
            statusMessage = status,
            conformedAddress = addressHint,
            isExpressAvailable = isDeliverable && minDistance <= 5.0
        )
    }

    /**
     * Check store availability by address text lookup
     */
    suspend fun checkStoreAvailabilityForAddress(address: String): StoreAvailability {
        val results = searchAddress(address)
        val best = results.firstOrNull() ?: LocationSearchResult("default", address, 20.3533, 85.8178)
        return checkStoreAvailability(best.latitude, best.longitude, best.displayName)
    }

    /**
     * Generate step-by-step rider interpolation coordinates along route
     * from Dark Store Hub to User's delivery destination
     */
    fun getRiderRouteCoordinates(
        storeLat: Double,
        storeLon: Double,
        destLat: Double,
        destLon: Double,
        progressFraction: Float // 0.0f = store, 1.0f = destination
    ): RiderLocationUpdate {
        val clampedProgress = progressFraction.coerceIn(0.0f, 1.0f)
        val currentLat = storeLat + (destLat - storeLat) * clampedProgress
        val currentLon = storeLon + (destLon - storeLon) * clampedProgress

        val totalDist = calculateDistanceKm(storeLat, storeLon, destLat, destLon)
        val distRemaining = (totalDist * (1.0 - clampedProgress)).coerceAtLeast(0.05)
        val etaMinutes = (distRemaining * 3.5).toInt().coerceAtLeast(1)

        val bearing = calculateBearing(currentLat, currentLon, destLat, destLon)
        val status = when {
            clampedProgress < 0.15f -> "Rider picked up order from ${darkStores.first().name}"
            clampedProgress < 0.50f -> "Rider in transit • 35 km/h on main route"
            clampedProgress < 0.85f -> "Rider approaching your neighborhood (${String.format("%.1f", distRemaining)} km left)"
            clampedProgress < 0.98f -> "Rider arrived at your building gate! 🚪"
            else -> "Package successfully handed over at doorstep 🎉"
        }

        return RiderLocationUpdate(
            latitude = currentLat,
            longitude = currentLon,
            bearing = bearing.toFloat(),
            distanceRemainingKm = distRemaining,
            etaMinutes = etaMinutes,
            stepIndex = (clampedProgress * 100).toInt(),
            statusText = status
        )
    }

    /**
     * Haversine formula for distance in Kilometers
     */
    private fun calculateDistanceKm(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Double {
        val r = 6371.0 // Earth radius in km
        val dLat = Math.toRadians(lat2 - lat1)
        val dLon = Math.toRadians(lon2 - lon1)
        val a = sin(dLat / 2) * sin(dLat / 2) +
                cos(Math.toRadians(lat1)) * cos(Math.toRadians(lat2)) *
                sin(dLon / 2) * sin(dLon / 2)
        val c = 2 * atan2(sqrt(a), sqrt(1 - a))
        return r * c
    }

    private fun calculateBearing(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Double {
        val y = sin(Math.toRadians(lon2 - lon1)) * cos(Math.toRadians(lat2))
        val x = cos(Math.toRadians(lat1)) * sin(Math.toRadians(lat2)) -
                sin(Math.toRadians(lat1)) * cos(Math.toRadians(lat2)) * cos(Math.toRadians(lon2 - lon1))
        val bearing = Math.toDegrees(atan2(y, x))
        return (bearing + 360) % 360
    }
}
