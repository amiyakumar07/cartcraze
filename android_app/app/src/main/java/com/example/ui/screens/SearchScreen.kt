package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
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
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.components.FloatingCartBar
import com.example.ui.components.ProductGridCard
import com.example.ui.theme.EmeraldPrimary
import com.example.ui.theme.EmeraldPrimaryContainer
import com.example.ui.theme.OnEmeraldPrimaryContainer
import com.example.ui.theme.OutlineVariantColor
import com.example.ui.theme.SurfaceContainerHighest
import com.example.ui.theme.SurfaceContainerLow
import com.example.ui.viewmodel.CartViewModel
import com.example.ui.viewmodel.ProductViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SearchScreen(
    initialQuery: String = "",
    cartViewModel: CartViewModel,
    productViewModel: ProductViewModel,
    onBack: () -> Unit,
    onNavigateToProduct: (String) -> Unit,
    onNavigateToCart: () -> Unit,
    modifier: Modifier = Modifier
) {
    var searchQuery by remember { mutableStateOf(initialQuery.ifBlank { "Milk" }) }
    val cartItems by cartViewModel.cartItems.collectAsState()
    val totalCount by cartViewModel.itemCount.collectAsState()
    val subtotal by cartViewModel.subtotal.collectAsState()

    var priceMenuExpanded by remember { mutableStateOf(false) }
    var ratingMenuExpanded by remember { mutableStateOf(false) }
    var brandMenuExpanded by remember { mutableStateOf(false) }

    val selectedPriceFilter by productViewModel.selectedPriceFilter.collectAsState()
    val selectedRatingFilter by productViewModel.selectedRatingFilter.collectAsState()
    val selectedBrandFilter by productViewModel.selectedBrandFilter.collectAsState()

    LaunchedEffect(initialQuery) {
        if (initialQuery.isNotBlank()) {
            searchQuery = initialQuery
            productViewModel.onSearchQueryChanged(initialQuery)
        } else if (searchQuery.isNotBlank()) {
            productViewModel.onSearchQueryChanged(searchQuery)
        }
    }

    val filteredProducts = productViewModel.getFilteredProducts()
    val currency = filteredProducts.firstOrNull()?.unitCurrency ?: "₹"

    Box(modifier = modifier.fillMaxSize().background(MaterialTheme.colorScheme.background)) {
        Column(modifier = Modifier.fillMaxSize()) {
            // Header Search Input
            Surface(
                modifier = Modifier.fillMaxWidth(),
                color = MaterialTheme.colorScheme.surface,
                shadowElevation = 1.dp
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 8.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    IconButton(
                        onClick = onBack,
                        modifier = Modifier.testTag("search_back_btn")
                    ) {
                        Icon(
                            imageVector = Icons.Filled.ArrowBack,
                            contentDescription = "Back",
                            tint = MaterialTheme.colorScheme.onSurface
                        )
                    }

                    OutlinedTextField(
                        value = searchQuery,
                        onValueChange = {
                            searchQuery = it
                            productViewModel.onSearchQueryChanged(it)
                        },
                        placeholder = {
                            Text(
                                text = "Search groceries...",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        },
                        leadingIcon = {
                            Icon(
                                imageVector = Icons.Filled.Search,
                                contentDescription = "Search",
                                tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier.size(20.dp)
                            )
                        },
                        trailingIcon = {
                            if (searchQuery.isNotEmpty()) {
                                IconButton(
                                    onClick = {
                                        searchQuery = ""
                                        productViewModel.onSearchQueryChanged("")
                                    }
                                ) {
                                    Icon(
                                        imageVector = Icons.Filled.Clear,
                                        contentDescription = "Clear",
                                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                        modifier = Modifier.size(18.dp)
                                    )
                                }
                            } else {
                                Icon(
                                    imageVector = Icons.Filled.Mic,
                                    contentDescription = "Voice",
                                    tint = EmeraldPrimary,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                        },
                        shape = RoundedCornerShape(16.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedContainerColor = SurfaceContainerHighest,
                            unfocusedContainerColor = SurfaceContainerHighest,
                            focusedBorderColor = EmeraldPrimary,
                            unfocusedBorderColor = OutlineVariantColor
                        ),
                        singleLine = true,
                        textStyle = MaterialTheme.typography.bodyMedium.copy(color = MaterialTheme.colorScheme.onSurface),
                        modifier = Modifier
                            .weight(1f)
                            .height(50.dp)
                            .testTag("search_text_input")
                    )
                }
            }

            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .testTag("search_results_list"),
                contentPadding = PaddingValues(bottom = 120.dp)
            ) {
                // Results Header & Filter Chips
                item {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 12.dp)
                    ) {
                        Text(
                            text = "${filteredProducts.size} results for \"${searchQuery.ifBlank { "All Items" }}\"",
                            style = MaterialTheme.typography.headlineMedium,
                            color = MaterialTheme.colorScheme.onSurface,
                            fontWeight = FontWeight.ExtraBold
                        )

                        Spacer(modifier = Modifier.height(12.dp))

                        // Filter chips horizontal scroll
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .horizontalScroll(rememberScrollState()),
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            // Price Filter Chip
                            Box {
                                FilterChip(
                                    label = if (selectedPriceFilter != null) "Price: $selectedPriceFilter" else "Price",
                                    hasDropdown = true,
                                    isSelected = selectedPriceFilter != null,
                                    onClick = { priceMenuExpanded = true },
                                    testTag = "filter_price"
                                )
                                DropdownMenu(
                                    expanded = priceMenuExpanded,
                                    onDismissRequest = { priceMenuExpanded = false }
                                ) {
                                    DropdownMenuItem(
                                        text = { Text("All Prices") },
                                        onClick = {
                                            productViewModel.onPriceFilterSelected(null)
                                            priceMenuExpanded = false
                                        }
                                    )
                                    DropdownMenuItem(
                                        text = { Text("Price: Low to High") },
                                        onClick = {
                                            productViewModel.onPriceFilterSelected("Low to High")
                                            priceMenuExpanded = false
                                        }
                                    )
                                    DropdownMenuItem(
                                        text = { Text("Price: High to Low") },
                                        onClick = {
                                            productViewModel.onPriceFilterSelected("High to Low")
                                            priceMenuExpanded = false
                                        }
                                    )
                                    DropdownMenuItem(
                                        text = { Text("Under ₹50 / $3") },
                                        onClick = {
                                            productViewModel.onPriceFilterSelected("Under ₹50")
                                            priceMenuExpanded = false
                                        }
                                    )
                                }
                            }

                            // Rating Filter Chip
                            Box {
                                FilterChip(
                                    label = if (selectedRatingFilter != null) "Rating: ${selectedRatingFilter}★+" else "Rating",
                                    hasDropdown = true,
                                    isSelected = selectedRatingFilter != null,
                                    onClick = { ratingMenuExpanded = true },
                                    testTag = "filter_rating"
                                )
                                DropdownMenu(
                                    expanded = ratingMenuExpanded,
                                    onDismissRequest = { ratingMenuExpanded = false }
                                ) {
                                    DropdownMenuItem(
                                        text = { Text("All Ratings") },
                                        onClick = {
                                            productViewModel.onRatingFilterSelected(null)
                                            ratingMenuExpanded = false
                                        }
                                    )
                                    DropdownMenuItem(
                                        text = { Text("4.5★ and above") },
                                        onClick = {
                                            productViewModel.onRatingFilterSelected(4.5)
                                            ratingMenuExpanded = false
                                        }
                                    )
                                    DropdownMenuItem(
                                        text = { Text("4.0★ and above") },
                                        onClick = {
                                            productViewModel.onRatingFilterSelected(4.0)
                                            ratingMenuExpanded = false
                                        }
                                    )
                                }
                            }

                            // Brand Filter Chip
                            Box {
                                FilterChip(
                                    label = if (selectedBrandFilter != null) "Brand: $selectedBrandFilter" else "Brand",
                                    hasDropdown = true,
                                    isSelected = selectedBrandFilter != null,
                                    onClick = { brandMenuExpanded = true },
                                    testTag = "filter_brand"
                                )
                                DropdownMenu(
                                    expanded = brandMenuExpanded,
                                    onDismissRequest = { brandMenuExpanded = false }
                                ) {
                                    DropdownMenuItem(
                                        text = { Text("All Brands") },
                                        onClick = {
                                            productViewModel.onBrandFilterSelected(null)
                                            brandMenuExpanded = false
                                        }
                                    )
                                    DropdownMenuItem(
                                        text = { Text("Farm Fresh") },
                                        onClick = {
                                            productViewModel.onBrandFilterSelected("Farm Fresh")
                                            brandMenuExpanded = false
                                        }
                                    )
                                    DropdownMenuItem(
                                        text = { Text("Daily Dairy") },
                                        onClick = {
                                            productViewModel.onBrandFilterSelected("Daily Dairy")
                                            brandMenuExpanded = false
                                        }
                                    )
                                    DropdownMenuItem(
                                        text = { Text("Amul") },
                                        onClick = {
                                            productViewModel.onBrandFilterSelected("Amul")
                                            brandMenuExpanded = false
                                        }
                                    )
                                }
                            }

                            // Filters Button (Pill Action)
                            Surface(
                                shape = RoundedCornerShape(22.dp),
                                color = EmeraldPrimaryContainer,
                                modifier = Modifier
                                    .clip(RoundedCornerShape(22.dp))
                                    .clickable {
                                        // Reset or toggle all filters
                                        productViewModel.onPriceFilterSelected(null)
                                        productViewModel.onRatingFilterSelected(null)
                                        productViewModel.onBrandFilterSelected(null)
                                    }
                                    .testTag("filter_reset_btn")
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                                ) {
                                    Icon(
                                        imageVector = Icons.Filled.FilterList,
                                        contentDescription = "Filters",
                                        tint = OnEmeraldPrimaryContainer,
                                        modifier = Modifier.size(18.dp)
                                    )
                                    Text(
                                        text = "Filters",
                                        style = MaterialTheme.typography.bodyMedium,
                                        color = OnEmeraldPrimaryContainer,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        }
                    }
                }

                // Empty state check
                if (filteredProducts.isEmpty()) {
                    item {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 48.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Icon(
                                imageVector = Icons.Filled.Search,
                                contentDescription = null,
                                tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.4f),
                                modifier = Modifier.size(64.dp)
                            )
                            Spacer(modifier = Modifier.height(12.dp))
                            Text(
                                text = "No products found",
                                style = MaterialTheme.typography.titleMedium,
                                color = MaterialTheme.colorScheme.onSurface,
                                fontWeight = FontWeight.Bold
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "Try adjusting your filters or search keywords.",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                } else {
                    // Products Grid in 2 Columns
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

        // Floating Cart Bar (Contextual pop-up)
        FloatingCartBar(
            itemCount = totalCount,
            totalPriceFormatted = "${currency}${if (subtotal % 1.0 == 0.0) subtotal.toInt().toString() else String.format("%.2f", subtotal)}",
            onViewCart = onNavigateToCart,
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 16.dp)
        )
    }
}

@Composable
private fun FilterChip(
    label: String,
    hasDropdown: Boolean = false,
    isSelected: Boolean = false,
    onClick: () -> Unit,
    testTag: String
) {
    Surface(
        shape = RoundedCornerShape(22.dp),
        color = if (isSelected) EmeraldPrimaryContainer.copy(alpha = 0.15f) else MaterialTheme.colorScheme.surface,
        border = CardDefaults.outlinedCardBorder().copy(
            brush = androidx.compose.ui.graphics.SolidColor(
                if (isSelected) EmeraldPrimary else OutlineVariantColor
            )
        ),
        modifier = Modifier
            .clip(RoundedCornerShape(22.dp))
            .clickable(onClick = onClick)
            .testTag(testTag)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Text(
                text = label,
                style = MaterialTheme.typography.bodyMedium,
                color = if (isSelected) EmeraldPrimary else MaterialTheme.colorScheme.onSurfaceVariant,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
            )
            if (hasDropdown) {
                Icon(
                    imageVector = Icons.Filled.KeyboardArrowDown,
                    contentDescription = null,
                    tint = if (isSelected) EmeraldPrimary else MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.size(18.dp)
                )
            }
        }
    }
}
