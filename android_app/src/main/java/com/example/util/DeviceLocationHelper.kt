package com.example.util

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Bundle
import android.os.Looper
import android.util.Log
import androidx.core.content.ContextCompat

object DeviceLocationHelper {

    private const val TAG = "DeviceLocationHelper"

    fun hasLocationPermission(context: Context): Boolean {
        val fine = ContextCompat.checkSelfPermission(
            context,
            Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED

        val coarse = ContextCompat.checkSelfPermission(
            context,
            Manifest.permission.ACCESS_COARSE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED

        return fine || coarse
    }

    /**
     * Retrieve current device location via Android LocationManager with safe fallbacks.
     */
    fun fetchCurrentCoordinates(
        context: Context,
        onLocationFound: (latitude: Double, longitude: Double, isAccurateGps: Boolean) -> Unit
    ) {
        if (!hasLocationPermission(context)) {
            Log.d(TAG, "Location permission not granted, using default city hub coordinates")
            onLocationFound(20.3535, 85.8180, false)
            return
        }

        try {
            val locationManager = context.getSystemService(Context.LOCATION_SERVICE) as? LocationManager
            if (locationManager == null) {
                onLocationFound(20.3535, 85.8180, false)
                return
            }

            var bestLocation: Location? = null

            // 1. Check last known location from available providers
            val providers = listOf(
                LocationManager.GPS_PROVIDER,
                LocationManager.NETWORK_PROVIDER,
                LocationManager.PASSIVE_PROVIDER
            )

            for (provider in providers) {
                if (locationManager.isProviderEnabled(provider)) {
                    try {
                        val loc = locationManager.getLastKnownLocation(provider)
                        if (loc != null) {
                            if (bestLocation == null || loc.accuracy < bestLocation.accuracy) {
                                bestLocation = loc
                            }
                        }
                    } catch (se: SecurityException) {
                        Log.w(TAG, "SecurityException on provider $provider: ${se.message}")
                    }
                }
            }

            if (bestLocation != null) {
                Log.d(TAG, "Obtained last known location: ${bestLocation.latitude}, ${bestLocation.longitude}")
                onLocationFound(bestLocation.latitude, bestLocation.longitude, true)
                return
            }

            // 2. If no last known location, request a single location update from GPS / Network provider
            val activeProvider = when {
                locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER) -> LocationManager.GPS_PROVIDER
                locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER) -> LocationManager.NETWORK_PROVIDER
                else -> null
            }

            if (activeProvider != null) {
                val singleListener = object : LocationListener {
                    override fun onLocationChanged(location: Location) {
                        locationManager.removeUpdates(this)
                        onLocationFound(location.latitude, location.longitude, true)
                    }

                    @Deprecated("Deprecated in Java")
                    override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) {}
                    override fun onProviderEnabled(provider: String) {}
                    override fun onProviderDisabled(provider: String) {}
                }

                try {
                    locationManager.requestSingleUpdate(activeProvider, singleListener, Looper.getMainLooper())
                    return
                } catch (e: Exception) {
                    Log.w(TAG, "requestSingleUpdate error: ${e.message}")
                }
            }

            // Default fallback
            onLocationFound(20.3535, 85.8180, false)

        } catch (e: Exception) {
            Log.e(TAG, "Error fetching location: ${e.message}", e)
            onLocationFound(20.3535, 85.8180, false)
        }
    }
}
