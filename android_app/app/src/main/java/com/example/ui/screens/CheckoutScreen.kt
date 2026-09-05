package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountBalance
import androidx.compose.material.icons.filled.AccountBalanceWallet
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.Bolt
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.CreditCard
import androidx.compose.material.icons.filled.ExpandLess
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.LocalOffer
import androidx.compose.material.icons.filled.LocalShipping
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Payments
import androidx.compose.material.icons.filled.QrCodeScanner
import androidx.compose.material.icons.filled.ReceiptLong
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material.icons.filled.VerifiedUser
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.RadioButton
import androidx.compose.material3.RadioButtonDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.data.SampleData
import com.example.data.model.CartItem
import com.example.data.model.Order
import com.example.ui.components.RazorpayCheckoutSheet
import com.example.ui.theme.AmberTertiary
import com.example.ui.theme.AmberTertiaryContainer
import com.example.ui.theme.EmeraldPrimary
import com.example.ui.theme.EmeraldPrimaryContainer
import com.example.ui.theme.ErrorColor
import com.example.ui.theme.OnEmeraldPrimary
import com.example.ui.theme.OnEmeraldPrimaryContainer
import com.example.ui.theme.OutlineColor
import com.example.ui.theme.OutlineVariantColor
import com.example.ui.theme.SurfaceContainer
import com.example.ui.theme.SurfaceContainerHighest
import com.example.ui.theme.SurfaceContainerLow
import com.example.ui.theme.SurfaceContainerLowest
import com.example.ui.viewmodel.AddressViewModel
import com.example.ui.viewmodel.CartViewModel
import com.example.ui.viewmodel.OrderViewModel

@Composable
fun CheckoutScreen(
    cartViewModel: CartViewModel,
    addressViewModel: AddressViewModel,
    orderViewModel: OrderViewModel,
    onBack: () -> Unit,
    onChangeAddress: () -> Unit,
    onOrderPlaced: (Order) -> Unit,
    modifier: Modifier = Modifier
) {
    val rawCartItems by cartViewModel.cartItems.collectAsState()
    val appliedCoupon by cartViewModel.appliedCoupon.collectAsState()
    val tipAmount by cartViewModel.deliveryTip.collectAsState()
    val selectedInstructions by cartViewModel.selectedInstructions.collectAsState()
    val isNoContact by cartViewModel.isNoContactDelivery.collectAsState()
    val selectedAddress by addressViewModel.selectedAddress.collectAsState()

    val items = rawCartItems

    val currency = items.firstOrNull()?.product?.unitCurrency ?: "₹"
    val subtotal = items.sumOf { it.product.price * it.quantity }
    val mrpTotal = items.sumOf { (it.product.originalPrice ?: it.product.price) * it.quantity }
    val productSavings = (mrpTotal - subtotal).coerceAtLeast(0.0)

    val freeDeliveryThreshold = 199.0
    val isFreeDelivery = subtotal >= freeDeliveryThreshold || appliedCoupon?.code == "CRAZEFREE"
    val standardDeliveryFee = 25.0
    val deliveryFee = if (isFreeDelivery) 0.0 else standardDeliveryFee
    val handlingFee = 4.0
    val taxes = 15.0

    val couponDiscount = if (appliedCoupon != null && subtotal >= (appliedCoupon?.minOrderValue ?: 0.0)) {
        if (appliedCoupon?.code == "CRAZEFREE") 0.0 else appliedCoupon?.discountAmount ?: 0.0
    } else 0.0

    val deliverySavings = if (isFreeDelivery) standardDeliveryFee else 0.0
    val totalSavings = productSavings + couponDiscount + deliverySavings

    val total = (subtotal + deliveryFee + handlingFee + taxes + tipAmount - couponDiscount).coerceAtLeast(0.0)

    var orderSummaryExpanded by remember { mutableStateOf(false) }
    var selectedPaymentMethod by remember { mutableStateOf("Google Pay (UPI)") }
    var selectedPaymentCategory by remember { mutableStateOf("UPI") }
    var isPlacingOrder by remember { mutableStateOf(false) }
    var showRazorpaySheet by remember { mutableStateOf(false) }

    val currentAddress = selectedAddress ?: Address(
        id = "addr_user_current",
        tag = "Home",
        line1 = "Patia, Bhubaneswar",
        line2 = "Odisha",
        cityStateZip = "Bhubaneswar, 751024",
        phone = "+91 98765 43210",
        isDefault = true
    )

    if (showRazorpaySheet) {
        RazorpayCheckoutSheet(
            amount = total,
            currency = currency,
            onDismiss = { showRazorpaySheet = false },
            onPaymentSuccess = { paymentId, orderId ->
                showRazorpaySheet = false
                isPlacingOrder = true
                orderViewModel.placeOrder(
                    items = items,
                    address = currentAddress,
                    paymentMethod = "Razorpay ($paymentId)",
                    deliveryFee = deliveryFee,
                    taxes = taxes,
                    currency = currency,
                    discount = couponDiscount,
                    tip = tipAmount,
                    onSuccess = { placedOrder ->
                        onOrderPlaced(placedOrder)
                    }
                )
            }
        )
    }

    Box(modifier = modifier.fillMaxSize().background(MaterialTheme.colorScheme.background)) {
        Column(modifier = Modifier.fillMaxSize()) {
            // Top App Bar
            Surface(
                modifier = Modifier.fillMaxWidth(),
                color = MaterialTheme.colorScheme.surface,
                shadowElevation = 2.dp
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 8.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    IconButton(
                        onClick = onBack,
                        modifier = Modifier.testTag("checkout_back_btn")
                    ) {
                        Icon(
                            imageVector = Icons.Filled.ArrowBack,
                            contentDescription = "Back",
                            tint = EmeraldPrimary
                        )
                    }

                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "Checkout & Payment",
                            style = MaterialTheme.typography.titleLarge,
                            color = MaterialTheme.colorScheme.onSurface,
                            fontWeight = FontWeight.Bold
                        )
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Filled.Bolt,
                                contentDescription = null,
                                tint = AmberTertiary,
                                modifier = Modifier.size(12.dp)
                            )
                            Text(
                                text = "Express Delivery in 8-10 Mins",
                                style = MaterialTheme.typography.labelSmall,
                                color = EmeraldPrimary,
                                fontWeight = FontWeight.Bold,
                                fontSize = 11.sp
                            )
                        }
                    }

                    Spacer(modifier = Modifier.size(48.dp))
                }
            }

            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .testTag("checkout_content"),
                contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 14.dp, bottom = 130.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Delivery Address & ETA Card
                item {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(16.dp))
                            .testTag("checkout_address_section"),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = SurfaceContainerLowest),
                        border = CardDefaults.outlinedCardBorder().copy(
                            brush = androidx.compose.ui.graphics.SolidColor(OutlineVariantColor.copy(alpha = 0.4f))
                        )
                    ) {
                        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Filled.LocationOn,
                                        contentDescription = null,
                                        tint = EmeraldPrimary,
                                        modifier = Modifier.size(20.dp)
                                    )
                                    Text(
                                        text = "Delivering to ${currentAddress.tag}",
                                        style = MaterialTheme.typography.titleMedium,
                                        color = MaterialTheme.colorScheme.onSurface,
                                        fontWeight = FontWeight.Bold
                                    )
                                }

                                TextButton(
                                    onClick = onChangeAddress,
                                    modifier = Modifier.testTag("change_address_btn")
                                ) {
                                    Text(
                                        text = "CHANGE",
                                        style = MaterialTheme.typography.labelMedium,
                                        color = EmeraldPrimary,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }

                            Surface(
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(10.dp),
                                color = SurfaceContainerLow
                            ) {
                                Column(modifier = Modifier.padding(10.dp), verticalArrangement = Arrangement.spacedBy(3.dp)) {
                                    Text(
                                        text = "${currentAddress.line1}, ${currentAddress.line2}",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurface,
                                        lineHeight = 16.sp
                                    )
                                    Text(
                                        text = "Phone: ${currentAddress.phone}",
                                        style = MaterialTheme.typography.labelSmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }

                            // Active delivery instructions
                            if (selectedInstructions.isNotEmpty() || isNoContact) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Filled.CheckCircle,
                                        contentDescription = null,
                                        tint = EmeraldPrimary,
                                        modifier = Modifier.size(14.dp)
                                    )
                                    Text(
                                        text = buildString {
                                            if (isNoContact) append("No-Contact Delivery • ")
                                            append(selectedInstructions.joinToString(" • "))
                                        },
                                        style = MaterialTheme.typography.labelSmall,
                                        color = EmeraldPrimary,
                                        maxLines = 1,
                                        overflow = TextOverflow.Ellipsis
                                    )
                                }
                            }
                        }
                    }
                }

                // Collapsible Order Summary Card
                item {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(16.dp))
                            .testTag("checkout_order_summary"),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = SurfaceContainerLowest),
                        border = CardDefaults.outlinedCardBorder().copy(
                            brush = androidx.compose.ui.graphics.SolidColor(OutlineVariantColor.copy(alpha = 0.4f))
                        )
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable { orderSummaryExpanded = !orderSummaryExpanded },
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Filled.ShoppingCart,
                                        contentDescription = null,
                                        tint = EmeraldPrimary,
                                        modifier = Modifier.size(20.dp)
                                    )
                                    Text(
                                        text = "Order Summary (${items.sumOf { it.quantity }} items)",
                                        style = MaterialTheme.typography.titleMedium,
                                        color = MaterialTheme.colorScheme.onSurface,
                                        fontWeight = FontWeight.Bold
                                    )
                                }

                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                                ) {
                                    Text(
                                        text = if (orderSummaryExpanded) "Hide" else "View Details",
                                        style = MaterialTheme.typography.labelMedium,
                                        color = EmeraldPrimary
                                    )
                                    Icon(
                                        imageVector = if (orderSummaryExpanded) Icons.Filled.ExpandLess else Icons.Filled.ExpandMore,
                                        contentDescription = "Toggle Summary",
                                        tint = EmeraldPrimary
                                    )
                                }
                            }

                            AnimatedVisibility(visible = orderSummaryExpanded) {
                                Column(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(top = 12.dp),
                                    verticalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    items.forEach { item ->
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            verticalAlignment = Alignment.CenterVertically,
                                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                                        ) {
                                            Surface(
                                                modifier = Modifier
                                                    .size(48.dp)
                                                    .clip(RoundedCornerShape(8.dp)),
                                                color = SurfaceContainerHighest,
                                                shape = RoundedCornerShape(8.dp)
                                            ) {
                                                AsyncImage(
                                                    model = item.product.imageUrl,
                                                    contentDescription = item.product.name,
                                                    contentScale = ContentScale.Crop,
                                                    modifier = Modifier.fillMaxSize()
                                                )
                                            }

                                            Column(modifier = Modifier.weight(1f)) {
                                                Text(
                                                    text = item.product.name,
                                                    style = MaterialTheme.typography.bodyMedium,
                                                    fontWeight = FontWeight.Bold,
                                                    maxLines = 1,
                                                    overflow = TextOverflow.Ellipsis
                                                )
                                                Text(
                                                    text = "${item.product.weight} × ${item.quantity}",
                                                    style = MaterialTheme.typography.labelSmall,
                                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                                )
                                            }

                                            Text(
                                                text = "${item.product.unitCurrency}${String.format("%.2f", item.product.price * item.quantity)}",
                                                style = MaterialTheme.typography.titleSmall,
                                                fontWeight = FontWeight.Black
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // Payment Options Section (Zepto / Blinkit style)
                item {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(16.dp))
                            .testTag("checkout_payment_methods"),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = SurfaceContainerLowest),
                        border = CardDefaults.outlinedCardBorder().copy(
                            brush = androidx.compose.ui.graphics.SolidColor(OutlineVariantColor.copy(alpha = 0.4f))
                        )
                    ) {
                        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Filled.Payments,
                                    contentDescription = null,
                                    tint = EmeraldPrimary,
                                    modifier = Modifier.size(20.dp)
                                )
                                Text(
                                    text = "Select Payment Mode",
                                    style = MaterialTheme.typography.titleMedium,
                                    color = MaterialTheme.colorScheme.onSurface,
                                    fontWeight = FontWeight.Bold
                                )
                            }

                            // 1. UPI Section
                            Text(
                                text = "UPI (Instant & Zero Fee)",
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.Bold,
                                color = EmeraldPrimary
                            )

                            PaymentOptionRow(
                                title = "Google Pay UPI",
                                subtitle = "Fastest Checkout • Direct Bank Debit",
                                icon = Icons.Filled.QrCodeScanner,
                                badge = "POPULAR",
                                selected = selectedPaymentMethod == "Google Pay (UPI)",
                                onClick = { selectedPaymentMethod = "Google Pay (UPI)" }
                            )

                            PaymentOptionRow(
                                title = "PhonePe UPI",
                                subtitle = "UPI Autopay & Instant Refund",
                                icon = Icons.Filled.QrCodeScanner,
                                selected = selectedPaymentMethod == "PhonePe (UPI)",
                                onClick = { selectedPaymentMethod = "PhonePe (UPI)" }
                            )

                            PaymentOptionRow(
                                title = "Paytm UPI / CRED UPI",
                                subtitle = "Pay with any registered UPI VPA",
                                icon = Icons.Filled.QrCodeScanner,
                                selected = selectedPaymentMethod == "Paytm / CRED UPI",
                                onClick = { selectedPaymentMethod = "Paytm / CRED UPI" }
                            )

                            // 2. Cards & Net Banking
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "Cards & Wallets",
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurface
                            )

                            PaymentOptionRow(
                                title = "Credit / Debit Card",
                                subtitle = "Visa, MasterCard, RuPay, Diners (Save Card for 1-Tap)",
                                icon = Icons.Filled.CreditCard,
                                selected = selectedPaymentMethod == "Credit / Debit Card",
                                onClick = { selectedPaymentMethod = "Credit / Debit Card" }
                            )

                            PaymentOptionRow(
                                title = "Wallets (Paytm / Amazon Pay)",
                                subtitle = "Instant 1-Click Payment",
                                icon = Icons.Filled.AccountBalanceWallet,
                                selected = selectedPaymentMethod == "Wallets",
                                onClick = { selectedPaymentMethod = "Wallets" }
                            )

                            PaymentOptionRow(
                                title = "Net Banking",
                                subtitle = "HDFC, ICICI, SBI, Axis, Kotak & all major banks",
                                icon = Icons.Filled.AccountBalance,
                                selected = selectedPaymentMethod == "Net Banking",
                                onClick = { selectedPaymentMethod = "Net Banking" }
                            )

                            // 3. Cash on Delivery
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "Pay on Delivery",
                                style = MaterialTheme.typography.labelMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onSurface
                            )

                            PaymentOptionRow(
                                title = "Cash on Delivery / UPI at Doorstep",
                                subtitle = "Pay via Cash or scan QR with partner",
                                icon = Icons.Filled.LocalShipping,
                                selected = selectedPaymentMethod == "Cash on Delivery",
                                onClick = { selectedPaymentMethod = "Cash on Delivery" }
                            )
                        }
                    }
                }

                // Final Detailed Bill Breakdown
                item {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(16.dp))
                            .testTag("checkout_bill_card"),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = SurfaceContainerLowest),
                        border = CardDefaults.outlinedCardBorder().copy(
                            brush = androidx.compose.ui.graphics.SolidColor(OutlineVariantColor.copy(alpha = 0.4f))
                        )
                    ) {
                        Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Filled.ReceiptLong,
                                        contentDescription = null,
                                        tint = EmeraldPrimary,
                                        modifier = Modifier.size(18.dp)
                                    )
                                    Text(
                                        text = "Payment Breakdown",
                                        style = MaterialTheme.typography.titleMedium,
                                        color = MaterialTheme.colorScheme.onSurface,
                                        fontWeight = FontWeight.Bold
                                    )
                                }

                                if (totalSavings > 0) {
                                    Text(
                                        text = "Saved ${currency}${String.format("%.2f", totalSavings)}",
                                        style = MaterialTheme.typography.labelMedium,
                                        color = EmeraldPrimary,
                                        fontWeight = FontWeight.Black
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(4.dp))

                            BillRow(label = "Item Total (MRP)", value = "${currency}${String.format("%.2f", mrpTotal)}")

                            if (productSavings > 0) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("Product Discount", style = MaterialTheme.typography.bodyMedium, color = EmeraldPrimary)
                                    Text("-${currency}${String.format("%.2f", productSavings)}", style = MaterialTheme.typography.bodyMedium, color = EmeraldPrimary, fontWeight = FontWeight.Bold)
                                }
                            }

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text("Delivery Partner Fee", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                if (isFreeDelivery) {
                                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                        Text("${currency}${String.format("%.2f", standardDeliveryFee)}", style = MaterialTheme.typography.bodyMedium, textDecoration = TextDecoration.LineThrough, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                        Text("FREE", style = MaterialTheme.typography.bodyMedium, color = EmeraldPrimary, fontWeight = FontWeight.Black)
                                    }
                                } else {
                                    Text("${currency}${String.format("%.2f", deliveryFee)}", style = MaterialTheme.typography.bodyMedium)
                                }
                            }

                            BillRow(label = "Handling & Platform Fee", value = "${currency}${String.format("%.2f", handlingFee)}")
                            BillRow(label = "Govt Taxes & Charges", value = "${currency}${String.format("%.2f", taxes)}")

                            if (couponDiscount > 0) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("Coupon Discount (${appliedCoupon?.code})", style = MaterialTheme.typography.bodyMedium, color = EmeraldPrimary)
                                    Text("-${currency}${String.format("%.2f", couponDiscount)}", style = MaterialTheme.typography.bodyMedium, color = EmeraldPrimary, fontWeight = FontWeight.Bold)
                                }
                            }

                            if (tipAmount > 0) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("Delivery Partner Tip", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                    Text("${currency}${String.format("%.2f", tipAmount)}", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Bold)
                                }
                            }

                            Spacer(modifier = Modifier.height(6.dp))
                            Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(OutlineVariantColor.copy(alpha = 0.4f)))
                            Spacer(modifier = Modifier.height(6.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(
                                        text = "To Pay",
                                        style = MaterialTheme.typography.titleMedium,
                                        color = MaterialTheme.colorScheme.onSurface,
                                        fontWeight = FontWeight.Bold
                                    )
                                    Text(
                                        text = "Using $selectedPaymentMethod",
                                        style = MaterialTheme.typography.labelSmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }

                                Text(
                                    text = "${currency}${String.format("%.2f", total)}",
                                    style = MaterialTheme.typography.headlineMedium,
                                    color = MaterialTheme.colorScheme.onSurface,
                                    fontWeight = FontWeight.Black
                                )
                            }
                        }
                    }
                }

                // Trust & Security Guarantee
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = SurfaceContainerHighest.copy(alpha = 0.35f))
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Filled.Security,
                                contentDescription = null,
                                tint = EmeraldPrimary,
                                modifier = Modifier.size(20.dp)
                            )
                            Column {
                                Text(
                                    text = "100% Safe & Secure Payments",
                                    style = MaterialTheme.typography.labelMedium,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = "PCI-DSS compliant 256-bit encryption. Instant refunds on failed transactions.",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    }
                }
            }
        }

        // Sticky Pay Button at Bottom
        Surface(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .navigationBarsPadding(),
            color = SurfaceContainerLowest,
            shadowElevation = 16.dp
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Total to Pay",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = "${currency}${String.format("%.2f", total)}",
                        style = MaterialTheme.typography.headlineSmall,
                        color = MaterialTheme.colorScheme.onSurface,
                        fontWeight = FontWeight.Black
                    )
                }

                Button(
                    onClick = {
                        if (!isPlacingOrder) {
                            if (selectedPaymentMethod.contains("Cash on Delivery", ignoreCase = true)) {
                                isPlacingOrder = true
                                orderViewModel.placeOrder(
                                    items = items,
                                    address = currentAddress,
                                    paymentMethod = selectedPaymentMethod,
                                    deliveryFee = deliveryFee,
                                    taxes = taxes,
                                    currency = currency,
                                    discount = couponDiscount,
                                    tip = tipAmount,
                                    onSuccess = { placedOrder ->
                                        onOrderPlaced(placedOrder)
                                    }
                                )
                            } else {
                                showRazorpaySheet = true
                            }
                        }
                    },
                    modifier = Modifier
                        .height(52.dp)
                        .testTag("place_order_btn"),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = EmeraldPrimary,
                        contentColor = Color.White
                    ),
                    shape = RoundedCornerShape(26.dp),
                    enabled = !isPlacingOrder
                ) {
                    if (isPlacingOrder) {
                        CircularProgressIndicator(
                            color = Color.White,
                            modifier = Modifier.size(20.dp),
                            strokeWidth = 2.dp
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Securing Order...",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                    } else {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Text(
                                text = "Pay ${currency}${String.format("%.2f", total)}",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold
                            )
                            Icon(
                                imageVector = Icons.Filled.ArrowForward,
                                contentDescription = null,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun BillRow(label: String, value: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 2.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurface,
            fontWeight = FontWeight.Medium
        )
    }
}

@Composable
private fun PaymentOptionRow(
    title: String,
    subtitle: String,
    icon: ImageVector,
    badge: String? = null,
    selected: Boolean,
    onClick: () -> Unit
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(12.dp),
        color = if (selected) EmeraldPrimaryContainer.copy(alpha = 0.12f) else SurfaceContainerLowest,
        border = CardDefaults.outlinedCardBorder().copy(
            brush = androidx.compose.ui.graphics.SolidColor(
                if (selected) EmeraldPrimary else OutlineVariantColor.copy(alpha = 0.4f)
            )
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            RadioButton(
                selected = selected,
                onClick = onClick,
                colors = RadioButtonDefaults.colors(selectedColor = EmeraldPrimary)
            )

            Column(modifier = Modifier.weight(1f)) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Text(
                        text = title,
                        style = MaterialTheme.typography.titleSmall,
                        color = MaterialTheme.colorScheme.onSurface,
                        fontWeight = FontWeight.Bold
                    )

                    if (badge != null) {
                        Surface(
                            color = AmberTertiary,
                            shape = RoundedCornerShape(4.dp)
                        ) {
                            Text(
                                text = badge,
                                style = MaterialTheme.typography.labelSmall,
                                color = Color.White,
                                fontWeight = FontWeight.Black,
                                fontSize = 9.sp,
                                modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp)
                            )
                        }
                    }
                }

                Text(
                    text = subtitle,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = if (selected) EmeraldPrimary else MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.size(22.dp)
            )
        }
    }
}
