package com.example.ui.screens

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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.Bolt
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.CreditCard
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.DirectionsBike
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.HelpOutline
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.LocalOffer
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.NotificationsOff
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.ReceiptLong
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.ShoppingBag
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.Verified
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import android.widget.Toast
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import coil.compose.AsyncImage
import com.example.data.SampleData
import com.example.data.model.Category
import com.example.data.model.Coupon
import com.example.data.model.Order
import com.example.data.model.OrderStatus
import com.example.data.model.Product
import com.example.ui.components.CategoryCircleItem
import com.example.ui.components.ProductGridCard
import com.example.ui.theme.AmberTertiary
import com.example.ui.theme.AmberTertiaryContainer
import com.example.ui.theme.EmeraldInversePrimary
import com.example.ui.theme.EmeraldPrimary
import com.example.ui.theme.EmeraldPrimaryContainer
import com.example.ui.theme.ErrorColor
import com.example.ui.theme.InverseSurface
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
import com.example.ui.viewmodel.ProductViewModel
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CartScreen(
    cartViewModel: CartViewModel,
    addressViewModel: AddressViewModel,
    onNavigateToCheckout: () -> Unit,
    onNavigateToProduct: (String) -> Unit,
    onNavigateToHome: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val cartItems by cartViewModel.cartItems.collectAsState()
    val totalCount by cartViewModel.itemCount.collectAsState()
    val subtotal by cartViewModel.subtotal.collectAsState()
    val appliedCoupon by cartViewModel.appliedCoupon.collectAsState()
    val tipAmount by cartViewModel.deliveryTip.collectAsState()
    val selectedInstructions by cartViewModel.selectedInstructions.collectAsState()
    val isNoContact by cartViewModel.isNoContactDelivery.collectAsState()
    val selectedAddress by addressViewModel.selectedAddress.collectAsState()

    var couponInput by remember { mutableStateOf("") }
    var couponErrorMessage by remember { mutableStateOf<String?>(null) }

    val currency = cartItems.firstOrNull()?.product?.unitCurrency ?: "₹"
    val freeDeliveryThreshold = 199.0
    val isFreeDelivery = subtotal >= freeDeliveryThreshold || appliedCoupon?.code == "CRAZEFREE"
    val standardDeliveryFee = 25.0
    val deliveryFee = if (cartItems.isEmpty()) 0.0 else if (isFreeDelivery) 0.0 else standardDeliveryFee
    val handlingFee = if (cartItems.isNotEmpty()) 4.0 else 0.0
    val taxes = if (cartItems.isNotEmpty()) 15.0 else 0.0
    val couponDiscount = if (appliedCoupon != null && subtotal >= (appliedCoupon?.minOrderValue ?: 0.0)) {
        if (appliedCoupon?.code == "CRAZEFREE") 0.0 else appliedCoupon?.discountAmount ?: 0.0
    } else 0.0

    // Calculate MRP total for savings callout
    val mrpTotal = cartItems.sumOf { (it.product.originalPrice ?: it.product.price) * it.quantity }
    val productSavings = (mrpTotal - subtotal).coerceAtLeast(0.0)
    val deliverySavings = if (isFreeDelivery && cartItems.isNotEmpty()) standardDeliveryFee else 0.0
    val totalSavings = productSavings + couponDiscount + deliverySavings

    val total = if (cartItems.isNotEmpty()) {
        (subtotal + deliveryFee + handlingFee + taxes + tipAmount - couponDiscount).coerceAtLeast(0.0)
    } else 0.0

    // Frequently added quick-adds not in cart
    val cartProductIds = cartItems.map { it.product.id }.toSet()
    val liveProducts by productViewModel.allProducts.collectAsState()
    val quickAddItems = liveProducts.filter { it.id !in cartProductIds }.take(6)

    Box(modifier = modifier.fillMaxSize().background(MaterialTheme.colorScheme.background)) {
        if (cartItems.isEmpty()) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(32.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Box(
                    modifier = Modifier
                        .size(100.dp)
                        .background(SurfaceContainerHighest, shape = CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Filled.ShoppingCart,
                        contentDescription = "Empty Cart",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(50.dp)
                    )
                }

                Spacer(modifier = Modifier.height(20.dp))

                Text(
                    text = "Your Cart is Empty",
                    style = MaterialTheme.typography.headlineSmall,
                    color = MaterialTheme.colorScheme.onSurface,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "Fill your basket with fresh dairy, snacks, vegetables and daily essentials.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(24.dp))

                Button(
                    onClick = onNavigateToHome,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = EmeraldPrimary,
                        contentColor = Color.White
                    ),
                    shape = RoundedCornerShape(24.dp),
                    modifier = Modifier.height(48.dp)
                ) {
                    Icon(
                        imageVector = Icons.Filled.ShoppingBag,
                        contentDescription = null,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Browse Groceries",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        } else {
            Column(modifier = Modifier.fillMaxSize()) {
                // Top Header with 10-min delivery badge and Address
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    color = MaterialTheme.colorScheme.surface,
                    shadowElevation = 2.dp
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 12.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Surface(
                                    color = EmeraldPrimary,
                                    shape = RoundedCornerShape(6.dp)
                                ) {
                                    Row(
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 3.dp),
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(2.dp)
                                    ) {
                                        Icon(
                                            imageVector = Icons.Filled.Bolt,
                                            contentDescription = null,
                                            tint = AmberTertiary,
                                            modifier = Modifier.size(14.dp)
                                        )
                                        Text(
                                            text = "8-10 MINS",
                                            style = MaterialTheme.typography.labelSmall,
                                            fontWeight = FontWeight.Black,
                                            color = Color.White,
                                            fontSize = 10.sp
                                        )
                                    }
                                }

                                Column {
                                    Text(
                                        text = "Delivery to ${selectedAddress?.tag ?: "Home"}",
                                        style = MaterialTheme.typography.titleSmall,
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.onSurface
                                    )
                                    Text(
                                        text = selectedAddress?.line1 ?: "Select an address",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                                        maxLines = 1,
                                        overflow = TextOverflow.Ellipsis
                                    )
                                }
                            }

                            TextButton(
                                onClick = { cartViewModel.clearCart() }
                            ) {
                                Icon(
                                    imageVector = Icons.Filled.Delete,
                                    contentDescription = "Clear",
                                    tint = ErrorColor,
                                    modifier = Modifier.size(16.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = "Clear",
                                    color = ErrorColor,
                                    style = MaterialTheme.typography.labelMedium,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }
                }

                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .testTag("cart_items_list"),
                    contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 12.dp, bottom = 140.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    // Free Delivery Target Bar
                    item {
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .testTag("free_delivery_progress_card"),
                            shape = RoundedCornerShape(12.dp),
                            colors = CardDefaults.cardColors(
                                containerColor = if (isFreeDelivery) EmeraldPrimaryContainer.copy(alpha = 0.3f) else AmberTertiaryContainer.copy(alpha = 0.3f)
                            ),
                            border = CardDefaults.outlinedCardBorder().copy(
                                brush = androidx.compose.ui.graphics.SolidColor(
                                    if (isFreeDelivery) EmeraldPrimary else AmberTertiary
                                )
                            )
                        ) {
                            Column(
                                modifier = Modifier.padding(12.dp),
                                verticalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
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
                                            imageVector = if (isFreeDelivery) Icons.Filled.CheckCircle else Icons.Filled.DirectionsBike,
                                            contentDescription = null,
                                            tint = if (isFreeDelivery) EmeraldPrimary else AmberTertiary,
                                            modifier = Modifier.size(18.dp)
                                        )
                                        Text(
                                            text = if (isFreeDelivery) "You unlocked FREE Delivery! 🎉" else "Add ₹${(freeDeliveryThreshold - subtotal).toInt().coerceAtLeast(1)} more for FREE Delivery 🚀",
                                            style = MaterialTheme.typography.titleSmall,
                                            fontWeight = FontWeight.Bold,
                                            color = MaterialTheme.colorScheme.onSurface
                                        )
                                    }

                                    if (isFreeDelivery) {
                                        Text(
                                            text = "SAVED ₹25",
                                            style = MaterialTheme.typography.labelSmall,
                                            fontWeight = FontWeight.Black,
                                            color = EmeraldPrimary
                                        )
                                    }
                                }

                                if (!isFreeDelivery) {
                                    val progress = (subtotal / freeDeliveryThreshold).toFloat().coerceIn(0f, 1f)
                                    LinearProgressIndicator(
                                        progress = { progress },
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .height(6.dp)
                                            .clip(RoundedCornerShape(3.dp)),
                                        color = EmeraldPrimary,
                                        trackColor = OutlineVariantColor.copy(alpha = 0.3f)
                                    )
                                }
                            }
                        }
                    }

                    // Cart Items Header & Cards
                    item {
                        Text(
                            text = "Items in Cart ($totalCount)",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }

                    items(cartItems) { item ->
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(16.dp))
                                .clickable { onNavigateToProduct(item.product.id) }
                                .testTag("cart_item_${item.product.id}"),
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.cardColors(containerColor = SurfaceContainerLowest),
                            border = CardDefaults.outlinedCardBorder().copy(
                                brush = androidx.compose.ui.graphics.SolidColor(OutlineVariantColor.copy(alpha = 0.4f))
                            )
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(12.dp)
                            ) {
                                Surface(
                                    modifier = Modifier
                                        .size(68.dp)
                                        .clip(RoundedCornerShape(10.dp)),
                                    color = SurfaceContainerHighest,
                                    shape = RoundedCornerShape(10.dp)
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
                                        style = MaterialTheme.typography.titleSmall,
                                        color = MaterialTheme.colorScheme.onSurface,
                                        fontWeight = FontWeight.Bold,
                                        maxLines = 1,
                                        overflow = TextOverflow.Ellipsis
                                    )
                                    Text(
                                        text = "${item.product.brand} • ${item.product.weight}",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                                    ) {
                                        Text(
                                            text = "${item.product.unitCurrency}${String.format("%.2f", item.product.price * item.quantity)}",
                                            style = MaterialTheme.typography.titleMedium,
                                            color = MaterialTheme.colorScheme.onSurface,
                                            fontWeight = FontWeight.Black
                                        )
                                        if (item.product.originalPrice != null && item.product.originalPrice > item.product.price) {
                                            Text(
                                                text = "${item.product.unitCurrency}${String.format("%.2f", item.product.originalPrice * item.quantity)}",
                                                style = MaterialTheme.typography.bodySmall,
                                                textDecoration = TextDecoration.LineThrough,
                                                color = MaterialTheme.colorScheme.onSurfaceVariant
                                            )
                                        }
                                    }
                                }

                                // Stepper Pill
                                Row(
                                    modifier = Modifier
                                        .background(EmeraldPrimary, shape = RoundedCornerShape(20.dp))
                                        .padding(horizontal = 2.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    IconButton(
                                        onClick = { cartViewModel.updateQuantity(item.product.id, item.quantity - 1) },
                                        modifier = Modifier.size(30.dp)
                                    ) {
                                        Icon(
                                            imageVector = Icons.Filled.Remove,
                                            contentDescription = "Decrease",
                                            tint = Color.White,
                                            modifier = Modifier.size(14.dp)
                                        )
                                    }

                                    Text(
                                        text = item.quantity.toString(),
                                        style = MaterialTheme.typography.titleSmall,
                                        color = Color.White,
                                        fontWeight = FontWeight.Bold,
                                        modifier = Modifier.padding(horizontal = 6.dp)
                                    )

                                    IconButton(
                                        onClick = { cartViewModel.updateQuantity(item.product.id, item.quantity + 1) },
                                        modifier = Modifier.size(30.dp)
                                    ) {
                                        Icon(
                                            imageVector = Icons.Filled.Add,
                                            contentDescription = "Increase",
                                            tint = Color.White,
                                            modifier = Modifier.size(14.dp)
                                        )
                                    }
                                }
                            }
                        }
                    }

                    // Missed Something? / Frequently Bought Together Section
                    if (quickAddItems.isNotEmpty()) {
                        item {
                            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                                Text(
                                    text = "Missed Something? Add in 1-Tap 🛒",
                                    style = MaterialTheme.typography.titleMedium,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onSurface
                                )

                                LazyRow(
                                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                                    contentPadding = PaddingValues(end = 4.dp)
                                ) {
                                    items(quickAddItems) { item ->
                                        Card(
                                            modifier = Modifier
                                                .width(135.dp)
                                                .clip(RoundedCornerShape(12.dp)),
                                            shape = RoundedCornerShape(12.dp),
                                            colors = CardDefaults.cardColors(containerColor = SurfaceContainerLowest),
                                            border = CardDefaults.outlinedCardBorder().copy(
                                                brush = androidx.compose.ui.graphics.SolidColor(OutlineVariantColor.copy(alpha = 0.4f))
                                            )
                                        ) {
                                            Column(modifier = Modifier.padding(8.dp)) {
                                                Box(
                                                    modifier = Modifier
                                                        .fillMaxWidth()
                                                        .height(85.dp)
                                                        .clip(RoundedCornerShape(8.dp))
                                                        .background(SurfaceContainerHighest)
                                                ) {
                                                    AsyncImage(
                                                        model = item.imageUrl,
                                                        contentDescription = item.name,
                                                        contentScale = ContentScale.Crop,
                                                        modifier = Modifier.fillMaxSize()
                                                    )
                                                }

                                                Spacer(modifier = Modifier.height(4.dp))

                                                Text(
                                                    text = item.name,
                                                    style = MaterialTheme.typography.bodySmall,
                                                    fontWeight = FontWeight.Bold,
                                                    maxLines = 1,
                                                    overflow = TextOverflow.Ellipsis
                                                )

                                                Text(
                                                    text = item.weight,
                                                    style = MaterialTheme.typography.labelSmall,
                                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                                    fontSize = 10.sp
                                                )

                                                Spacer(modifier = Modifier.height(4.dp))

                                                Row(
                                                    modifier = Modifier.fillMaxWidth(),
                                                    horizontalArrangement = Arrangement.SpaceBetween,
                                                    verticalAlignment = Alignment.CenterVertically
                                                ) {
                                                    Text(
                                                        text = "${item.unitCurrency}${item.price.toInt()}",
                                                        style = MaterialTheme.typography.titleSmall,
                                                        fontWeight = FontWeight.Black
                                                    )

                                                    Button(
                                                        onClick = { cartViewModel.addToCart(item) },
                                                        colors = ButtonDefaults.buttonColors(
                                                            containerColor = EmeraldPrimaryContainer,
                                                            contentColor = OnEmeraldPrimaryContainer
                                                        ),
                                                        shape = RoundedCornerShape(10.dp),
                                                        modifier = Modifier.height(26.dp),
                                                        contentPadding = PaddingValues(horizontal = 6.dp)
                                                    ) {
                                                        Text(
                                                            text = "+ ADD",
                                                            style = MaterialTheme.typography.labelSmall,
                                                            fontWeight = FontWeight.Bold,
                                                            fontSize = 9.sp
                                                        )
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Coupons & Offers Section
                    item {
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(16.dp))
                                .testTag("cart_coupons_section"),
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.cardColors(containerColor = SurfaceContainerLowest),
                            border = CardDefaults.outlinedCardBorder().copy(
                                brush = androidx.compose.ui.graphics.SolidColor(OutlineVariantColor.copy(alpha = 0.4f))
                            )
                        ) {
                            Column(
                                modifier = Modifier.padding(14.dp),
                                verticalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Filled.LocalOffer,
                                        contentDescription = null,
                                        tint = EmeraldPrimary,
                                        modifier = Modifier.size(20.dp)
                                    )
                                    Text(
                                        text = "Coupons & Offers",
                                        style = MaterialTheme.typography.titleMedium,
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.onSurface
                                    )
                                }

                                if (appliedCoupon != null) {
                                    Card(
                                        modifier = Modifier.fillMaxWidth(),
                                        shape = RoundedCornerShape(10.dp),
                                        colors = CardDefaults.cardColors(
                                            containerColor = EmeraldPrimaryContainer.copy(alpha = 0.3f)
                                        ),
                                        border = CardDefaults.outlinedCardBorder().copy(
                                            brush = androidx.compose.ui.graphics.SolidColor(EmeraldPrimary.copy(alpha = 0.5f))
                                        )
                                    ) {
                                        Row(
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .padding(10.dp),
                                            horizontalArrangement = Arrangement.SpaceBetween,
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Row(
                                                verticalAlignment = Alignment.CenterVertically,
                                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                                            ) {
                                                Icon(
                                                    imageVector = Icons.Filled.CheckCircle,
                                                    contentDescription = null,
                                                    tint = EmeraldPrimary,
                                                    modifier = Modifier.size(18.dp)
                                                )
                                                Column {
                                                    Text(
                                                        text = "'${appliedCoupon?.code}' Applied!",
                                                        style = MaterialTheme.typography.titleSmall,
                                                        fontWeight = FontWeight.Bold,
                                                        color = EmeraldPrimary
                                                    )
                                                    Text(
                                                        text = if (appliedCoupon?.code == "CRAZEFREE") "Free delivery unlocked" else "Saved ₹${appliedCoupon?.discountAmount?.toInt()} with this coupon",
                                                        style = MaterialTheme.typography.bodySmall,
                                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                                    )
                                                }
                                            }

                                            TextButton(
                                                onClick = {
                                                    cartViewModel.removeCoupon()
                                                    Toast.makeText(context, "Coupon removed", Toast.LENGTH_SHORT).show()
                                                }
                                            ) {
                                                Text(
                                                    text = "REMOVE",
                                                    style = MaterialTheme.typography.labelSmall,
                                                    fontWeight = FontWeight.Bold,
                                                    color = ErrorColor
                                                )
                                            }
                                        }
                                    }
                                } else {
                                    // Coupon Input
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        OutlinedTextField(
                                            value = couponInput,
                                            onValueChange = {
                                                couponInput = it.uppercase()
                                                couponErrorMessage = null
                                            },
                                            placeholder = { Text("Enter Coupon Code (e.g. ZEPTO50)") },
                                            modifier = Modifier.weight(1f),
                                            singleLine = true,
                                            shape = RoundedCornerShape(12.dp),
                                            colors = OutlinedTextFieldDefaults.colors(
                                                focusedBorderColor = EmeraldPrimary,
                                                unfocusedBorderColor = OutlineVariantColor
                                            ),
                                            keyboardOptions = KeyboardOptions(
                                                capitalization = KeyboardCapitalization.Characters,
                                                imeAction = ImeAction.Done
                                            ),
                                            keyboardActions = KeyboardActions(
                                                onDone = {
                                                    if (couponInput.isNotBlank()) {
                                                        val err = cartViewModel.applyCouponByCode(couponInput)
                                                        if (err != null) {
                                                            couponErrorMessage = err
                                                        } else {
                                                            couponInput = ""
                                                            Toast.makeText(context, "Coupon applied!", Toast.LENGTH_SHORT).show()
                                                        }
                                                    }
                                                }
                                            )
                                        )

                                        Button(
                                            onClick = {
                                                if (couponInput.isNotBlank()) {
                                                    val err = cartViewModel.applyCouponByCode(couponInput)
                                                    if (err != null) {
                                                        couponErrorMessage = err
                                                    } else {
                                                        couponInput = ""
                                                        Toast.makeText(context, "Coupon applied!", Toast.LENGTH_SHORT).show()
                                                    }
                                                }
                                            },
                                            colors = ButtonDefaults.buttonColors(
                                                containerColor = EmeraldPrimary,
                                                contentColor = Color.White
                                            ),
                                            shape = RoundedCornerShape(12.dp),
                                            modifier = Modifier.height(52.dp)
                                        ) {
                                            Text("APPLY", fontWeight = FontWeight.Bold)
                                        }
                                    }

                                    if (couponErrorMessage != null) {
                                        Text(
                                            text = couponErrorMessage ?: "",
                                            style = MaterialTheme.typography.bodySmall,
                                            color = ErrorColor
                                        )
                                    }

                                    // Quick Coupon Chips
                                    Text(
                                        text = "Popular Coupons:",
                                        style = MaterialTheme.typography.labelSmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )

                                    LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                        items(SampleData.availableCoupons) { coupon ->
                                            Surface(
                                                modifier = Modifier
                                                    .clip(RoundedCornerShape(8.dp))
                                                    .clickable {
                                                        val applied = cartViewModel.applyCoupon(coupon)
                                                        if (applied) {
                                                            Toast.makeText(context, "${coupon.code} applied!", Toast.LENGTH_SHORT).show()
                                                        } else {
                                                            Toast.makeText(context, "Add items worth ₹${coupon.minOrderValue.toInt()} to use ${coupon.code}", Toast.LENGTH_SHORT).show()
                                                        }
                                                    },
                                                color = SurfaceContainerHighest,
                                                shape = RoundedCornerShape(8.dp)
                                            ) {
                                                Row(
                                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 6.dp),
                                                    verticalAlignment = Alignment.CenterVertically,
                                                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                                                ) {
                                                    Text(
                                                        text = coupon.code,
                                                        style = MaterialTheme.typography.labelMedium,
                                                        fontWeight = FontWeight.Bold,
                                                        color = EmeraldPrimary
                                                    )
                                                    Text(
                                                        text = "• ₹${coupon.discountAmount.toInt()} OFF",
                                                        style = MaterialTheme.typography.labelSmall,
                                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                                    )
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Tip Delivery Partner Section
                    item {
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(16.dp))
                                .testTag("tip_partner_card"),
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.cardColors(containerColor = SurfaceContainerLowest),
                            border = CardDefaults.outlinedCardBorder().copy(
                                brush = androidx.compose.ui.graphics.SolidColor(OutlineVariantColor.copy(alpha = 0.4f))
                            )
                        ) {
                            Column(
                                modifier = Modifier.padding(14.dp),
                                verticalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Filled.Favorite,
                                        contentDescription = null,
                                        tint = ErrorColor,
                                        modifier = Modifier.size(20.dp)
                                    )
                                    Column {
                                        Text(
                                            text = "Tip Your Delivery Partner",
                                            style = MaterialTheme.typography.titleSmall,
                                            fontWeight = FontWeight.Bold,
                                            color = MaterialTheme.colorScheme.onSurface
                                        )
                                        Text(
                                            text = "100% of your tip goes directly to the partner.",
                                            style = MaterialTheme.typography.bodySmall,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                    }
                                }

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    listOf(10.0, 20.0, 30.0, 50.0).forEach { amount ->
                                        val isSelected = tipAmount == amount
                                        Surface(
                                            modifier = Modifier
                                                .weight(1f)
                                                .clip(RoundedCornerShape(10.dp))
                                                .clickable { cartViewModel.setDeliveryTip(amount) },
                                            color = if (isSelected) EmeraldPrimaryContainer else SurfaceContainerHighest,
                                            shape = RoundedCornerShape(10.dp),
                                            border = if (isSelected) androidx.compose.foundation.BorderStroke(1.5.dp, EmeraldPrimary) else null
                                        ) {
                                            Text(
                                                text = "₹${amount.toInt()}",
                                                style = MaterialTheme.typography.titleSmall,
                                                fontWeight = FontWeight.Bold,
                                                color = if (isSelected) EmeraldPrimary else MaterialTheme.colorScheme.onSurface,
                                                textAlign = TextAlign.Center,
                                                modifier = Modifier.padding(vertical = 8.dp)
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Delivery Instructions Pills
                    item {
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(16.dp))
                                .testTag("delivery_instructions_card"),
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.cardColors(containerColor = SurfaceContainerLowest),
                            border = CardDefaults.outlinedCardBorder().copy(
                                brush = androidx.compose.ui.graphics.SolidColor(OutlineVariantColor.copy(alpha = 0.4f))
                            )
                        ) {
                            Column(
                                modifier = Modifier.padding(14.dp),
                                verticalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                Text(
                                    text = "Delivery Instructions",
                                    style = MaterialTheme.typography.titleSmall,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onSurface
                                )

                                LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    val instructions = listOf(
                                        "🔕 Don't ring bell",
                                        "🚪 Leave at door",
                                        "👮 Leave with guard",
                                        "🐕 Pet at home",
                                        "📞 Call before delivery"
                                    )

                                    items(instructions) { instruction ->
                                        val isSelected = selectedInstructions.contains(instruction)
                                        Surface(
                                            modifier = Modifier
                                                .clip(RoundedCornerShape(20.dp))
                                                .clickable { cartViewModel.toggleInstruction(instruction) },
                                            color = if (isSelected) EmeraldPrimaryContainer else SurfaceContainerHighest,
                                            shape = RoundedCornerShape(20.dp),
                                            border = if (isSelected) androidx.compose.foundation.BorderStroke(1.dp, EmeraldPrimary) else null
                                        ) {
                                            Text(
                                                text = instruction,
                                                style = MaterialTheme.typography.labelMedium,
                                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                                color = if (isSelected) EmeraldPrimary else MaterialTheme.colorScheme.onSurface,
                                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                                            )
                                        }
                                    }
                                }

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(
                                            text = "Opt for No-Contact Delivery",
                                            style = MaterialTheme.typography.bodySmall,
                                            fontWeight = FontWeight.Bold
                                        )
                                        Text(
                                            text = "Delivery partner will leave package at your doorstep.",
                                            style = MaterialTheme.typography.labelSmall,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                    }

                                    Switch(
                                        checked = isNoContact,
                                        onCheckedChange = { cartViewModel.setNoContactDelivery(it) },
                                        colors = SwitchDefaults.colors(
                                            checkedThumbColor = Color.White,
                                            checkedTrackColor = EmeraldPrimary
                                        )
                                    )
                                }
                            }
                        }
                    }

                    // Itemized Bill Details
                    item {
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(16.dp))
                                .testTag("bill_details_card"),
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
                                    Text(
                                        text = "Bill Summary",
                                        style = MaterialTheme.typography.titleMedium,
                                        color = MaterialTheme.colorScheme.onSurface,
                                        fontWeight = FontWeight.Bold
                                    )
                                    Text(
                                        text = "Saved ${currency}${String.format("%.2f", totalSavings)}",
                                        style = MaterialTheme.typography.labelMedium,
                                        color = EmeraldPrimary,
                                        fontWeight = FontWeight.Black
                                    )
                                }

                                Spacer(modifier = Modifier.height(4.dp))

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("Item Total (MRP)", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                    Text("${currency}${String.format("%.2f", mrpTotal)}", style = MaterialTheme.typography.bodyMedium)
                                }

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
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text("Delivery Partner Fee", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                    }
                                    if (isFreeDelivery) {
                                        Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                            Text("${currency}${String.format("%.2f", standardDeliveryFee)}", style = MaterialTheme.typography.bodyMedium, textDecoration = TextDecoration.LineThrough, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                            Text("FREE", style = MaterialTheme.typography.bodyMedium, color = EmeraldPrimary, fontWeight = FontWeight.Black)
                                        }
                                    } else {
                                        Text("${currency}${String.format("%.2f", deliveryFee)}", style = MaterialTheme.typography.bodyMedium)
                                    }
                                }

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("Handling & Platform Fee", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                    Text("${currency}${String.format("%.2f", handlingFee)}", style = MaterialTheme.typography.bodyMedium)
                                }

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("Govt Taxes & Charges", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                    Text("${currency}${String.format("%.2f", taxes)}", style = MaterialTheme.typography.bodyMedium)
                                }

                                if (couponDiscount > 0) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Text("Coupon (${appliedCoupon?.code})", style = MaterialTheme.typography.bodyMedium, color = EmeraldPrimary)
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
                                        Text("To Pay", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                                        Text("Incl. all taxes & fees", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                    }
                                    Text("${currency}${String.format("%.2f", total)}", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Black)
                                }
                            }
                        }
                    }

                    // Total Savings Highlight Pill
                    if (totalSavings > 0) {
                        item {
                            Card(
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(12.dp),
                                colors = CardDefaults.cardColors(containerColor = EmeraldPrimaryContainer.copy(alpha = 0.4f)),
                                border = CardDefaults.outlinedCardBorder().copy(
                                    brush = androidx.compose.ui.graphics.SolidColor(EmeraldPrimary)
                                )
                            ) {
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(12.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.Center
                                ) {
                                    Text(
                                        text = "🎉 You are saving ${currency}${String.format("%.2f", totalSavings)} on this order!",
                                        style = MaterialTheme.typography.titleSmall,
                                        color = EmeraldPrimary,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        }
                    }

                    // Cancellation Policy & Freshness Promise
                    item {
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp),
                            colors = CardDefaults.cardColors(containerColor = SurfaceContainerHighest.copy(alpha = 0.4f))
                        ) {
                            Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Filled.Verified,
                                        contentDescription = null,
                                        tint = EmeraldPrimary,
                                        modifier = Modifier.size(16.dp)
                                    )
                                    Text(
                                        text = "100% Quality & Freshness Guarantee",
                                        style = MaterialTheme.typography.labelMedium,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                                Text(
                                    text = "Orders cannot be cancelled once packed. Instant refund or replacement if anything arrives damaged.",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    }
                }
            }

            // Fixed Bottom Checkout Bar
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
                        onClick = onNavigateToCheckout,
                        modifier = Modifier
                            .height(50.dp)
                            .testTag("checkout_btn_from_cart"),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = EmeraldPrimary,
                            contentColor = Color.White
                        ),
                        shape = RoundedCornerShape(25.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Text(
                                text = "Proceed to Pay",
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
fun CategoriesScreen(
    productViewModel: ProductViewModel,
    cartViewModel: CartViewModel,
    onNavigateToProduct: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val selectedCategory by productViewModel.selectedCategory.collectAsState()
    val allProducts by productViewModel.allProducts.collectAsState()

    val filteredProducts = if (selectedCategory != null) {
        allProducts.filter { it.category.equals(selectedCategory, ignoreCase = true) }
    } else {
        allProducts
    }

    Box(modifier = modifier.fillMaxSize().background(MaterialTheme.colorScheme.background)) {
        Column(modifier = Modifier.fillMaxSize()) {
            Surface(
                modifier = Modifier.fillMaxWidth(),
                color = MaterialTheme.colorScheme.surface,
                shadowElevation = 1.dp
            ) {
                Text(
                    text = "Explore Categories",
                    style = MaterialTheme.typography.headlineMedium,
                    color = MaterialTheme.colorScheme.onSurface,
                    fontWeight = FontWeight.ExtraBold,
                    modifier = Modifier.padding(16.dp)
                )
            }

            // Categories horizontal picker
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(bottom = 100.dp)
            ) {
                item {
                    LazyVerticalGrid(
                        columns = GridCells.Fixed(3),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(240.dp)
                            .padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        items(SampleData.categories) { cat ->
                            val isSelected = selectedCategory.equals(cat.name, ignoreCase = true)
                            Card(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(12.dp))
                                    .clickable {
                                        productViewModel.onCategorySelected(cat.name)
                                    }
                                    .testTag("cat_card_${cat.id}"),
                                shape = RoundedCornerShape(12.dp),
                                colors = CardDefaults.cardColors(
                                    containerColor = if (isSelected) EmeraldPrimaryContainer.copy(alpha = 0.2f) else SurfaceContainerLowest
                                ),
                                border = CardDefaults.outlinedCardBorder().copy(
                                    brush = androidx.compose.ui.graphics.SolidColor(
                                        if (isSelected) EmeraldPrimary else OutlineVariantColor.copy(alpha = 0.4f)
                                    )
                                )
                            ) {
                                Column(
                                    modifier = Modifier.padding(8.dp),
                                    horizontalAlignment = Alignment.CenterHorizontally
                                ) {
                                    Surface(
                                        modifier = Modifier.size(54.dp),
                                        shape = CircleShape,
                                        color = SurfaceContainerLow
                                    ) {
                                        AsyncImage(
                                            model = cat.imageUrl,
                                            contentDescription = cat.name,
                                            contentScale = ContentScale.Crop,
                                            modifier = Modifier.fillMaxSize()
                                        )
                                    }
                                    Spacer(modifier = Modifier.height(6.dp))
                                    Text(
                                        text = cat.name,
                                        style = MaterialTheme.typography.bodySmall,
                                        color = if (isSelected) EmeraldPrimary else MaterialTheme.colorScheme.onSurface,
                                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                        textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                                        maxLines = 1
                                    )
                                }
                            }
                        }
                    }
                }

                item {
                    Text(
                        text = if (selectedCategory != null) "$selectedCategory Items (${filteredProducts.size})" else "All Products (${filteredProducts.size})",
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.onSurface,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
                    )
                }

                val pairs = filteredProducts.chunked(2)
                items(pairs) { pair ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 6.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        pair.forEach { product ->
                            val qty = cartViewModel.getQuantityForProduct(product.id)
                            ProductGridCard(
                                product = product,
                                quantity = qty,
                                onProductClick = { onNavigateToProduct(product.id) },
                                onAddToCart = { cartViewModel.addToCart(product) },
                                onIncrement = { cartViewModel.updateQuantity(product.id, qty + 1) },
                                onDecrement = { cartViewModel.updateQuantity(product.id, qty - 1) },
                                modifier = Modifier.weight(1f)
                            )
                        }
                        if (pair.size == 1) {
                            Spacer(modifier = Modifier.weight(1f))
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun OrdersListScreen(
    orderViewModel: OrderViewModel,
    onTrackOrder: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val displayOrders by orderViewModel.orders.collectAsState(initial = emptyList())

    Box(modifier = modifier.fillMaxSize().background(MaterialTheme.colorScheme.background)) {
        Column(modifier = Modifier.fillMaxSize()) {
            Surface(
                modifier = Modifier.fillMaxWidth(),
                color = MaterialTheme.colorScheme.surface,
                shadowElevation = 1.dp
            ) {
                Text(
                    text = "My Orders",
                    style = MaterialTheme.typography.headlineMedium,
                    color = MaterialTheme.colorScheme.onSurface,
                    fontWeight = FontWeight.ExtraBold,
                    modifier = Modifier.padding(16.dp)
                )
            }

            if (displayOrders.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(32.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Box(
                            modifier = Modifier
                                .size(80.dp)
                                .clip(CircleShape)
                                .background(EmeraldPrimaryContainer.copy(alpha = 0.1f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Filled.ShoppingBag,
                                contentDescription = null,
                                tint = EmeraldPrimaryContainer,
                                modifier = Modifier.size(40.dp)
                            )
                        }
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = "No Orders Yet",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "When you place live orders, they will appear here with live tracking.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            textAlign = androidx.compose.ui.text.style.TextAlign.Center
                        )
                    }
                }
            } else {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxSize()
                        .testTag("orders_list"),
                    contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 12.dp, bottom = 100.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    items(displayOrders) { order ->
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(16.dp))
                            .clickable {
                                orderViewModel.setActiveOrder(order)
                                onTrackOrder(order.orderId)
                            }
                            .testTag("order_item_${order.orderId}"),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = SurfaceContainerLowest),
                        border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(OutlineVariantColor.copy(alpha = 0.4f)))
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(
                                        text = "Order ${order.orderId}",
                                        style = MaterialTheme.typography.titleMedium,
                                        color = MaterialTheme.colorScheme.onSurface,
                                        fontWeight = FontWeight.Bold
                                    )
                                    val dateStr = SimpleDateFormat("MMM dd, yyyy • hh:mm a", Locale.getDefault()).format(Date(order.timestamp))
                                    Text(
                                        text = dateStr,
                                        style = MaterialTheme.typography.bodySmall,
                                        color = OutlineColor
                                    )
                                }

                                Surface(
                                    shape = RoundedCornerShape(20.dp),
                                    color = when (order.status) {
                                        OrderStatus.DELIVERED -> EmeraldPrimaryContainer
                                        else -> AmberTertiaryContainer
                                    }
                                ) {
                                    Text(
                                        text = order.status.name.replace("_", " "),
                                        style = MaterialTheme.typography.labelSmall,
                                        color = if (order.status == OrderStatus.DELIVERED) OnEmeraldPrimaryContainer else Color.White,
                                        fontWeight = FontWeight.Bold,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(10.dp))
                            Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(OutlineVariantColor.copy(alpha = 0.2f)))
                            Spacer(modifier = Modifier.height(10.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(
                                        text = "Total Amount",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                    Text(
                                        text = "${order.currency}${String.format("%.2f", order.total)}",
                                        style = MaterialTheme.typography.titleMedium,
                                        color = MaterialTheme.colorScheme.onSurface,
                                        fontWeight = FontWeight.Bold
                                    )
                                }

                                Button(
                                    onClick = {
                                        orderViewModel.setActiveOrder(order)
                                        onTrackOrder(order.orderId)
                                    },
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = EmeraldPrimaryContainer,
                                        contentColor = OnEmeraldPrimaryContainer
                                    ),
                                    shape = RoundedCornerShape(20.dp),
                                    contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp)
                                ) {
                                    Text("Track Status", fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun AccountScreen(
    addressViewModel: AddressViewModel,
    authViewModel: com.example.ui.viewmodel.AuthViewModel? = null,
    onNavigateToAddresses: () -> Unit,
    onNavigateToOrders: () -> Unit,
    modifier: Modifier = Modifier
) {
    val addresses by addressViewModel.addresses.collectAsState()
    val defaultAddress = addresses.find { it.isDefault } ?: addresses.firstOrNull()
    val currentUser = authViewModel?.currentUser?.collectAsState()?.value

    var showAuthSheet by remember { mutableStateOf(false) }

    if (showAuthSheet && authViewModel != null) {
        com.example.ui.components.AuthBottomSheet(
            authViewModel = authViewModel,
            onDismiss = { showAuthSheet = false }
        )
    }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .testTag("account_screen"),
        contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 16.dp, bottom = 100.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // User Profile Header Card
        item {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .clickable { showAuthSheet = true },
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = SurfaceContainerLowest),
                border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(OutlineVariantColor.copy(alpha = 0.4f)))
            ) {
                Row(
                    modifier = Modifier.padding(18.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(64.dp)
                            .background(EmeraldPrimaryContainer, shape = CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Filled.Person,
                            contentDescription = "Avatar",
                            tint = OnEmeraldPrimaryContainer,
                            modifier = Modifier.size(36.dp)
                        )
                    }

                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = currentUser?.name ?: "Alex Mercer",
                            style = MaterialTheme.typography.titleLarge,
                            color = MaterialTheme.colorScheme.onSurface,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "${currentUser?.phone ?: "+91 98765 43210"} • ${currentUser?.email ?: "alex.mercer@cartcraze.com"}",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = EmeraldPrimaryContainer.copy(alpha = 0.25f)
                        ) {
                            Text(
                                text = if (currentUser?.isPlusMember == true) "⚡ Craze Plus Member" else "🔥 Firebase Authenticated",
                                style = MaterialTheme.typography.labelSmall,
                                color = EmeraldPrimary,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                            )
                        }
                    }

                    TextButton(onClick = { showAuthSheet = true }) {
                        Text(
                            text = if (currentUser != null && !currentUser.isGuest) "Switch" else "Login",
                            color = EmeraldPrimary,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }

        // Quick Settings / Navigation items
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = SurfaceContainerLowest),
                border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(OutlineVariantColor.copy(alpha = 0.4f)))
            ) {
                Column(modifier = Modifier.padding(vertical = 8.dp)) {
                    AccountNavRow(
                        icon = Icons.Filled.LocationOn,
                        title = "Manage Addresses",
                        subtitle = defaultAddress?.let { "${it.tag} - ${it.line1}" } ?: "Add or modify delivery spots",
                        onClick = onNavigateToAddresses
                    )
                    Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(OutlineVariantColor.copy(alpha = 0.2f)))
                    AccountNavRow(
                        icon = Icons.Filled.ReceiptLong,
                        title = "Order History",
                        subtitle = "View past grocery deliveries",
                        onClick = onNavigateToOrders
                    )
                    Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(OutlineVariantColor.copy(alpha = 0.2f)))
                    AccountNavRow(
                        icon = Icons.Filled.CreditCard,
                        title = "Saved Payment Methods",
                        subtitle = "Razorpay, Cards & UPI",
                        onClick = { showAuthSheet = true }
                    )
                    Box(modifier = Modifier.fillMaxWidth().height(1.dp).background(OutlineVariantColor.copy(alpha = 0.2f)))
                    AccountNavRow(
                        icon = Icons.Filled.HelpOutline,
                        title = "Help & Support",
                        subtitle = "24x7 Customer Assistance",
                        onClick = { /* Open support */ }
                    )
                }
            }
        }
    }
}

@Composable
private fun AccountNavRow(
    icon: ImageVector,
    title: String,
    subtitle: String,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .background(SurfaceContainerLow, shape = CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = EmeraldPrimary,
                modifier = Modifier.size(20.dp)
            )
        }

        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                color = MaterialTheme.colorScheme.onSurface,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = subtitle,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        Icon(
            imageVector = Icons.Filled.ChevronRight,
            contentDescription = null,
            tint = OutlineColor,
            modifier = Modifier.size(20.dp)
        )
    }
}
