package com.example.data.remote

import android.util.Log
import com.example.BuildConfig
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext
import java.util.UUID

data class RazorpayOrder(
    val id: String,
    val amountInPaise: Long,
    val amountInRupees: Double,
    val currency: String = "INR",
    val receiptId: String,
    val keyId: String,
    val status: String = "created"
)

data class RazorpayPaymentResponse(
    val isSuccess: Boolean,
    val paymentId: String,
    val orderId: String,
    val signature: String,
    val paymentMethodUsed: String,
    val message: String
)

class RazorpayService(
    private val keyId: String = BuildConfig.RAZORPAY_KEY_ID
) {
    private val activeKeyId: String
        get() = if (keyId.isNotBlank() && !keyId.startsWith("YOUR_")) keyId else "rzp_test_CartCrazePayKey"

    /**
     * Create a Razorpay Order
     */
    suspend fun createOrder(amountRupees: Double, receiptTag: String = "order_rcpt"): RazorpayOrder = withContext(Dispatchers.IO) {
        val amountInPaise = (amountRupees * 100).toLong()
        val orderId = "order_${UUID.randomUUID().toString().replace("-", "").take(14)}"
        val receipt = "${receiptTag}_${System.currentTimeMillis() % 100000}"

        Log.d("RazorpayService", "Created Razorpay Order: $orderId for ₹$amountRupees ($amountInPaise paise)")

        RazorpayOrder(
            id = orderId,
            amountInPaise = amountInPaise,
            amountInRupees = amountRupees,
            currency = "INR",
            receiptId = receipt,
            keyId = activeKeyId,
            status = "created"
        )
    }

    /**
     * Process and verify payment for selected instrument
     */
    suspend fun processPayment(
        razorpayOrder: RazorpayOrder,
        method: String,
        details: String = ""
    ): RazorpayPaymentResponse = withContext(Dispatchers.IO) {
        // Simulate network roundtrip to Razorpay payment gateway
        delay(1200)

        val paymentId = "pay_${UUID.randomUUID().toString().replace("-", "").take(14)}"
        val mockSignature = "sig_${UUID.randomUUID().toString().replace("-", "").take(20)}"

        RazorpayPaymentResponse(
            isSuccess = true,
            paymentId = paymentId,
            orderId = razorpayOrder.id,
            signature = mockSignature,
            paymentMethodUsed = method,
            message = "Payment of ₹${String.format("%.2f", razorpayOrder.amountInRupees)} received successfully via $method."
        )
    }
}
