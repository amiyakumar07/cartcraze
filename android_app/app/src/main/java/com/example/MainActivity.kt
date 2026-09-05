package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.AnimatedContentTransitionScope
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.data.repository.AppContainer
import com.example.ui.components.CartCrazeBottomBar
import com.example.ui.screens.AccountScreen
import com.example.ui.screens.AddressesScreen
import com.example.ui.screens.CartScreen
import com.example.ui.screens.CategoriesScreen
import com.example.ui.screens.CheckoutScreen
import com.example.ui.screens.HomeScreen
import com.example.ui.screens.OffersScreen
import com.example.ui.screens.OnboardingScreen
import com.example.ui.screens.OrderSuccessScreen
import com.example.ui.screens.OrderTrackingScreen
import com.example.ui.screens.OrdersListScreen
import com.example.ui.screens.ProductDetailScreen
import com.example.ui.screens.RoleSelectionScreen
import com.example.ui.screens.SearchScreen
import com.example.ui.screens.SplashScreen
import com.example.ui.screens.rider.RiderAppRoot
import com.example.ui.screens.shop.ShopAppRoot
import com.example.ui.theme.CartCrazeTheme
import com.example.ui.viewmodel.AddressViewModel
import com.example.ui.viewmodel.AuthViewModel
import com.example.ui.viewmodel.CartViewModel
import com.example.ui.viewmodel.LocationStoreViewModel
import com.example.ui.viewmodel.OrderViewModel
import com.example.ui.viewmodel.ProductViewModel
import com.example.ui.viewmodel.ViewModelFactory

class MainActivity : ComponentActivity() {

    private lateinit var appContainer: AppContainer

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        appContainer = AppContainer(this)
        enableEdgeToEdge()

        setContent {
            CartCrazeTheme {
                val viewModelFactory = remember {
                    ViewModelFactory(
                        productRepository = appContainer.productRepository,
                        cartRepository = appContainer.cartRepository,
                        addressRepository = appContainer.addressRepository,
                        orderRepository = appContainer.orderRepository,
                        locationIqService = appContainer.locationIqService,
                        supabaseService = appContainer.supabaseService,
                        firebaseAuthService = appContainer.firebaseAuthService,
                        razorpayService = appContainer.razorpayService
                    )
                }

                val cartViewModel: CartViewModel = viewModel(factory = viewModelFactory)
                val addressViewModel: AddressViewModel = viewModel(factory = viewModelFactory)
                val productViewModel: ProductViewModel = viewModel(factory = viewModelFactory)
                val orderViewModel: OrderViewModel = viewModel(factory = viewModelFactory)
                val authViewModel: AuthViewModel = viewModel(factory = viewModelFactory)
                val locationStoreViewModel: LocationStoreViewModel = viewModel(factory = viewModelFactory)

                val navController = rememberNavController()

                CartCrazeApp(
                    navController = navController,
                    cartViewModel = cartViewModel,
                    addressViewModel = addressViewModel,
                    productViewModel = productViewModel,
                    orderViewModel = orderViewModel,
                    authViewModel = authViewModel,
                    locationStoreViewModel = locationStoreViewModel
                )
            }
        }
    }
}

@Composable
fun CartCrazeApp(
    navController: NavHostController,
    cartViewModel: CartViewModel,
    addressViewModel: AddressViewModel,
    productViewModel: ProductViewModel,
    orderViewModel: OrderViewModel,
    authViewModel: AuthViewModel,
    locationStoreViewModel: LocationStoreViewModel
) {
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route ?: "splash"
    val cartItemCount by cartViewModel.itemCount.collectAsState()

    // Determine if bottom bar should be displayed (only for customer top-level screens)
    val customerTopLevelRoutes = listOf("home", "categories", "offers", "cart", "orders", "account")
    val isTopLevelDestination = currentRoute in customerTopLevelRoutes

    // Routes where we DON'T want the scaffold chrome
    val fullscreenRoutes = listOf("splash", "onboarding", "role_selection", "rider_app", "shop_app", "order_success")
    val isFullscreen = fullscreenRoutes.any { currentRoute.startsWith(it) }

    if (isFullscreen) {
        // Fullscreen navigation without scaffold
        NavHost(
            navController = navController,
            startDestination = "splash",
            modifier = Modifier.fillMaxSize()
        ) {
            // ==========================================
            // SPLASH SCREEN
            // ==========================================
            composable(
                "splash",
                enterTransition = { fadeIn(tween(300)) },
                exitTransition = { fadeOut(tween(300)) }
            ) {
                SplashScreen(
                    onSplashComplete = {
                        navController.navigate("onboarding") {
                            popUpTo("splash") { inclusive = true }
                        }
                    }
                )
            }

            // ==========================================
            // ONBOARDING SCREEN
            // ==========================================
            composable(
                "onboarding",
                enterTransition = { fadeIn(tween(400)) },
                exitTransition = { fadeOut(tween(300)) }
            ) {
                OnboardingScreen(
                    onGetStarted = {
                        navController.navigate("role_selection") {
                            popUpTo("onboarding") { inclusive = true }
                        }
                    }
                )
            }

            // ==========================================
            // ROLE SELECTION SCREEN
            // ==========================================
            composable(
                "role_selection",
                enterTransition = { fadeIn(tween(400)) },
                exitTransition = { fadeOut(tween(300)) }
            ) {
                RoleSelectionScreen(
                    onRoleSelected = { role ->
                        when (role) {
                            "customer" -> navController.navigate("home") {
                                popUpTo("role_selection") { inclusive = true }
                            }
                            "rider" -> navController.navigate("rider_app") {
                                popUpTo("role_selection") { inclusive = true }
                            }
                            "shop" -> navController.navigate("shop_app") {
                                popUpTo("role_selection") { inclusive = true }
                            }
                        }
                    }
                )
            }

            // ==========================================
            // RIDER APP (Self-contained with own bottom nav)
            // ==========================================
            composable(
                "rider_app",
                enterTransition = { fadeIn(tween(300)) }
            ) {
                RiderAppRoot(
                    onSwitchToCustomer = {
                        navController.navigate("role_selection") {
                            popUpTo(0) { inclusive = true }
                        }
                    }
                )
            }

            // ==========================================
            // SHOP APP (Self-contained with own bottom nav)
            // ==========================================
            composable(
                "shop_app",
                enterTransition = { fadeIn(tween(300)) }
            ) {
                ShopAppRoot(
                    onSwitchToCustomer = {
                        navController.navigate("role_selection") {
                            popUpTo(0) { inclusive = true }
                        }
                    }
                )
            }

            // ==========================================
            // ORDER SUCCESS SCREEN (Fullscreen)
            // ==========================================
            composable(
                route = "order_success/{orderId}/{total}/{eta}",
                arguments = listOf(
                    navArgument("orderId") { type = NavType.StringType },
                    navArgument("total") { type = NavType.StringType; defaultValue = "" },
                    navArgument("eta") { type = NavType.IntType; defaultValue = 10 }
                ),
                enterTransition = { fadeIn(tween(400)) }
            ) { backStackEntry ->
                val orderId = backStackEntry.arguments?.getString("orderId") ?: ""
                val total = backStackEntry.arguments?.getString("total") ?: ""
                val eta = backStackEntry.arguments?.getInt("eta") ?: 10
                OrderSuccessScreen(
                    orderId = orderId,
                    totalAmount = total,
                    etaMinutes = eta,
                    onTrackOrder = {
                        navController.navigate("order_tracking/$orderId") {
                            popUpTo("home")
                        }
                    },
                    onGoHome = {
                        navController.navigate("home") {
                            popUpTo("home") { inclusive = true }
                        }
                    }
                )
            }

            // ==========================================
            // ALL CUSTOMER ROUTES (Also added to fullscreen NavHost for consistency)
            // ==========================================
            addCustomerRoutes(
                navController = navController,
                cartViewModel = cartViewModel,
                addressViewModel = addressViewModel,
                productViewModel = productViewModel,
                orderViewModel = orderViewModel,
                authViewModel = authViewModel,
                locationStoreViewModel = locationStoreViewModel,
                cartItemCount = cartItemCount
            )
        }
    } else {
        // Customer app with scaffold (bottom navigation)
        Scaffold(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding(),
            bottomBar = {
                if (isTopLevelDestination) {
                    CartCrazeBottomBar(
                        currentRoute = currentRoute,
                        cartItemCount = cartItemCount,
                        onNavigate = { route ->
                            if (currentRoute != route) {
                                navController.navigate(route) {
                                    popUpTo("home") {
                                        saveState = true
                                    }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            }
                        }
                    )
                }
            }
        ) { innerPadding ->
            NavHost(
                navController = navController,
                startDestination = "splash",
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
            ) {
                addCustomerRoutes(
                    navController = navController,
                    cartViewModel = cartViewModel,
                    addressViewModel = addressViewModel,
                    productViewModel = productViewModel,
                    orderViewModel = orderViewModel,
                    authViewModel = authViewModel,
                    locationStoreViewModel = locationStoreViewModel,
                    cartItemCount = cartItemCount
                )
            }
        }
    }
}

/**
 * Adds all customer-facing routes to a NavHost builder
 */
private fun androidx.navigation.NavGraphBuilder.addCustomerRoutes(
    navController: NavHostController,
    cartViewModel: CartViewModel,
    addressViewModel: AddressViewModel,
    productViewModel: ProductViewModel,
    orderViewModel: OrderViewModel,
    authViewModel: AuthViewModel,
    locationStoreViewModel: LocationStoreViewModel,
    cartItemCount: Int
) {
    composable("home") {
        HomeScreen(
            cartViewModel = cartViewModel,
            addressViewModel = addressViewModel,
            productViewModel = productViewModel,
            locationViewModel = locationStoreViewModel,
            authViewModel = authViewModel,
            onNavigateToProduct = { productId ->
                navController.navigate("product_detail/$productId")
            },
            onNavigateToSearch = { query ->
                val target = if (query.isNotBlank()) "search/$query" else "search/Milk"
                navController.navigate(target)
            },
            onNavigateToAddresses = {
                navController.navigate("addresses")
            },
            onNavigateToCart = {
                navController.navigate("cart")
            },
            onNavigateToCategories = {
                navController.navigate("categories")
            }
        )
    }

    composable("categories") {
        CategoriesScreen(
            productViewModel = productViewModel,
            cartViewModel = cartViewModel,
            onNavigateToProduct = { productId ->
                navController.navigate("product_detail/$productId")
            }
        )
    }

    composable("offers") {
        OffersScreen(
            productViewModel = productViewModel,
            cartViewModel = cartViewModel,
            onNavigateToProduct = { productId ->
                navController.navigate("product_detail/$productId")
            },
            onNavigateToCart = {
                navController.navigate("cart")
            }
        )
    }

    composable("cart") {
        CartScreen(
            cartViewModel = cartViewModel,
            addressViewModel = addressViewModel,
            onNavigateToCheckout = {
                navController.navigate("checkout")
            },
            onNavigateToProduct = { productId ->
                navController.navigate("product_detail/$productId")
            },
            onNavigateToHome = {
                navController.navigate("home")
            }
        )
    }

    composable("orders") {
        OrdersListScreen(
            orderViewModel = orderViewModel,
            onTrackOrder = { orderId ->
                navController.navigate("order_tracking/$orderId")
            }
        )
    }

    composable("account") {
        AccountScreen(
            addressViewModel = addressViewModel,
            authViewModel = authViewModel,
            onNavigateToAddresses = {
                navController.navigate("addresses")
            },
            onNavigateToOrders = {
                navController.navigate("orders")
            }
        )
    }

    composable(
        route = "product_detail/{productId}",
        arguments = listOf(navArgument("productId") { type = NavType.StringType })
    ) { backStackEntry ->
        val productId = backStackEntry.arguments?.getString("productId") ?: ""
        ProductDetailScreen(
            productId = productId,
            cartViewModel = cartViewModel,
            productViewModel = productViewModel,
            onBack = { navController.popBackStack() },
            onNavigateToProduct = { newProductId ->
                navController.navigate("product_detail/$newProductId")
            }
        )
    }

    composable(
        route = "search/{query}",
        arguments = listOf(navArgument("query") { type = NavType.StringType; defaultValue = "Milk" })
    ) { backStackEntry ->
        val query = backStackEntry.arguments?.getString("query") ?: "Milk"
        SearchScreen(
            initialQuery = query,
            cartViewModel = cartViewModel,
            productViewModel = productViewModel,
            onBack = { navController.popBackStack() },
            onNavigateToProduct = { productId ->
                navController.navigate("product_detail/$productId")
            },
            onNavigateToCart = {
                navController.navigate("cart")
            }
        )
    }

    composable("addresses") {
        AddressesScreen(
            addressViewModel = addressViewModel,
            onBack = { navController.popBackStack() }
        )
    }

    composable("checkout") {
        CheckoutScreen(
            cartViewModel = cartViewModel,
            addressViewModel = addressViewModel,
            orderViewModel = orderViewModel,
            onBack = { navController.popBackStack() },
            onChangeAddress = { navController.navigate("addresses") },
            onOrderPlaced = { order ->
                val totalStr = order.total.toString()
                val eta = order.etaMinutes
                navController.navigate("order_success/${order.orderId}/$totalStr/$eta") {
                    popUpTo("home")
                }
            }
        )
    }

    composable(
        route = "order_tracking/{orderId}",
        arguments = listOf(navArgument("orderId") { type = NavType.StringType })
    ) { backStackEntry ->
        val orderId = backStackEntry.arguments?.getString("orderId") ?: ""
        OrderTrackingScreen(
            orderId = orderId,
            orderViewModel = orderViewModel,
            onClose = {
                navController.navigate("home") {
                    popUpTo("home") { inclusive = true }
                }
            }
        )
    }
}
