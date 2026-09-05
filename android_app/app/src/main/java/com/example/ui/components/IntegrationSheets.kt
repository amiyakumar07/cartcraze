package com.example.ui.components

import android.Manifest
import android.widget.Toast
import kotlinx.coroutines.launch
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
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
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountBalance
import androidx.compose.material.icons.filled.AccountBalanceWallet
import androidx.compose.material.icons.filled.Bolt
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.CreditCard
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.MyLocation
import androidx.compose.material.icons.filled.NearMe
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.QrCodeScanner
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Store
import androidx.compose.material.icons.filled.Storefront
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.remote.UserProfile
import com.example.data.remote.LocationSearchResult
import com.example.data.remote.RazorpayOrder
import com.example.ui.theme.AmberTertiary
import com.example.ui.theme.AmberTertiaryContainer
import com.example.ui.theme.EmeraldPrimary
import com.example.ui.theme.EmeraldPrimaryContainer
import com.example.ui.theme.OnEmeraldPrimaryContainer
import com.example.ui.theme.OutlineColor
import com.example.ui.theme.OutlineVariantColor
import com.example.ui.theme.SurfaceContainerHighest
import com.example.ui.theme.SurfaceContainerLow
import com.example.ui.theme.SurfaceContainerLowest
import com.example.ui.viewmodel.AddressViewModel
import com.example.ui.viewmodel.AuthViewModel
import com.example.ui.viewmodel.LocationStoreViewModel
import com.example.util.DeviceLocationHelper
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

/**
 * Razorpay Checkout Gateway BottomSheet Dialog
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RazorpayCheckoutSheet(
    amount: Double,
    currency: String = "₹",
    onDismiss: () -> Unit,
    onPaymentSuccess: (method: String, paymentId: String) -> Unit
) {
    val order = remember(amount) {
        RazorpayOrder(
            id = "order_${System.currentTimeMillis().toString().takeLast(10)}",
            amountInPaise = (amount * 100).toLong(),
            amountInRupees = amount,
            currency = if (currency == "₹") "INR" else currency,
            receiptId = "rcpt_${System.currentTimeMillis() % 10000}",
            keyId = "rzp_test_CartCrazePayKey"
        )
    }
    RazorpayCheckoutSheet(
        razorpayOrder = order,
        onDismiss = onDismiss,
        onPaymentSuccess = onPaymentSuccess
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RazorpayCheckoutSheet(
    razorpayOrder: RazorpayOrder,
    onDismiss: () -> Unit,
    onPaymentSuccess: (method: String, paymentId: String) -> Unit
) {
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    var selectedMethod by remember { mutableStateOf("Google Pay UPI") }
    var upiIdInput by remember { mutableStateOf("") }
    var cardNumberInput by remember { mutableStateOf("") }
    var cardExpiryInput by remember { mutableStateOf("") }
    var cardCvvInput by remember { mutableStateOf("") }
    var isProcessing by remember { mutableStateOf(false) }
    var paymentStep by remember { mutableStateOf(1) } // 1 = select, 2 = processing, 3 = success

    val coroutineScope = rememberCoroutineScope()

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
        containerColor = SurfaceContainerLowest,
        shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp)
                .padding(bottom = 32.dp)
                .testTag("razorpay_checkout_sheet"),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Razorpay Header Bar
            Surface(
                modifier = Modifier.fillMaxWidth(),
                color = Color(0xFF0C2340), // Razorpay navy brand color
                shape = RoundedCornerShape(16.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            Text(
                                text = "RAZORPAY",
                                color = Color(0xFF528FF0),
                                fontWeight = FontWeight.Black,
                                fontSize = 16.sp,
                                letterSpacing = 1.sp
                            )
                            Surface(
                                shape = RoundedCornerShape(4.dp),
                                color = Color(0xFF02A95C)
                            ) {
                                Text(
                                    text = "SECURE",
                                    color = Color.White,
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 4.dp, vertical = 2.dp)
                                )
                            }
                        }
                        Text(
                            text = "CartCraze Quick Commerce",
                            color = Color.White.copy(alpha = 0.8f),
                            fontSize = 12.sp
                        )
                    }

                    Column(horizontalAlignment = Alignment.End) {
                        Text(
                            text = "Amount to Pay",
                            color = Color.White.copy(alpha = 0.7f),
                            fontSize = 11.sp
                        )
                        Text(
                            text = "₹${String.format("%.2f", razorpayOrder.amountInRupees)}",
                            color = Color.White,
                            fontWeight = FontWeight.ExtraBold,
                            fontSize = 18.sp
                        )
                    }
                }
            }

            if (paymentStep == 1) {
                Text(
                    text = "Select Razorpay Payment Method",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )

                // 1. UPI Options
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    color = SurfaceContainerLow,
                    border = androidx.compose.foundation.BorderStroke(1.dp, OutlineVariantColor.copy(alpha = 0.5f))
                ) {
                    Column(modifier = Modifier.padding(8.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text(
                            text = "UPI (Instant)",
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold,
                            color = EmeraldPrimary,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )

                        RazorpayInstrumentRow(
                            name = "Google Pay UPI",
                            desc = "Fast 1-tap UPI app payment",
                            icon = Icons.Filled.QrCodeScanner,
                            isSelected = selectedMethod == "Google Pay UPI",
                            onClick = { selectedMethod = "Google Pay UPI" }
                        )

                        RazorpayInstrumentRow(
                            name = "PhonePe UPI",
                            desc = "Pay via PhonePe UPI",
                            icon = Icons.Filled.QrCodeScanner,
                            isSelected = selectedMethod == "PhonePe UPI",
                            onClick = { selectedMethod = "PhonePe UPI" }
                        )

                        RazorpayInstrumentRow(
                            name = "Pay with UPI ID / VPA",
                            desc = "Enter VPA (e.g. mobile@upi)",
                            icon = Icons.Filled.AccountBalanceWallet,
                            isSelected = selectedMethod == "Custom UPI ID",
                            onClick = { selectedMethod = "Custom UPI ID" }
                        )

                        if (selectedMethod == "Custom UPI ID") {
                            OutlinedTextField(
                                value = upiIdInput,
                                onValueChange = { upiIdInput = it },
                                label = { Text("Enter UPI ID (e.g. yourname@oksbi)") },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 8.dp, vertical = 4.dp),
                                singleLine = true,
                                shape = RoundedCornerShape(10.dp)
                            )
                        }
                    }
                }

                // 2. Cards & Net Banking
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    color = SurfaceContainerLow,
                    border = androidx.compose.foundation.BorderStroke(1.dp, OutlineVariantColor.copy(alpha = 0.5f))
                ) {
                    Column(modifier = Modifier.padding(8.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text(
                            text = "Cards & NetBanking",
                            style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )

                        RazorpayInstrumentRow(
                            name = "Credit / Debit Card",
                            desc = "Visa, MasterCard, RuPay",
                            icon = Icons.Filled.CreditCard,
                            isSelected = selectedMethod == "Cards",
                            onClick = { selectedMethod = "Cards" }
                        )

                        if (selectedMethod == "Cards") {
                            Column(modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                OutlinedTextField(
                                    value = cardNumberInput,
                                    onValueChange = { if (it.length <= 19) cardNumberInput = it },
                                    label = { Text("Card Number (16-digits)") },
                                    placeholder = { Text("4321 •••• •••• 9876") },
                                    modifier = Modifier.fillMaxWidth(),
                                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                    singleLine = true,
                                    shape = RoundedCornerShape(8.dp)
                                )
                                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                    OutlinedTextField(
                                        value = cardExpiryInput,
                                        onValueChange = { cardExpiryInput = it },
                                        label = { Text("MM/YY") },
                                        modifier = Modifier.weight(1f),
                                        singleLine = true,
                                        shape = RoundedCornerShape(8.dp)
                                    )
                                    OutlinedTextField(
                                        value = cardCvvInput,
                                        onValueChange = { if (it.length <= 4) cardCvvInput = it },
                                        label = { Text("CVV") },
                                        modifier = Modifier.weight(1f),
                                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.NumberPassword),
                                        visualTransformation = PasswordVisualTransformation(),
                                        singleLine = true,
                                        shape = RoundedCornerShape(8.dp)
                                    )
                                }
                            }
                        }

                        RazorpayInstrumentRow(
                            name = "Net Banking",
                            desc = "HDFC, ICICI, SBI, Axis & all banks",
                            icon = Icons.Filled.AccountBalance,
                            isSelected = selectedMethod == "Net Banking",
                            onClick = { selectedMethod = "Net Banking" }
                        )
                    }
                }

                // Pay Button
                Button(
                    onClick = {
                        isProcessing = true
                        paymentStep = 2
                        coroutineScope.launch {
                            delay(1600) // Razorpay network confirmation simulation
                            paymentStep = 3
                            delay(800)
                            onPaymentSuccess(selectedMethod, "pay_${System.currentTimeMillis() % 1000000}")
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp)
                        .testTag("razorpay_confirm_pay_btn"),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFF0C2340),
                        contentColor = Color.White
                    ),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Filled.Security,
                            contentDescription = null,
                            tint = Color(0xFF528FF0),
                            modifier = Modifier.size(18.dp)
                        )
                        Text(
                            text = "Pay ₹${String.format("%.2f", razorpayOrder.amountInRupees)} via Razorpay",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            } else if (paymentStep == 2) {
                // Processing Step
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 32.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    CircularProgressIndicator(
                        color = Color(0xFF528FF0),
                        strokeWidth = 4.dp,
                        modifier = Modifier.size(54.dp)
                    )
                    Text(
                        text = "Contacting Razorpay Gateway...",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "Authenticating with $selectedMethod. Please do not press back or refresh.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        textAlign = androidx.compose.ui.text.style.TextAlign.Center
                    )
                }
            } else {
                // Success Step
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(64.dp)
                            .background(EmeraldPrimaryContainer, CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Filled.CheckCircle,
                            contentDescription = "Success",
                            tint = EmeraldPrimary,
                            modifier = Modifier.size(38.dp)
                        )
                    }
                    Text(
                        text = "Payment Verified & Received!",
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold,
                        color = EmeraldPrimary
                    )
                    Text(
                        text = "Razorpay Transaction ID: pay_${razorpayOrder.id.takeLast(8)}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
    }
}

@Composable
private fun RazorpayInstrumentRow(
    name: String,
    desc: String,
    icon: ImageVector,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(10.dp))
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(10.dp),
        color = if (isSelected) EmeraldPrimaryContainer.copy(alpha = 0.2f) else SurfaceContainerLowest,
        border = androidx.compose.foundation.BorderStroke(
            1.dp,
            if (isSelected) EmeraldPrimary else OutlineVariantColor.copy(alpha = 0.3f)
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = if (isSelected) EmeraldPrimary else MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.size(22.dp)
            )

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = name,
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = desc,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            if (isSelected) {
                Icon(
                    imageVector = Icons.Filled.CheckCircle,
                    contentDescription = "Selected",
                    tint = EmeraldPrimary,
                    modifier = Modifier.size(20.dp)
                )
            }
        }
    }
}

/**
 * LocationIQ Store Availability & Address Conforming BottomSheet with Live GPS integration
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LocationStoreAvailabilitySheet(
    locationViewModel: LocationStoreViewModel,
    addressViewModel: AddressViewModel? = null,
    onDismiss: () -> Unit,
    onAddressSelected: (String) -> Unit = {}
) {
    val context = LocalContext.current
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val availability by locationViewModel.storeAvailability.collectAsState()
    val searchResults by locationViewModel.searchResults.collectAsState()
    val isSearching by locationViewModel.isSearching.collectAsState()
    val lastDetected by locationViewModel.lastDetectedLocation.collectAsState()
    val darkStores = locationViewModel.darkStores

    var searchQuery by remember { mutableStateOf("") }
    var isLocatingGps by remember { mutableStateOf(false) }
    var locationStatusMessage by remember { mutableStateOf<String?>(null) }

    val coroutineScope = rememberCoroutineScope()

    // GPS runtime permission launcher
    val locationPermissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val fineGranted = permissions[Manifest.permission.ACCESS_FINE_LOCATION] == true
        val coarseGranted = permissions[Manifest.permission.ACCESS_COARSE_LOCATION] == true

        if (fineGranted || coarseGranted) {
            isLocatingGps = true
            locationStatusMessage = "Detecting device GPS coordinates..."
            DeviceLocationHelper.fetchCurrentCoordinates(context) { lat, lon, isAccurate ->
                coroutineScope.launch {
                    locationViewModel.useCurrentLocation(lat, lon) { resolvedLoc ->
                        isLocatingGps = false
                        locationStatusMessage = if (isAccurate) "GPS Location detected successfully!" else "Location hub detected"
                        addressViewModel?.setAddressFromLocationResult(resolvedLoc)
                        onAddressSelected(resolvedLoc.displayName)
                        Toast.makeText(context, "Location set to: ${resolvedLoc.suburb.ifBlank { resolvedLoc.city }}", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        } else {
            isLocatingGps = false
            locationStatusMessage = "Location permission denied. You can select your area manually below."
            Toast.makeText(context, "Location permission denied. Please select your area manually.", Toast.LENGTH_LONG).show()
        }
    }

    val popularLocalities = listOf(
        LocationSearchResult("p1", "Patia, KIIT Square, Bhubaneswar, Odisha 751024", 20.3535, 85.8180, "KIIT Road", "Patia", "Bhubaneswar", "751024"),
        LocationSearchResult("p2", "Jaydev Vihar Square, Bhubaneswar, Odisha 751015", 20.3015, 85.8240, "Nandankanan Road", "Jaydev Vihar", "Bhubaneswar", "751015"),
        LocationSearchResult("p3", "Saheed Nagar, Janpath, Bhubaneswar, Odisha 751007", 20.2890, 85.8430, "Janpath Road", "Saheed Nagar", "Bhubaneswar", "751007"),
        LocationSearchResult("p4", "Damana Square, Chandrasekharpur, Bhubaneswar, 751016", 20.3280, 85.8195, "Damana Road", "Chandrasekharpur", "Bhubaneswar", "751016"),
        LocationSearchResult("p5", "Koramangala 4th Block, Bengaluru, Karnataka 560034", 12.9352, 77.6245, "100 Feet Road", "Koramangala", "Bengaluru", "560034"),
        LocationSearchResult("p6", "Indiranagar 100ft Road, Bengaluru, 560038", 12.9784, 77.6408, "100ft Road", "Indiranagar", "Bengaluru", "560038"),
        LocationSearchResult("p7", "Andheri West, Lokhandwala, Mumbai, Maharashtra 400053", 19.1363, 72.8277, "Link Road", "Andheri West", "Mumbai", "400053"),
        LocationSearchResult("p8", "Connaught Place, Inner Circle, New Delhi 110001", 28.6315, 77.2167, "Inner Circle", "Connaught Place", "New Delhi", "110001")
    )

    fun triggerGpsDetection() {
        if (DeviceLocationHelper.hasLocationPermission(context)) {
            isLocatingGps = true
            locationStatusMessage = "Detecting current GPS coordinates & querying LocationIQ..."
            DeviceLocationHelper.fetchCurrentCoordinates(context) { lat, lon, isAccurate ->
                coroutineScope.launch {
                    locationViewModel.useCurrentLocation(lat, lon) { resolvedLoc ->
                        isLocatingGps = false
                        locationStatusMessage = if (isAccurate) "GPS coordinates resolved: ${resolvedLoc.suburb}" else "Location detected"
                        addressViewModel?.setAddressFromLocationResult(resolvedLoc)
                        onAddressSelected(resolvedLoc.displayName)
                        Toast.makeText(context, "Location set: ${resolvedLoc.displayName.take(35)}...", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        } else {
            locationPermissionLauncher.launch(
                arrayOf(
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_COARSE_LOCATION
                )
            )
        }
    }

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
        containerColor = SurfaceContainerLowest,
        shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp)
                .padding(bottom = 32.dp)
                .testTag("location_store_sheet"),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Icon(
                        imageVector = Icons.Filled.Storefront,
                        contentDescription = null,
                        tint = EmeraldPrimary,
                        modifier = Modifier.size(24.dp)
                    )
                    Text(
                        text = "Choose Delivery Location",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )
                }

                IconButton(onClick = onDismiss) {
                    Icon(Icons.Filled.Close, contentDescription = "Close")
                }
            }

            // LocationIQ Geocoding Search Bar
            OutlinedTextField(
                value = searchQuery,
                onValueChange = {
                    searchQuery = it
                    locationViewModel.searchLocation(it)
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("locationiq_search_input"),
                placeholder = { Text("Search area, locality or pincode (e.g. Patia)") },
                leadingIcon = {
                    Icon(Icons.Filled.Search, contentDescription = "Search", tint = EmeraldPrimary)
                },
                trailingIcon = {
                    if (isSearching) {
                        CircularProgressIndicator(modifier = Modifier.size(18.dp), strokeWidth = 2.dp)
                    }
                },
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = EmeraldPrimary,
                    unfocusedBorderColor = OutlineVariantColor
                ),
                singleLine = true
            )

            // Primary 1-Tap Button to Use Current GPS Location
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(14.dp))
                    .clickable(enabled = !isLocatingGps) {
                        triggerGpsDetection()
                    }
                    .testTag("use_gps_location_button"),
                color = EmeraldPrimaryContainer.copy(alpha = 0.35f),
                shape = RoundedCornerShape(14.dp),
                border = androidx.compose.foundation.BorderStroke(1.5.dp, EmeraldPrimary)
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    if (isLocatingGps) {
                        CircularProgressIndicator(
                            color = EmeraldPrimary,
                            strokeWidth = 3.dp,
                            modifier = Modifier.size(24.dp)
                        )
                    } else {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .background(EmeraldPrimary, CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Filled.MyLocation,
                                contentDescription = "Current Location GPS",
                                tint = Color.White,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }

                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = if (isLocatingGps) "Fetching GPS Coordinates..." else "Use Current GPS Location",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = EmeraldPrimary
                        )
                        Text(
                            text = if (isLocatingGps) "Connecting to LocationIQ Geocoding API..." else "Auto-detect address & nearest 8-10 min dark store",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }

                    Icon(
                        imageVector = Icons.Filled.NearMe,
                        contentDescription = null,
                        tint = EmeraldPrimary,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }

            // Quick City & Popular Localities Chips
            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Text(
                    text = "Popular Express Hubs",
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    contentPadding = PaddingValues(vertical = 4.dp)
                ) {
                    items(popularLocalities) { loc ->
                        Surface(
                            modifier = Modifier
                                .clip(RoundedCornerShape(20.dp))
                                .clickable {
                                    locationViewModel.confirmAddressAndCheckStore(loc)
                                    addressViewModel?.setAddressFromLocationResult(loc)
                                    onAddressSelected(loc.displayName)
                                    Toast.makeText(context, "Location set to: ${loc.suburb.ifBlank { loc.displayName }}", Toast.LENGTH_SHORT).show()
                                },
                            shape = RoundedCornerShape(20.dp),
                            color = if (lastDetected?.placeId == loc.placeId) EmeraldPrimaryContainer else SurfaceContainerLow,
                            border = androidx.compose.foundation.BorderStroke(
                                1.dp,
                                if (lastDetected?.placeId == loc.placeId) EmeraldPrimary else OutlineVariantColor.copy(alpha = 0.5f)
                            )
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Filled.LocationOn,
                                    contentDescription = null,
                                    tint = if (lastDetected?.placeId == loc.placeId) EmeraldPrimary else MaterialTheme.colorScheme.onSurfaceVariant,
                                    modifier = Modifier.size(14.dp)
                                )
                                Text(
                                    text = "${loc.suburb} (${loc.city})",
                                    style = MaterialTheme.typography.labelMedium,
                                    fontWeight = FontWeight.SemiBold,
                                    color = if (lastDetected?.placeId == loc.placeId) OnEmeraldPrimaryContainer else MaterialTheme.colorScheme.onSurface
                                )
                            }
                        }
                    }
                }
            }

            // Search results list if searching
            if (searchResults.isNotEmpty()) {
                Text(
                    text = "LocationIQ Search Results",
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                LazyColumn(
                    modifier = Modifier
                        .fillMaxWidth()
                        .heightIn(max = 160.dp),
                    verticalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    items(searchResults) { loc ->
                        Surface(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(8.dp))
                                .clickable {
                                    locationViewModel.confirmAddressAndCheckStore(loc)
                                    addressViewModel?.setAddressFromLocationResult(loc)
                                    onAddressSelected(loc.displayName)
                                    Toast.makeText(context, "Location set to: ${loc.displayName}", Toast.LENGTH_SHORT).show()
                                },
                            color = SurfaceContainerLow,
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Row(
                                modifier = Modifier.padding(10.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Filled.Store,
                                    contentDescription = null,
                                    tint = EmeraldPrimary,
                                    modifier = Modifier.size(16.dp)
                                )
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = loc.displayName,
                                        style = MaterialTheme.typography.bodySmall,
                                        fontWeight = FontWeight.Bold,
                                        maxLines = 1,
                                        overflow = TextOverflow.Ellipsis
                                    )
                                    Text(
                                        text = "${loc.suburb}, ${loc.city} - ${loc.postcode}",
                                        style = MaterialTheme.typography.labelSmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // Current Dark Store Status Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = if (availability.isAvailable) EmeraldPrimaryContainer.copy(alpha = 0.2f) else AmberTertiaryContainer.copy(alpha = 0.2f)
                ),
                border = CardDefaults.outlinedCardBorder().copy(
                    brush = androidx.compose.ui.graphics.SolidColor(
                        if (availability.isAvailable) EmeraldPrimary else AmberTertiary
                    )
                )
            ) {
                Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            Icon(
                                imageVector = if (availability.isAvailable) Icons.Filled.Bolt else Icons.Filled.Store,
                                contentDescription = null,
                                tint = if (availability.isAvailable) EmeraldPrimary else AmberTertiary
                            )
                            Text(
                                text = availability.nearestStore?.name ?: "Patia DarkStore Hub #3",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold
                            )
                        }

                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = if (availability.isAvailable) EmeraldPrimary else AmberTertiary
                        ) {
                            Text(
                                text = if (availability.isAvailable) "ONLINE • 8 MINS" else "AVAILABLE",
                                color = Color.White,
                                style = MaterialTheme.typography.labelSmall,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                            )
                        }
                    }

                    Text(
                        text = availability.statusMessage,
                        style = MaterialTheme.typography.bodySmall,
                        fontWeight = FontWeight.Medium
                    )

                    Text(
                        text = "Warehouse Hub: ${availability.nearestStore?.address ?: "Patia, Bhubaneswar"}",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            // Network hubs count
            Text(
                text = "📍 Active CartCraze Dark Stores in Bhubaneswar: ${darkStores.size} Hubs active",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Button(
                onClick = onDismiss,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = EmeraldPrimary,
                    contentColor = Color.White
                ),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text("Confirm Location & Shop", fontWeight = FontWeight.Bold)
            }
        }
    }
}

/**
 * Firebase Authentication Bottom Sheet (Login / Sign Up / OTP)
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AuthBottomSheet(
    authViewModel: AuthViewModel,
    onDismiss: () -> Unit
) {
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val currentUser by authViewModel.currentUser.collectAsState()
    val isLoading by authViewModel.isLoading.collectAsState()
    val authError by authViewModel.authError.collectAsState()

    var isSignUpMode by remember { mutableStateOf(false) }
    var isPhoneOtpMode by remember { mutableStateOf(false) }
    var emailInput by remember { mutableStateOf("") }
    var passwordInput by remember { mutableStateOf("") }
    var nameInput by remember { mutableStateOf("") }
    var phoneInput by remember { mutableStateOf("") }
    var otpInput by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
        containerColor = SurfaceContainerLowest,
        shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp)
                .padding(bottom = 32.dp)
                .testTag("firebase_auth_sheet"),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = if (currentUser != null && !currentUser!!.isGuest) "My Account" else if (isPhoneOtpMode) "Phone Verification" else if (isSignUpMode) "Create Account" else "Welcome to CartCraze",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "Sign in to unlock exclusive coupons & 8-min delivery",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }

                IconButton(onClick = onDismiss) {
                    Icon(Icons.Filled.Close, contentDescription = "Close")
                }
            }

            if (authError != null) {
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(8.dp),
                    color = Color(0xFFFFEBEE)
                ) {
                    Text(
                        text = authError ?: "",
                        color = Color(0xFFC62828),
                        style = MaterialTheme.typography.bodySmall,
                        modifier = Modifier.padding(10.dp)
                    )
                }
            }

            if (currentUser != null && !currentUser!!.isGuest) {
                // Logged In Profile View
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = SurfaceContainerLow)
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(50.dp)
                                .background(EmeraldPrimaryContainer, CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Filled.Person, contentDescription = null, tint = OnEmeraldPrimaryContainer)
                        }
                        Column(modifier = Modifier.weight(1f)) {
                            Text(currentUser!!.name, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                            Text(currentUser!!.email, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            Text(currentUser!!.phone, style = MaterialTheme.typography.labelSmall, color = EmeraldPrimary)
                        }
                    }
                }

                Button(
                    onClick = {
                        authViewModel.signOut()
                    },
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFFFFEBEE),
                        contentColor = Color(0xFFC62828)
                    ),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Log Out of Firebase Auth", fontWeight = FontWeight.Bold)
                }
            } else if (isPhoneOtpMode) {
                // Phone OTP Flow
                OutlinedTextField(
                    value = phoneInput,
                    onValueChange = { phoneInput = it },
                    label = { Text("Phone Number") },
                    placeholder = { Text("+91 98765 43210") },
                    leadingIcon = { Icon(Icons.Filled.Phone, contentDescription = null) },
                    modifier = Modifier.fillMaxWidth(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp)
                )

                OutlinedTextField(
                    value = otpInput,
                    onValueChange = { if (it.length <= 6) otpInput = it },
                    label = { Text("Enter 6-Digit OTP") },
                    placeholder = { Text("123456") },
                    leadingIcon = { Icon(Icons.Filled.Lock, contentDescription = null) },
                    modifier = Modifier.fillMaxWidth(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp)
                )

                Button(
                    onClick = {
                        authViewModel.verifyPhoneOtp(phoneInput.ifBlank { "+91 98765 43210" }, otpInput.ifBlank { "123456" }) {
                            onDismiss()
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = EmeraldPrimary),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    if (isLoading) {
                        CircularProgressIndicator(color = Color.White, modifier = Modifier.size(20.dp), strokeWidth = 2.dp)
                    } else {
                        Text("Verify & Login", fontWeight = FontWeight.Bold)
                    }
                }

                TextButton(onClick = { isPhoneOtpMode = false }) {
                    Text("← Back to Email Sign In", color = EmeraldPrimary)
                }
            } else {
                // Email/Password Login or Register Flow
                if (isSignUpMode) {
                    OutlinedTextField(
                        value = nameInput,
                        onValueChange = { nameInput = it },
                        label = { Text("Full Name") },
                        leadingIcon = { Icon(Icons.Filled.Person, contentDescription = null) },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp)
                    )
                }

                OutlinedTextField(
                    value = emailInput,
                    onValueChange = { emailInput = it },
                    label = { Text("Email Address") },
                    placeholder = { Text("alex@example.com") },
                    leadingIcon = { Icon(Icons.Filled.Email, contentDescription = null) },
                    modifier = Modifier.fillMaxWidth(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp)
                )

                OutlinedTextField(
                    value = passwordInput,
                    onValueChange = { passwordInput = it },
                    label = { Text("Password") },
                    leadingIcon = { Icon(Icons.Filled.Lock, contentDescription = null) },
                    trailingIcon = {
                        IconButton(onClick = { passwordVisible = !passwordVisible }) {
                            Icon(
                                imageVector = if (passwordVisible) Icons.Filled.VisibilityOff else Icons.Filled.Visibility,
                                contentDescription = null
                            )
                        }
                    },
                    visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                    modifier = Modifier.fillMaxWidth(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp)
                )

                Button(
                    onClick = {
                        if (isSignUpMode) {
                            authViewModel.signUpWithEmail(
                                name = nameInput.ifBlank { "Alex Mercer" },
                                email = emailInput.ifBlank { "alex.mercer@cartcraze.com" },
                                pass = passwordInput.ifBlank { "password123" },
                                phone = phoneInput.ifBlank { "+91 98765 43210" }
                            ) {
                                onDismiss()
                            }
                        } else {
                            authViewModel.signInWithEmail(
                                email = emailInput.ifBlank { "alex.mercer@cartcraze.com" },
                                pass = passwordInput.ifBlank { "password123" }
                            ) {
                                onDismiss()
                            }
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                        .testTag("firebase_auth_submit_btn"),
                    colors = ButtonDefaults.buttonColors(containerColor = EmeraldPrimary),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    if (isLoading) {
                        CircularProgressIndicator(color = Color.White, modifier = Modifier.size(20.dp), strokeWidth = 2.dp)
                    } else {
                        Text(if (isSignUpMode) "Create Account" else "Sign In with Firebase", fontWeight = FontWeight.Bold)
                    }
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    TextButton(onClick = { isPhoneOtpMode = true }) {
                        Text("📱 Sign in with Phone OTP", color = EmeraldPrimary, style = MaterialTheme.typography.bodySmall)
                    }

                    TextButton(onClick = { isSignUpMode = !isSignUpMode }) {
                        Text(if (isSignUpMode) "Already have account? Login" else "New here? Register", color = EmeraldPrimary, style = MaterialTheme.typography.bodySmall)
                    }
                }
            }
        }
    }
}
