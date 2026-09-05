package com.example.ui.screens.shop

import androidx.compose.foundation.background
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
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Assessment
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Inventory2
import androidx.compose.material.icons.filled.ListAlt
import androidx.compose.material.icons.filled.LocalShipping
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.ShoppingBag
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.Storefront
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.AmberTertiaryContainer
import com.example.ui.theme.EmeraldPrimary
import com.example.ui.theme.EmeraldPrimaryContainer

data class ShopOrder(
    val orderId: String,
    val customerName: String,
    val itemCount: Int,
    val totalAmount: String,
    val status: String,
    val timeAgo: String,
    val otp: String
)

data class ShopProduct(
    val id: String,
    val name: String,
    val category: String,
    val price: String,
    val stock: Int,
    val imageUrl: String
)

/**
 * Shop App Root — contains all shop screens with internal navigation
 */
@Composable
fun ShopAppRoot(
    onSwitchToCustomer: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    var selectedTab by remember { mutableIntStateOf(0) }
    val tabs = listOf("Dashboard", "Orders", "Inventory", "Profile")
    val tabIcons = listOf(
        Icons.Filled.Home,
        Icons.Filled.ListAlt,
        Icons.Filled.Inventory2,
        Icons.Filled.Person
    )

    Scaffold(
        modifier = modifier.fillMaxSize(),
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surfaceContainerLowest,
                modifier = Modifier.shadow(8.dp)
            ) {
                tabs.forEachIndexed { index, title ->
                    NavigationBarItem(
                        selected = selectedTab == index,
                        onClick = { selectedTab = index },
                        icon = {
                            Icon(
                                imageVector = tabIcons[index],
                                contentDescription = title,
                                modifier = Modifier.size(24.dp)
                            )
                        },
                        label = {
                            Text(
                                text = title,
                                style = MaterialTheme.typography.labelSmall.copy(
                                    fontWeight = if (selectedTab == index) FontWeight.Bold else FontWeight.Medium
                                )
                            )
                        },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = EmeraldPrimary,
                            selectedTextColor = EmeraldPrimary,
                            indicatorColor = EmeraldPrimaryContainer.copy(alpha = 0.12f)
                        )
                    )
                }
            }
        }
    ) { innerPadding ->
        when (selectedTab) {
            0 -> ShopDashboardScreen(modifier = Modifier.padding(innerPadding))
            1 -> ShopOrdersScreen(modifier = Modifier.padding(innerPadding))
            2 -> ShopInventoryScreen(modifier = Modifier.padding(innerPadding))
            3 -> ShopProfileScreen(
                modifier = Modifier.padding(innerPadding),
                onSwitchToCustomer = onSwitchToCustomer
            )
        }
    }
}

@Composable
fun ShopDashboardScreen(modifier: Modifier = Modifier) {
    val supabase = remember { com.example.data.remote.SupabaseService() }
    val apiService = remember { com.example.data.remote.CartCrazeApiService() }
    var liveOrders by remember { mutableStateOf<List<ShopOrder>>(emptyList()) }
    var productCount by remember { mutableStateOf(0) }

    androidx.compose.runtime.LaunchedEffect(Unit) {
        try {
            val orders = supabase.fetchLiveOrders()
            liveOrders = orders.map { co ->
                ShopOrder(
                    orderId = co.orderId,
                    customerName = "Customer (${co.deliveryAddress.take(18)})",
                    itemCount = 3,
                    totalAmount = "₹${co.total.toInt()}",
                    status = when (co.status.uppercase()) {
                        "CONFIRMED" -> "NEW"
                        "PREPARING" -> "PREPARING"
                        "READY_FOR_PICKUP" -> "READY"
                        "ON_THE_WAY" -> "READY"
                        "DELIVERED" -> "DELIVERED"
                        else -> co.status
                    },
                    timeAgo = "Live",
                    otp = co.orderId.takeLast(4).filter { it.isDigit() }.ifBlank { "4829" }
                )
            }
            val prods = apiService.fetchProducts()
            productCount = prods.size
        } catch (_: Exception) {}
    }

    val totalRevenue = liveOrders.sumOf {
        it.totalAmount.replace("₹", "").toDoubleOrNull() ?: 0.0
    }

    LazyColumn(
        modifier = modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Header
        item {
            Column {
                Text(
                    text = "CartCraze Store Hub",
                    style = MaterialTheme.typography.headlineMedium.copy(
                        fontWeight = FontWeight.ExtraBold
                    ),
                    color = MaterialTheme.colorScheme.onSurface
                )
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .clip(CircleShape)
                            .background(EmeraldPrimaryContainer)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "Live Store • Connected to Supabase & Cloud",
                        style = MaterialTheme.typography.bodyMedium,
                        color = EmeraldPrimaryContainer
                    )
                }
            }
        }

        // Stats Grid
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                ShopStatCard(
                    icon = Icons.Filled.ShoppingBag,
                    label = "Live Orders",
                    value = "${liveOrders.size}",
                    color = EmeraldPrimaryContainer,
                    modifier = Modifier.weight(1f)
                )
                ShopStatCard(
                    icon = Icons.Filled.TrendingUp,
                    label = "Live Revenue",
                    value = "₹${totalRevenue.toInt()}",
                    color = AmberTertiaryContainer,
                    modifier = Modifier.weight(1f)
                )
            }
        }

        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                ShopStatCard(
                    icon = Icons.Filled.Inventory2,
                    label = "Products",
                    value = if (productCount > 0) "$productCount" else "50+",
                    color = Color(0xFF7C3AED),
                    modifier = Modifier.weight(1f)
                )
                ShopStatCard(
                    icon = Icons.Filled.Star,
                    label = "Store Rating",
                    value = "4.9",
                    color = Color(0xFFEC4899),
                    modifier = Modifier.weight(1f)
                )
            }
        }

        // Recent Orders
        item {
            Text(
                text = "Live Orders Feed",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                color = MaterialTheme.colorScheme.onSurface,
                modifier = Modifier.padding(top = 4.dp)
            )
        }

        if (liveOrders.isEmpty()) {
            item {
                ElevatedCard(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.elevatedCardColors(
                        containerColor = MaterialTheme.colorScheme.surfaceContainerLowest
                    )
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(
                            imageVector = Icons.Filled.ShoppingBag,
                            contentDescription = null,
                            tint = EmeraldPrimaryContainer,
                            modifier = Modifier.size(40.dp)
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        Text(
                            text = "No Live Orders Right Now",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "When customers place orders, they will instantly appear here for preparation.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            textAlign = androidx.compose.ui.text.style.TextAlign.Center
                        )
                    }
                }
            }
        } else {
            items(liveOrders.take(5)) { order ->
                ShopOrderCard(order = order)
            }
        }
    }
}

@Composable
fun ShopStatCard(
    icon: ImageVector,
    label: String,
    value: String,
    color: Color,
    modifier: Modifier = Modifier
) {
    ElevatedCard(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.elevatedCardColors(
            containerColor = MaterialTheme.colorScheme.surfaceContainerLowest
        ),
        elevation = CardDefaults.elevatedCardElevation(defaultElevation = 1.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(color.copy(alpha = 0.12f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = label,
                    tint = color,
                    modifier = Modifier.size(22.dp)
                )
            }
            Spacer(modifier = Modifier.height(10.dp))
            Text(
                text = value,
                style = MaterialTheme.typography.titleLarge.copy(
                    fontWeight = FontWeight.ExtraBold,
                    fontSize = 20.sp
                ),
                color = MaterialTheme.colorScheme.onSurface
            )
            Text(
                text = label,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
fun ShopOrdersScreen(modifier: Modifier = Modifier) {
    var selectedFilter by remember { mutableStateOf("All") }
    val filters = listOf("All", "New", "Preparing", "Ready", "Delivered")
    var ordersList by remember { mutableStateOf<List<ShopOrder>>(emptyList()) }
    val coroutineScope = androidx.compose.runtime.rememberCoroutineScope()
    val supabase = remember { com.example.data.remote.SupabaseService() }

    androidx.compose.runtime.LaunchedEffect(Unit) {
        try {
            val cloudOrders = supabase.fetchLiveOrders()
            ordersList = cloudOrders.map { co ->
                ShopOrder(
                    orderId = co.orderId,
                    customerName = "Customer (${co.deliveryAddress.take(18)})",
                    itemCount = 3,
                    totalAmount = "₹${co.total.toInt()}",
                    status = when (co.status.uppercase()) {
                        "CONFIRMED" -> "NEW"
                        "PREPARING" -> "PREPARING"
                        "READY_FOR_PICKUP" -> "READY"
                        "ON_THE_WAY" -> "READY"
                        "DELIVERED" -> "DELIVERED"
                        else -> co.status
                    },
                    timeAgo = "Live",
                    otp = co.orderId.takeLast(4).filter { it.isDigit() }.ifBlank { "4829" }
                )
            }
        } catch (_: Exception) {}
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "Order Management",
            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.ExtraBold),
            color = MaterialTheme.colorScheme.onSurface
        )
        Spacer(modifier = Modifier.height(12.dp))

        // Filter chips
        Row(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            filters.forEach { filter ->
                val isSelected = selectedFilter == filter
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(20.dp))
                        .background(
                            if (isSelected) EmeraldPrimaryContainer
                            else MaterialTheme.colorScheme.surfaceContainerHigh
                        )
                        .clickable { selectedFilter = filter }
                        .padding(horizontal = 14.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = filter,
                        style = MaterialTheme.typography.labelLarge.copy(
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                            fontSize = 12.sp
                        ),
                        color = if (isSelected) Color.White else MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        val filteredOrders = if (selectedFilter == "All") ordersList
        else ordersList.filter { it.status.equals(selectedFilter, ignoreCase = true) }

        if (filteredOrders.isEmpty()) {
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
                    Icon(
                        imageVector = Icons.Filled.ShoppingBag,
                        contentDescription = null,
                        tint = EmeraldPrimaryContainer,
                        modifier = Modifier.size(48.dp)
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = if (selectedFilter == "All") "No Live Orders" else "No $selectedFilter Orders",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Orders placed by customers will update in real time.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        textAlign = androidx.compose.ui.text.style.TextAlign.Center
                    )
                }
            }
        } else {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                items(filteredOrders) { order ->
                    ShopOrderCard(
                        order = order,
                        showActions = true,
                        onStatusChange = { newStatus ->
                            ordersList = ordersList.map {
                                if (it.orderId == order.orderId) it.copy(status = newStatus) else it
                            }
                            coroutineScope.launch {
                                supabase.updateOrderStatus(order.orderId, newStatus)
                            }
                        }
                    )
                }
            }
        }
    }
}

@Composable
fun ShopOrderCard(
    order: ShopOrder,
    showActions: Boolean = false,
    onStatusChange: (String) -> Unit = {},
    modifier: Modifier = Modifier
) {
    val statusColor = when (order.status.uppercase()) {
        "NEW" -> AmberTertiaryContainer
        "PREPARING" -> Color(0xFF7C3AED)
        "READY" -> EmeraldPrimaryContainer
        "DELIVERED" -> EmeraldPrimary
        else -> MaterialTheme.colorScheme.onSurfaceVariant
    }

    ElevatedCard(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.elevatedCardColors(
            containerColor = MaterialTheme.colorScheme.surfaceContainerLowest
        ),
        elevation = CardDefaults.elevatedCardElevation(defaultElevation = 1.dp)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = order.orderId,
                        style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = "${order.customerName} • ${order.itemCount} items",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                Column(horizontalAlignment = Alignment.End) {
                    // Status Badge
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(8.dp))
                            .background(statusColor.copy(alpha = 0.12f))
                            .padding(horizontal = 10.dp, vertical = 4.dp)
                    ) {
                        Text(
                            text = order.status.uppercase(),
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = FontWeight.Bold
                            ),
                            color = statusColor
                        )
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = order.totalAmount,
                        style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }
            }

            if (showActions && order.status.uppercase() != "DELIVERED") {
                Spacer(modifier = Modifier.height(10.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    val (nextActionLabel, targetStatus) = when (order.status.uppercase()) {
                        "NEW" -> Pair("Accept & Prepare", "PREPARING")
                        "PREPARING" -> Pair("Mark Ready", "READY")
                        "READY" -> Pair("Hand to Rider", "DELIVERED")
                        else -> Pair(null, null)
                    }

                    if (nextActionLabel != null && targetStatus != null) {
                        Button(
                            onClick = { onStatusChange(targetStatus) },
                            modifier = Modifier
                                .weight(1f)
                                .height(40.dp),
                            shape = RoundedCornerShape(12.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = EmeraldPrimaryContainer)
                        ) {
                            Text(
                                text = nextActionLabel,
                                style = MaterialTheme.typography.labelLarge,
                                color = Color.White
                            )
                        }
                    }
                }

                if (order.otp.isNotBlank() && order.status.uppercase() == "READY") {
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(10.dp))
                            .background(MaterialTheme.colorScheme.surfaceContainerHigh.copy(alpha = 0.5f))
                            .padding(10.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "Rider OTP",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Text(
                            text = order.otp,
                            style = MaterialTheme.typography.titleSmall.copy(
                                fontWeight = FontWeight.Black,
                                letterSpacing = 3.sp
                            ),
                            color = EmeraldPrimary
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun ShopInventoryScreen(modifier: Modifier = Modifier) {
    var selectedCategory by remember { mutableStateOf("All") }
    val categories = listOf("All", "Fruits", "Vegetables", "Dairy & Eggs", "Bakery", "Snacks", "Beverages")
    var productsList by remember { mutableStateOf<List<ShopProduct>>(emptyList()) }
    val apiService = remember { com.example.data.remote.CartCrazeApiService() }

    androidx.compose.runtime.LaunchedEffect(Unit) {
        try {
            val apiProducts = apiService.fetchProducts()
            if (apiProducts.isNotEmpty()) {
                productsList = apiProducts.map { p ->
                    ShopProduct(
                        id = p.id,
                        name = p.name,
                        category = p.category.ifBlank { "General" },
                        price = "₹${p.price.toInt()}",
                        stock = p.stockCount.coerceAtLeast(12),
                        imageUrl = p.image
                    )
                }
            }
        } catch (_: Exception) {}
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Inventory",
                style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.ExtraBold),
                color = MaterialTheme.colorScheme.onSurface
            )
            FloatingActionButton(
                onClick = { /* Add product */ },
                containerColor = EmeraldPrimaryContainer,
                modifier = Modifier.size(40.dp)
            ) {
                Icon(
                    imageVector = Icons.Filled.Add,
                    contentDescription = "Add Product",
                    tint = Color.White
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Category filter
        Row(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            categories.take(4).forEach { cat ->
                val isSelected = selectedCategory == cat
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(20.dp))
                        .background(
                            if (isSelected) EmeraldPrimaryContainer
                            else MaterialTheme.colorScheme.surfaceContainerHigh
                        )
                        .clickable { selectedCategory = cat }
                        .padding(horizontal = 14.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = cat,
                        style = MaterialTheme.typography.labelLarge.copy(
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                            fontSize = 12.sp
                        ),
                        color = if (isSelected) Color.White else MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        val filteredProducts = if (selectedCategory == "All") productsList
        else productsList.filter { it.category.contains(selectedCategory, ignoreCase = true) }

        if (filteredProducts.isEmpty()) {
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
                    Icon(
                        imageVector = Icons.Filled.Inventory2,
                        contentDescription = null,
                        tint = EmeraldPrimaryContainer,
                        modifier = Modifier.size(48.dp)
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "Loading Live Inventory...",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Connecting to live store cloud catalog",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        } else {
            // Products Grid
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(filteredProducts) { product ->
                    ShopProductCard(product = product)
                }
            }
        }
    }
}

@Composable
fun ShopProductCard(
    product: ShopProduct,
    modifier: Modifier = Modifier
) {
    val stockColor = when {
        product.stock <= 5 -> MaterialTheme.colorScheme.error
        product.stock <= 15 -> AmberTertiaryContainer
        else -> EmeraldPrimaryContainer
    }

    ElevatedCard(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.elevatedCardColors(
            containerColor = MaterialTheme.colorScheme.surfaceContainerLowest
        )
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            // Product image placeholder
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(80.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(MaterialTheme.colorScheme.surfaceContainerHigh),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Filled.Inventory2,
                    contentDescription = product.name,
                    tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f),
                    modifier = Modifier.size(32.dp)
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = product.name,
                style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.SemiBold),
                color = MaterialTheme.colorScheme.onSurface,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )

            Spacer(modifier = Modifier.height(4.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = product.price,
                    style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                    color = MaterialTheme.colorScheme.onSurface
                )
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(6.dp))
                        .background(stockColor.copy(alpha = 0.12f))
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = "${product.stock}",
                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                        color = stockColor
                    )
                }
            }
        }
    }
}

@Composable
fun ShopProfileScreen(
    modifier: Modifier = Modifier,
    onSwitchToCustomer: () -> Unit = {}
) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(24.dp))

        Box(
            modifier = Modifier
                .size(90.dp)
                .clip(CircleShape)
                .background(EmeraldPrimaryContainer.copy(alpha = 0.15f)),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Filled.Storefront,
                contentDescription = "Shop",
                tint = EmeraldPrimaryContainer,
                modifier = Modifier.size(44.dp)
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "CartCraze Live Store Hub",
            style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
            color = MaterialTheme.colorScheme.onSurface
        )
        Text(
            text = "Connected Store • Since 2025",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        Spacer(modifier = Modifier.height(24.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            ShopProfileStat("Live", "Mode")
            ShopProfileStat("4.9", "Rating")
            ShopProfileStat("100%", "Uptime")
        }

        Spacer(modifier = Modifier.height(32.dp))

        listOf(
            "Store Settings" to Icons.Filled.Storefront,
            "Analytics" to Icons.Filled.Assessment,
            "Delivery Partners" to Icons.Filled.LocalShipping,
            "Help & Support" to Icons.Filled.Person
        ).forEach { (label, icon) ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(14.dp))
                    .clickable { }
                    .padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = label,
                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.size(22.dp)
                )
                Spacer(modifier = Modifier.width(14.dp))
                Text(
                    text = label,
                    style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.Medium),
                    color = MaterialTheme.colorScheme.onSurface
                )
            }
        }

        Spacer(modifier = Modifier.weight(1f))

        OutlinedButton(
            onClick = onSwitchToCustomer,
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp),
            shape = RoundedCornerShape(14.dp)
        ) {
            Text("Switch to Customer App")
        }
    }
}

@Composable
private fun ShopProfileStat(value: String, label: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            text = value,
            style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.ExtraBold),
            color = MaterialTheme.colorScheme.onSurface
        )
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}
