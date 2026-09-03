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
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bolt
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Storefront
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
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
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.SampleData
import com.example.data.model.Address
import com.example.data.model.Category
import com.example.data.model.Product
import com.example.ui.components.AuthBottomSheet
import com.example.ui.components.CategoryCircleItem
import com.example.ui.components.FloatingCartBar
import com.example.ui.components.LocationStoreAvailabilitySheet
import com.example.ui.components.ProductGridCard
import com.example.ui.components.PromoBanner
import com.example.ui.theme.AmberTertiary
import com.example.ui.theme.AmberTertiaryContainer
import com.example.ui.theme.EmeraldPrimary
import com.example.ui.theme.EmeraldPrimaryContainer
import com.example.ui.theme.OnEmeraldPrimaryContainer
import com.example.ui.theme.OutlineVariantColor
import com.example.ui.theme.SurfaceContainerHighest
import com.example.ui.theme.SurfaceContainerLow
import com.example.ui.theme.SurfaceContainerLowest
import com.example.ui.viewmodel.AddressViewModel
import com.example.ui.viewmodel.AuthViewModel
import com.example.ui.viewmodel.CartViewModel
import com.example.ui.viewmodel.LocationStoreViewModel
import com.example.ui.viewmodel.ProductViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    cartViewModel: CartViewModel,
    addressViewModel: AddressViewModel,
    productViewModel: ProductViewModel,
    locationViewModel: LocationStoreViewModel? = null,
    authViewModel: AuthViewModel? = null,
    onNavigateToProduct: (String) -> Unit,
    onNavigateToSearch: (String) -> Unit,
    onNavigateToAddresses: () -> Unit,
    onNavigateToCart: () -> Unit,
    onNavigateToCategories: () -> Unit,
    modifier: Modifier = Modifier
) {
    val selectedAddress by addressViewModel.selectedAddress.collectAsState()
    val cartItems by cartViewModel.cartItems.collectAsState()
    val totalCount by cartViewModel.itemCount.collectAsState()
    val subtotal by cartViewModel.subtotal.collectAsState()
    val allProducts by productViewModel.allProducts.collectAsState()
    val storeAvailability = locationViewModel?.storeAvailability?.collectAsState()?.value
    val currentUser = authViewModel?.currentUser?.collectAsState()?.value

    var showLocationSheet by remember { mutableStateOf(false) }
    var showAuthSheet by remember { mutableStateOf(false) }

    val bestSellers = allProducts.filter { it.isBestSeller }
    val currency = bestSellers.firstOrNull()?.unitCurrency ?: "₹"

    if (showLocationSheet && locationViewModel != null) {
        LocationStoreAvailabilitySheet(
            locationViewModel = locationViewModel,
            addressViewModel = addressViewModel,
            onDismiss = { showLocationSheet = false },
            onAddressSelected = { selectedLocName ->
                showLocationSheet = false
            }
        )
    }

    if (showAuthSheet && authViewModel != null) {
        AuthBottomSheet(
            authViewModel = authViewModel,
            onDismiss = { showAuthSheet = false }
        )
    }

    Box(modifier = modifier.fillMaxSize()) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
                .testTag("home_screen"),
            contentPadding = PaddingValues(bottom = 120.dp)
        ) {
            // Top App Bar: Delivery location & notification / profile icons
            item {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    color = MaterialTheme.colorScheme.surface,
                    shadowElevation = 1.dp
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 10.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(8.dp))
                                .clickable(onClick = {
                                    if (locationViewModel != null) {
                                        showLocationSheet = true
                                    } else {
                                        onNavigateToAddresses()
                                    }
                                })
                                .testTag("delivery_location_selector"),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Filled.LocationOn,
                                contentDescription = "Location",
                                tint = EmeraldPrimary,
                                modifier = Modifier.size(24.dp)
                            )
                            Column {
                                Text(
                                    text = "Deliver to ${selectedAddress?.tag ?: "Home"} • 8 Mins",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = EmeraldPrimary,
                                    fontWeight = FontWeight.Bold
                                )
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(
                                        text = selectedAddress?.line1 ?: "Patia, Bhubaneswar",
                                        style = MaterialTheme.typography.titleMedium,
                                        color = MaterialTheme.colorScheme.onSurface,
                                        fontWeight = FontWeight.Bold,
                                        maxLines = 1,
                                        overflow = TextOverflow.Ellipsis
                                    )
                                    Icon(
                                        imageVector = Icons.Filled.ExpandMore,
                                        contentDescription = "Change Address",
                                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                        modifier = Modifier.size(20.dp)
                                    )
                                }
                            }
                        }

                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                            // User Auth Avatar button
                            IconButton(
                                onClick = {
                                    if (authViewModel != null) {
                                        showAuthSheet = true
                                    }
                                },
                                modifier = Modifier.testTag("auth_profile_btn")
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(32.dp)
                                        .background(EmeraldPrimaryContainer, CircleShape),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Filled.Person,
                                        contentDescription = "Account",
                                        tint = OnEmeraldPrimaryContainer,
                                        modifier = Modifier.size(18.dp)
                                    )
                                }
                            }

                            IconButton(
                                onClick = { /* Notification action */ },
                                modifier = Modifier.testTag("notification_btn")
                            ) {
                                Icon(
                                    imageVector = Icons.Filled.Notifications,
                                    contentDescription = "Notifications",
                                    tint = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    }
                }
            }

            // Search Bar (Mobile input mockup)
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 8.dp)
                ) {
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp)
                            .clip(RoundedCornerShape(16.dp))
                            .border(1.dp, OutlineVariantColor, RoundedCornerShape(16.dp))
                            .clickable { onNavigateToSearch("") }
                            .testTag("home_search_bar"),
                        color = SurfaceContainerHighest,
                        shape = RoundedCornerShape(16.dp)
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(horizontal = 14.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Filled.Search,
                                    contentDescription = "Search",
                                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                    modifier = Modifier.size(22.dp)
                                )
                                Text(
                                    text = "Search groceries, milk, fruits...",
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            Icon(
                                imageVector = Icons.Filled.Mic,
                                contentDescription = "Voice Search",
                                tint = EmeraldPrimary,
                                modifier = Modifier.size(22.dp)
                            )
                        }
                    }
                }
            }

            // Real-time Dark Store Availability Badge (LocationIQ + Supabase Sync)
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 2.dp)
                ) {
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .clickable { showLocationSheet = true },
                        shape = RoundedCornerShape(12.dp),
                        color = EmeraldPrimaryContainer.copy(alpha = 0.2f),
                        border = androidx.compose.foundation.BorderStroke(1.dp, EmeraldPrimary.copy(alpha = 0.4f))
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Filled.Bolt,
                                    contentDescription = "Lightning Delivery",
                                    tint = EmeraldPrimary,
                                    modifier = Modifier.size(20.dp)
                                )
                                Column {
                                    Text(
                                        text = "⚡ Delivery in 8-10 Mins",
                                        style = MaterialTheme.typography.titleSmall,
                                        color = EmeraldPrimary,
                                        fontWeight = FontWeight.Bold
                                    )
                                    Text(
                                        text = "Dispatched from ${storeAvailability?.nearestStore?.name ?: "Patia DarkStore Hub #3"} (${String.format("%.1f", storeAvailability?.distanceKm ?: 1.2)} km away)",
                                        style = MaterialTheme.typography.labelSmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }

                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = EmeraldPrimary
                            ) {
                                Text(
                                    text = "LIVE",
                                    color = Color.White,
                                    style = MaterialTheme.typography.labelSmall,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                        }
                    }
                }
            }

            // Promotional Banners Carousel
            item {
                LazyRow(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 10.dp),
                    contentPadding = PaddingValues(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    item {
                        PromoBanner(
                            title = "20% Off Farm Fresh Veggies",
                            tag = "FRESH DEALS",
                            buttonText = "Shop Now",
                            bgImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDm1wzZYAEUfLizqS2ayeBMoL25i87BDPjFE12HRt4dZT9X_XGwQxygpt-vB23H9ewau76dUiE8JS79zX1BhjW0mEneh3tRLUReuDssC5zCl6zyGQx74sSFFD2Pm3t-cP0lTQr75DsUNnLafvH38tsYZeXrg3coJbrV6nWRIDPZa_a39_BNRYGKW-bVaNivbcfXz3-kxuV7suHAiueavwkz7rNYKWO9mNlNFX4abGt3ihCgXiKWzaej",
                            onClick = { onNavigateToSearch("Fresh") },
                            modifier = Modifier.width(300.dp)
                        )
                    }
                    item {
                        PromoBanner(
                            title = "Stock up on Dairy",
                            tag = "DAILY ESSENTIALS",
                            buttonText = "Explore",
                            bgImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDoLOsNAA5hAqL-pvVsa1tAxie2WLm9AT3EfMWPgU5ySQ17WSBWJhUmLBUAkPb8b01rsaThFn8yFrMByXsyF50CBZ8Uq7ddY39IE1v89jPOZpFKLvm9NbmS-Ou5cayw-i1AJ3OS5R7LbFjtenmB2z6JI45pIAmOmcpNP9e6djXbqQXMJe-TS5NWAbI0sTn0XVhSYhGBpMg-vL_kxEoVT3l3nY78JsrD1wTupyrsGldt1M8hsr5Rd6uU",
                            isSecondary = true,
                            onClick = { onNavigateToSearch("Milk") },
                            modifier = Modifier.width(300.dp)
                        )
                    }
                }
            }

            // Quick Categories Circular Row
            item {
                Column(modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp)) {
                    LazyRow(
                        modifier = Modifier.fillMaxWidth(),
                        contentPadding = PaddingValues(horizontal = 16.dp),
                        horizontalArrangement = Arrangement.spacedBy(14.dp)
                    ) {
                        items(SampleData.categories) { category ->
                            CategoryCircleItem(
                                category = category,
                                onClick = {
                                    onNavigateToSearch(category.name)
                                }
                            )
                        }
                    }
                }
            }

            // Best Sellers Section Header
            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Best Sellers",
                        style = MaterialTheme.typography.headlineMedium,
                        color = MaterialTheme.colorScheme.onSurface,
                        fontWeight = FontWeight.ExtraBold
                    )
                    TextButton(
                        onClick = onNavigateToCategories,
                        modifier = Modifier.testTag("see_all_bestsellers")
                    ) {
                        Text(
                            text = "See All",
                            style = MaterialTheme.typography.titleSmall,
                            color = EmeraldPrimary,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            // Best Sellers 2-Column Grid (Chunked in pairs)
            val productPairs = bestSellers.chunked(2)
            items(productPairs) { pair ->
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

        // Floating Cart Bar (Contextual overlay above BottomNav)
        FloatingCartBar(
            itemCount = totalCount,
            totalPriceFormatted = "${currency}${if (subtotal % 1.0 == 0.0) subtotal.toInt().toString() else String.format("%.2f", subtotal)}",
            onViewCart = onNavigateToCart,
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 68.dp)
        )
    }
}
