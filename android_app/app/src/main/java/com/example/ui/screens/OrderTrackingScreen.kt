package com.example.ui.screens

import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
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
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.DirectionsBike
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Inventory2
import androidx.compose.material.icons.filled.Schedule
import androidx.compose.material.icons.filled.Storefront
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.data.SampleData
import com.example.data.model.Order
import com.example.data.model.OrderStatus
import com.example.ui.theme.AmberTertiaryContainer
import com.example.ui.theme.EmeraldInversePrimary
import com.example.ui.theme.EmeraldPrimary
import com.example.ui.theme.EmeraldPrimaryContainer
import com.example.ui.theme.OnEmeraldPrimaryContainer
import com.example.ui.theme.OutlineColor
import com.example.ui.theme.OutlineVariantColor
import com.example.ui.theme.SecondaryContainer
import com.example.ui.theme.SurfaceContainer
import com.example.ui.theme.SurfaceContainerHigh
import com.example.ui.theme.SurfaceContainerLow
import com.example.ui.theme.SurfaceContainerLowest
import com.example.ui.viewmodel.OrderViewModel

@Composable
fun OrderTrackingScreen(
    orderId: String,
    orderViewModel: OrderViewModel,
    onClose: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val currentOrder by orderViewModel.currentActiveOrder.collectAsState()
    val riderLocation by orderViewModel.riderLocation.collectAsState()
    val riderProgress by orderViewModel.riderProgress.collectAsState()

    androidx.compose.runtime.LaunchedEffect(orderId) {
        orderViewModel.startRealtimeRiderTracking(orderId)
    }

    val displayOrder = currentOrder ?: Order(
        orderId = if (orderId.isNotBlank()) orderId else "#CC98231",
        items = emptyList(),
        subtotal = 15.99,
        deliveryFee = 1.99,
        taxes = 1.44,
        total = 19.42,
        address = SampleData.defaultAddresses.first(),
        paymentMethod = "Credit / Debit Card",
        status = OrderStatus.PREPARING,
        etaMinutes = 18
    )

    val infiniteTransition = rememberInfiniteTransition(label = "rider_pulse")
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 0.95f,
        targetValue = 1.15f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulse"
    )

    Box(modifier = modifier.fillMaxSize().background(MaterialTheme.colorScheme.background)) {
        Column(modifier = Modifier.fillMaxSize()) {
            // Top Navigation Bar
            Surface(
                modifier = Modifier.fillMaxWidth(),
                color = MaterialTheme.colorScheme.surface,
                shadowElevation = 1.dp
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 8.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    IconButton(
                        onClick = onClose,
                        modifier = Modifier.testTag("order_tracking_close")
                    ) {
                        Icon(
                            imageVector = Icons.Filled.Close,
                            contentDescription = "Close",
                            tint = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }

                    Text(
                        text = "CartCraze",
                        style = MaterialTheme.typography.headlineMedium,
                        color = EmeraldPrimary,
                        fontWeight = FontWeight.Black
                    )

                    Spacer(modifier = Modifier.size(48.dp))
                }
            }

            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .testTag("order_tracking_content"),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(18.dp)
            ) {
                // Header: Confirmed Icon & Badge
                item {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 8.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Box(
                            modifier = Modifier
                                .size(80.dp)
                                .background(EmeraldPrimaryContainer, shape = CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Filled.CheckCircle,
                                contentDescription = "Confirmed",
                                tint = OnEmeraldPrimaryContainer,
                                modifier = Modifier.size(44.dp)
                            )
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        Text(
                            text = "Order Confirmed 🎉",
                            style = MaterialTheme.typography.displayLarge,
                            color = EmeraldPrimary,
                            fontWeight = FontWeight.Black,
                            fontSize = 28.sp
                        )

                        Spacer(modifier = Modifier.height(4.dp))

                        Text(
                            text = "Order ${displayOrder.orderId}",
                            style = MaterialTheme.typography.titleMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }

                // Bento Section: ETA Card + Live Map
                item {
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        // ETA Card
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.cardColors(containerColor = SurfaceContainerLowest),
                            border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(OutlineVariantColor.copy(alpha = 0.5f))),
                            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                        ) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(16.dp),
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Text(
                                    text = "ESTIMATED ARRIVAL",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    fontWeight = FontWeight.Black,
                                    letterSpacing = 1.2.sp
                                )

                                Text(
                                    text = "${displayOrder.etaMinutes} min",
                                    style = MaterialTheme.typography.displayLarge,
                                    color = EmeraldPrimary,
                                    fontWeight = FontWeight.Black,
                                    fontSize = 36.sp
                                )

                                Surface(
                                    shape = RoundedCornerShape(20.dp),
                                    color = EmeraldPrimaryContainer.copy(alpha = 0.2f)
                                ) {
                                    Row(
                                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                                    ) {
                                        Icon(
                                            imageVector = Icons.Filled.Schedule,
                                            contentDescription = null,
                                            tint = EmeraldPrimary,
                                            modifier = Modifier.size(16.dp)
                                        )
                                        Text(
                                            text = "On Time",
                                            style = MaterialTheme.typography.bodySmall,
                                            color = EmeraldPrimary,
                                            fontWeight = FontWeight.Bold
                                        )
                                    }
                                }
                            }
                        }

                        // Map Card
                        Card(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(230.dp),
                            shape = RoundedCornerShape(16.dp),
                            colors = CardDefaults.cardColors(containerColor = SurfaceContainerLow),
                            border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(OutlineVariantColor.copy(alpha = 0.5f))),
                            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                        ) {
                            Box(modifier = Modifier.fillMaxSize()) {
                                AsyncImage(
                                    model = "https://lh3.googleusercontent.com/aida-public/AB6AXuA2pa0ca1dTG8GwGDvSaMN-cLuRS3uBGY1s27xfGtMiZsKhXozA0zGTtBDrNQUqYfeqgt8QWHy4zYEmlkU4SUqNNqHLnCgsqbg5hiPIwfFX5WVhVVeM0QCDYoeChC0xoNFl1ibGwoSlzgV7CUO_Bocv8RL9Mv8NC6o4I0Qvjxa8MSqrisDtWTfYvpncnVVmAx5XwhzwMKWDJsiaUSNXpUMG7LjeYELpAmre93svGDwCHDT5lktM1MzW",
                                    contentDescription = "Live Delivery Route Map",
                                    contentScale = ContentScale.Crop,
                                    modifier = Modifier.fillMaxSize()
                                )

                                // Live Supabase + LocationIQ GPS Telemetry Overlay
                                Surface(
                                    modifier = Modifier
                                        .align(Alignment.TopStart)
                                        .padding(10.dp),
                                    shape = RoundedCornerShape(8.dp),
                                    color = SurfaceContainerLowest.copy(alpha = 0.94f),
                                    shadowElevation = 2.dp
                                ) {
                                    Row(
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                                    ) {
                                        Box(
                                            modifier = Modifier
                                                .size(8.dp)
                                                .background(EmeraldPrimary, CircleShape)
                                        )
                                        Text(
                                            text = if (riderLocation != null) "GPS: ${String.format("%.4f, %.4f", riderLocation!!.latitude, riderLocation!!.longitude)} • ${riderLocation!!.etaMinutes} min ETA" else "LocationIQ GPS Synced",
                                            style = MaterialTheme.typography.labelSmall,
                                            fontWeight = FontWeight.Bold,
                                            color = MaterialTheme.colorScheme.onSurface,
                                            fontSize = 10.sp
                                        )
                                    }
                                }

                                // Store location overlay badge
                                Surface(
                                    modifier = Modifier
                                        .align(Alignment.BottomEnd)
                                        .padding(12.dp),
                                    shape = RoundedCornerShape(10.dp),
                                    color = SurfaceContainerLowest.copy(alpha = 0.92f),
                                    shadowElevation = 2.dp
                                ) {
                                    Row(
                                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                                    ) {
                                        Icon(
                                            imageVector = Icons.Filled.Storefront,
                                            contentDescription = null,
                                            tint = EmeraldPrimary,
                                            modifier = Modifier.size(18.dp)
                                        )
                                        Text(
                                            text = "DarkStore Hub #3",
                                            style = MaterialTheme.typography.bodySmall,
                                            color = MaterialTheme.colorScheme.onSurface,
                                            fontWeight = FontWeight.Bold
                                        )
                                    }
                                }

                                // Pulsating Rider Icon
                                Box(
                                    modifier = Modifier
                                        .align(Alignment.Center)
                                        .scale(pulseScale)
                                        .size(44.dp)
                                        .background(EmeraldPrimary, shape = CircleShape),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Filled.DirectionsBike,
                                        contentDescription = "Rider in transit",
                                        tint = Color.White,
                                        modifier = Modifier.size(24.dp)
                                    )
                                }
                            }
                        }
                    }
                }

                // Order Status Timeline
                item {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(16.dp))
                            .testTag("order_status_timeline"),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = SurfaceContainerLowest),
                        border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(OutlineVariantColor.copy(alpha = 0.5f))),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(18.dp)
                        ) {
                            Text(
                                text = "Order Status",
                                style = MaterialTheme.typography.titleLarge,
                                color = MaterialTheme.colorScheme.onSurface,
                                fontWeight = FontWeight.Bold
                            )

                            Spacer(modifier = Modifier.height(18.dp))

                            TimelineStepItem(
                                title = "Order Confirmed",
                                subtitle = "12:30 PM",
                                isCompleted = true,
                                isActive = false,
                                isLast = false,
                                icon = Icons.Filled.Check
                            )

                            TimelineStepItem(
                                title = "Preparing your order",
                                subtitle = "The store is packing your items safely.",
                                isCompleted = displayOrder.status != OrderStatus.CONFIRMED,
                                isActive = displayOrder.status == OrderStatus.PREPARING || displayOrder.status == OrderStatus.CONFIRMED,
                                isLast = false,
                                icon = Icons.Filled.Inventory2
                            )

                            TimelineStepItem(
                                title = "On the Way",
                                subtitle = "Rider on the way with your bag",
                                isCompleted = displayOrder.status == OrderStatus.DELIVERED,
                                isActive = displayOrder.status == OrderStatus.ON_THE_WAY,
                                isLast = false,
                                icon = Icons.Filled.DirectionsBike
                            )

                            TimelineStepItem(
                                title = "Delivered",
                                subtitle = "At your doorstep",
                                isCompleted = displayOrder.status == OrderStatus.DELIVERED,
                                isActive = displayOrder.status == OrderStatus.DELIVERED,
                                isLast = true,
                                icon = Icons.Filled.Home
                            )
                        }
                    }
                }

                // Rider Info Card
                item {
                    Card(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(16.dp))
                            .testTag("rider_info_card"),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = SurfaceContainerLowest),
                        border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(OutlineVariantColor.copy(alpha = 0.5f))),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(14.dp)
                            ) {
                                Surface(
                                    modifier = Modifier
                                        .size(52.dp)
                                        .clip(CircleShape),
                                    color = SecondaryContainer,
                                    shape = CircleShape
                                ) {
                                    AsyncImage(
                                        model = displayOrder.riderPhotoUrl,
                                        contentDescription = displayOrder.riderName,
                                        contentScale = ContentScale.Crop,
                                        modifier = Modifier.fillMaxSize()
                                    )
                                }

                                Column {
                                    Text(
                                        text = displayOrder.riderName,
                                        style = MaterialTheme.typography.titleMedium,
                                        color = MaterialTheme.colorScheme.onSurface,
                                        fontWeight = FontWeight.Bold
                                    )
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                                    ) {
                                        Icon(
                                            imageVector = Icons.Filled.Star,
                                            contentDescription = null,
                                            tint = AmberTertiaryContainer,
                                            modifier = Modifier.size(16.dp)
                                        )
                                        Text(
                                            text = "${displayOrder.riderRating}",
                                            style = MaterialTheme.typography.bodyMedium,
                                            fontWeight = FontWeight.Bold,
                                            color = MaterialTheme.colorScheme.onSurface
                                        )
                                        Text(
                                            text = "(${displayOrder.riderDeliveries})",
                                            style = MaterialTheme.typography.bodySmall,
                                            color = OutlineColor
                                        )
                                    }
                                }
                            }

                            Button(
                                onClick = {
                                    val dialIntent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:+919876543210"))
                                    try {
                                        context.startActivity(dialIntent)
                                    } catch (_: Exception) {
                                        Toast.makeText(context, "Calling ${displayOrder.riderName}...", Toast.LENGTH_SHORT).show()
                                    }
                                },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = EmeraldPrimary,
                                    contentColor = Color.White
                                ),
                                shape = RoundedCornerShape(22.dp),
                                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                                modifier = Modifier.testTag("call_rider_btn")
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Filled.Call,
                                        contentDescription = "Call",
                                        modifier = Modifier.size(18.dp)
                                    )
                                    Text(
                                        text = "Call",
                                        style = MaterialTheme.typography.bodyMedium,
                                        fontWeight = FontWeight.Bold
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

@Composable
private fun TimelineStepItem(
    title: String,
    subtitle: String,
    isCompleted: Boolean,
    isActive: Boolean,
    isLast: Boolean,
    icon: ImageVector
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(
                modifier = Modifier
                    .size(26.dp)
                    .background(
                        color = when {
                            isCompleted -> EmeraldPrimary
                            isActive -> EmeraldPrimary
                            else -> SurfaceContainerHigh
                        },
                        shape = CircleShape
                    )
                    .border(
                        width = if (isActive) 3.dp else 1.dp,
                        color = if (isActive) EmeraldPrimaryContainer.copy(alpha = 0.5f) else OutlineVariantColor.copy(alpha = 0.3f),
                        shape = CircleShape
                    ),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = if (isCompleted || isActive) Color.White else MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.size(14.dp)
                )
            }

            if (!isLast) {
                Box(
                    modifier = Modifier
                        .width(2.dp)
                        .height(34.dp)
                        .background(
                            if (isCompleted) EmeraldPrimary.copy(alpha = 0.4f) else OutlineVariantColor.copy(alpha = 0.3f)
                        )
                )
            }
        }

        Column(modifier = Modifier.padding(bottom = if (isLast) 0.dp else 16.dp)) {
            Text(
                text = title,
                style = MaterialTheme.typography.bodyMedium,
                color = if (isActive) EmeraldPrimary else MaterialTheme.colorScheme.onSurface,
                fontWeight = if (isActive || isCompleted) FontWeight.Bold else FontWeight.Medium
            )
            if (subtitle.isNotBlank()) {
                Text(
                    text = subtitle,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}
