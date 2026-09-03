package com.example.data

import com.example.data.model.Address
import com.example.data.model.Category
import com.example.data.model.Product

object SampleData {

    val categories = listOf(
        Category(
            id = "cat_fruits",
            name = "Fruits",
            imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuC9tGfX-AoJttrTllKabR1w9QjDVw1HYWmqPdWlerE5TtaYL-py-uACNbdM1SD6X_P9VJCOhcRedb_X7hV3YmpppB7M1_0Pj2eIET7QPV88dw3ijCyvFo2JYg1kFASodenZ3_FxYTBzo5AY2FM0gbBTVH14-aPQx4xjFUpf-Tl18UoNnHP2AKefdKFyLb8SPrw7rTZkHtIa0FFsw1MHqvOve2g8CToH7Yk6t7CbsmfokjmpGTexLa6v",
            itemCount = 38
        ),
        Category(
            id = "cat_dairy",
            name = "Dairy",
            imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBy9xRYhXcLeon3GDxHcZ2BIFWf6nN-rZwORoccjzi9MZhl-XxF08_9_Ss0umqDMU4f_M5xUApWiji7tu4XaRqFWoNToi5xMngBXeOVm6B6fwxKAwzeh6kDdyDJOimrt8J10N_yo7JtjWDSMQFoqcSdHH67fNwvSUI0cYAAR9L03qsbOOHNTOO7WXt1__KhvZTVFrTKfnCm9UzmyrRjLrhipzuc2cRgDxx0DL9_S5z7AAtINMKVO8I9",
            itemCount = 42
        ),
        Category(
            id = "cat_snacks",
            name = "Snacks",
            imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBWY9PALk8Qh66wqPpTzFuqv65A4ZDgv3oVtcD35aDzfsVVEbayh2njT3BruIBa1HMVr0uPdeTSmH-Jflx9yOTQy89PjuWPy1nGP2nOjg0SPKApg_pslfYnmzu8kQJJMsnh_jqzSfV6H90o9_KuUrs7ruDyJppyJiJjz1ubtM81LYvFlwNoc2sGomE2y6fBPN9e-wFGSRmauij-xf_Aoo7-WuhmryjhNrg0P53gKw9f2UFhK4x58MPg",
            itemCount = 56
        ),
        Category(
            id = "cat_bakery",
            name = "Bakery",
            imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDG3w6C0KVn5vQ60muqi-GenrYXvdvnTO8LEU02hunACEv4aEhe5LfM1gHjkaNHxZ_O8_tmjMHo2_TxPX6WGcJSpDQCdmccPDHWQgNjh3E8GoPKSonwwh_A8ocEjeC8F2BPgP8e3FBgr3E1oNw8P4WUx1xxmx8mqHGVHQGvgQioTqrykcAm_3QFYJrd9bper2QIBdPVR9buHU4wkuJ0QLG9z2sJMTm9bmS9gCnl8o6WMtHX_T3cvbxO",
            itemCount = 29
        ),
        Category(
            id = "cat_beverages",
            name = "Beverages",
            imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBvgszPxJzymv01IHu-WxWNh0ROR40rvG95bYzStVwMZpLdPGSaWD5KHrUIdFshyQfTepMVIzA1zVLn2GV6WhncCLOzRtw_Ug-xYfbSX8XdhHCMXoB4steWhHPf8SNxaCRdWEw6lV5QpSo7iwgCS1X6Ot6kYWPh_RleDo1uSQ9UBoNUWX6QwdrEmuMenU2t5Tz8hIPGHecx84u7DxXJIouy0egten4q2NW8_or9BCOP7TMbUsYJcvGy",
            itemCount = 45
        ),
        Category(
            id = "cat_meat",
            name = "Meat",
            imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBgqvQ_N6WnoaBD_-mzhLzk4XmveCZHq5PD895awJX4_l_9IEfYo_pgfpWKHnAXr1EBrlZugZsWO8iSlCEZsUEddCpIGijFguEDWcuaJgl7ZPXBgyQq29qlU4U-wEAS6uSnn5epC6VdfFEeXuvN1kOIpNpbY9J5AkHCAuqZ1d0LsK6IqGMh3BlKi_XaSWTEKhkwrND4UHluLNi9Sg7CG7emC6A-vzwnaS94iZBHeqzFTJRbLLRhYUa",
            itemCount = 18
        )
    )

    val products = listOf(
        Product(
            id = "prod_whole_milk",
            name = "Whole Milk 1L",
            brand = "Amul",
            weight = "1L",
            price = 64.0,
            originalPrice = 70.0,
            discountPercent = 8,
            deliveryMinutes = 9,
            imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBQ5WIwYbf2ptpBx9QiEqb7uDVmtOKscda6z5G2VeIqb7jXZ_5S6Px6PcQQKKQXkYDRzQA9aRVZEMIjEn-fVQIoKEhIboXdki5GUbFbQXsZf5BE_Pi05QUBKV6LfBjPAyysMJPJSIER024uRkr8v4PsnCSaspJn53mcV9fNKdwT_uCEyviXvBa9gLsRnnGI1wfbhO-YapIoCCZS_7Z_gAmYJ7vDjbX6RDbUoraMKiiOQUwt2EOQ6F2d",
            category = "Dairy",
            rating = 4.8,
            reviewCount = 512,
            description = "Farm-fresh, 100% pure pasteurized whole milk with balanced fat content. Rich, creamy and nutritious, perfect for daily tea, coffee, curd, and shakes.",
            isBestSeller = true
        ),
        Product(
            id = "prod_brown_bread",
            name = "Brown Bread",
            brand = "Britannia",
            weight = "400g",
            price = 45.0,
            originalPrice = 50.0,
            discountPercent = 10,
            deliveryMinutes = 12,
            imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuCMLK1bTOgK2SNV_1tF7IkvLMbvKxttS6UAfXyG-JyQLRe49kIAXI-vk-4WCB4JO_0vgUBmh1WYqdlcBh-YummaHHATXJbyxsvctPCsnF54kxmPmso9JXTCCwv2tGKa1ekNhzPEG002xuEZcu0CB5rxMzCqfXdssQdIT__GEBzauqKZFrAOVj7uVvzbAx38Rs2E50VbNkedPhu07lYvaXrJMdKumglS1Q_9pNdDOHKU_JEk6t8m2FNw",
            category = "Bakery",
            rating = 4.6,
            reviewCount = 280,
            description = "Baked with 100% whole wheat grains, rich in dietary fiber and essential minerals. Soft, pre-sliced, and perfect for healthy breakfast sandwiches and toast.",
            isBestSeller = true
        ),
        Product(
            id = "prod_farm_eggs",
            name = "Farm Eggs",
            brand = "Fresh Farm",
            weight = "Pack of 6",
            price = 55.0,
            originalPrice = 60.0,
            discountPercent = 8,
            deliveryMinutes = 10,
            imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuAV9UYlN5rXbxdyC485ssAkX1VPjoZfeh9T75en2wu8OS8zt20cjM5hUbTr04d9B2gQ_rEvsuvSDNjxAbTQH5RsDU5cUIH6t_l-cKdF-AXwMahzFGD3aUkYI3NidltS9Jdj04DhXrm3Y9GwI4Z-4qkmWmE_efRRIwJDlzPpKPCrfcCxUZ96kOgqcPhacbYTBnYquYWCAltWXbTWrMAfKyzVC6xpX3UKhvh-pYgmgiq-SLr39RjFPK8F",
            category = "Dairy",
            rating = 4.7,
            reviewCount = 340,
            description = "Naturally laid fresh brown eggs from healthy, grain-fed hens. Packed with high-quality protein, omega-3, and essential vitamins for your daily nutritional boost.",
            isBestSeller = true
        ),
        Product(
            id = "prod_bananas",
            name = "Robusta Bananas",
            brand = "Fresh Produce",
            weight = "500g",
            price = 40.0,
            originalPrice = 48.0,
            discountPercent = 16,
            deliveryMinutes = 8,
            imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuC1mM1ugsFUXgfZoKFCCp5q4x0MUVyieOWzWunH62d0sGCVu9sfuDgJ7eR7ijWSl5FM4fxQLuLXzPtn9ODK1yeLdiDyWvH72jW86UBYwuLD8p1PCO3v9a5rdKIA2S2flV9Ri2M4F5Utw-CLsCw6dY12Lzu7YGKWqKISXl5SLlir5bKb6UqTqXjMv5E9tkaJpKm0qOibQclkWYc4seraxhJocFW08BZ86JphhXS6AzALCTiTMVTCw663",
            category = "Fruits",
            rating = 4.9,
            reviewCount = 610,
            description = "Naturally ripened sweet and aromatic Robusta bananas. Loaded with potassium, natural energy, and dietary fiber, ideal for quick snacking or smoothies.",
            isBestSeller = true
        ),
        Product(
            id = "prod_organic_milk_detail",
            name = "Organic Whole Milk",
            brand = "Farm Fresh",
            weight = "500ml",
            price = 35.0,
            originalPrice = 40.0,
            discountPercent = 12,
            deliveryMinutes = 15,
            imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuAhkRM9GwEC_EshhNqIrmAHptHpWQxV_0Q14nqgr-NKfMtAZiRv0J_XuiyKl9nAXImB4-XDhQz4pIzH-sKceTENAD3nFRHvG5GHMIUDzMMn_piiAub3MeiS9CJ6kmcHPIBUnCVHBWjdpaF2cMjPFYxBpGF6UvFQ5P_9fVl4iXCPb7fLnRqH3LDF1804iU-aM5LkEBwe8pfFyaAy2r6uSYaUtvfz1lXt0p49FMRt2YfP4dXOn7hHl9j2",
            category = "Dairy",
            rating = 4.5,
            reviewCount = 420,
            description = "Farm-fresh, 100% organic whole milk sourced directly from local, grass-fed cows. Pasteurised and homogenised for perfect consistency and rich, creamy taste. Ideal for your morning cereal, coffee, or baking needs.",
            isBestSeller = false,
            isFreshDeal = true
        ),
        Product(
            id = "prod_choco_cereal",
            name = "Choco Cereal Box",
            brand = "Browllit's",
            weight = "350G",
            price = 120.0,
            originalPrice = 140.0,
            discountPercent = 14,
            deliveryMinutes = 9,
            imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuD7dXQQ2sjFrn4Yf_PEucZPZgqOpvsJiNvWnwocc_LSWcBXtgZxkKs7HAqnb1YI_Mqlh3l3nslazpLtaYBAG2G4V_kNMxfH2hz7DsS3Uojvy349ypED0FBTfauq5DaqyfzZP98UVjqUhFSgYjK3s-tUKj_NWdJHp5daRbUXQsJ9l4KoO2QJjm0UlfZMiaBF_22Gc2Xi9O7vCcdCoYZamD2tpxkeB2CeulNFmo1m1XXSTG4TH1avESmb",
            category = "Snacks",
            rating = 4.6,
            reviewCount = 189,
            description = "Crunchy whole grain chocolate chip cereal curls made with real cocoa. High in iron, B-vitamins, and essential minerals to start your day with energy.",
            isBestSeller = false
        ),
        Product(
            id = "prod_butter_cookies",
            name = "Butter Cookies",
            brand = "Classic Treat",
            weight = "200G",
            price = 65.0,
            originalPrice = 75.0,
            discountPercent = 13,
            deliveryMinutes = 9,
            imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDOvnQzJ_dzQb_5Hqe0HggupNmUrIjdOkcCnVDeJncOhlWh80pccJzM8e8sTTSi8ZtU7W-ySbMoahs6SOpRGSN8MCa9BIfR6w8V6aSQE9YO0r2l4Ds1ZgoZIla2vh86-SvUjnn0VaAYmLMwVwycmJb2_uj7Q8-IoEHkO_rbsT1Ot9Aal6njYUec09OvpDPKXuVhXh_dUz1-q_1AaRNeBoNrFk2p-elCrZuP63qR9q6EtrSeNGp-Rx6i",
            category = "Bakery",
            rating = 4.7,
            reviewCount = 230,
            description = "Mouth-watering golden Danish-style butter cookies baked to delicate crisp perfection with pure dairy butter. A heavenly companion for tea time.",
            isBestSeller = false
        ),
        Product(
            id = "prod_organic_milk_carton",
            name = "Organic Milk 500ml",
            brand = "Farm Fresh",
            weight = "500ml",
            price = 42.0,
            unitCurrency = "₹",
            originalPrice = 48.0,
            discountPercent = 12,
            deliveryMinutes = 9,
            imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBUKrvE7Tf3A1kRsmmhWPlPwm2Z6qwuxr3OFCjzstZQjVSaeprYLxn7thkdF-WubODKJ1r-QD6ShJ1XCWHLdcV4TW6RThh5fyGXFBHbsiyQK98l3F5vY2rXAApVjwfv9pR0FjqyhpoOJLUKkkpFPKVuTphsqjiQwhp3QIkRKjIorxQYA20sO3JISBqCxX5Y8TQAEfObGWsnSzsTOvzK4OoAPRlWcXtQ4SEPuu7GOpnonngWe0LSv_Na",
            category = "Dairy",
            rating = 4.8,
            reviewCount = 310,
            description = "Pure certified organic whole milk packed in eco-friendly cartons to retain crisp freshness and optimal nutrient density."
        ),
        Product(
            id = "prod_toned_milk",
            name = "Toned Milk 1L",
            brand = "Daily Dairy",
            weight = "1L",
            price = 68.0,
            unitCurrency = "₹",
            originalPrice = 75.0,
            discountPercent = 9,
            deliveryMinutes = 12,
            imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBZJgFeYirB803HhuRmVvNddVquC4MxZhbyDq5Tv9aGxPwSzvn_K3REQrc6IKW8xQ_JclOMLyIrBU0PH52OLwQItwPb_lypedZLWm3GIfCPecxiSb5rY3x7XBRLeasVI02gYvzQU2OQG34rTBHtJsJKtWM9x88DT2Dv2R4tIB1PkT3SszewdnYEZOvFDM0H4Ra6cQk1xXmfLQZp0rUOvYVZV8jPmfF8gFeZ4f5HvFnPVvQNnCR2X4b0",
            category = "Dairy",
            rating = 4.5,
            reviewCount = 180,
            description = "Light and refreshing homogenized toned milk with reduced fat and rich calcium content, great for fitness conscious households."
        ),
        Product(
            id = "prod_oat_milk",
            name = "Oat Milk 1L",
            brand = "Plant Based",
            weight = "1L",
            price = 180.0,
            unitCurrency = "₹",
            originalPrice = 210.0,
            discountPercent = 14,
            deliveryMinutes = 9,
            imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBS73ZaNhmTmsseMm-9rWi-oMagSha05sWQaxsSq7DhOu18Bij8dXvYNFtg5W7JxjeTq-SImxq_en68YedTRY6jNm62iHfswbzkErk42_kpkd66U7ZWCO9SBiGxKJlWp1KIg6hVdxV38Vmd2isJXE2IYpllKDUNqFPv6s3UOrDLQPR1XCIxVfIBaCu2KArAL-Dpld3uUTnyX-wvO6uktgoDYLKWI1PAg3_yOU8je6qwzqa7S-BWvMzH",
            category = "Dairy",
            rating = 4.9,
            reviewCount = 490,
            description = "Barista-blend creamy oat milk crafted from gluten-free whole oats. Froths luxuriously for specialty coffees and teas without dairy or added sugar."
        ),
        Product(
            id = "prod_strawberries",
            name = "Organic Strawberries",
            brand = "Fresh Berries",
            weight = "250g",
            price = 149.0,
            unitCurrency = "₹",
            originalPrice = 180.0,
            discountPercent = 17,
            deliveryMinutes = 10,
            imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuC9JhlF8lboyfJ0Lsj5jRAMstlr1ANLegAcbxdM7BKoOPs3-STAdn0u0eq-x2uW-rC24ewVlnyQmGJjhtzjFyssl2cH92dtHBDjYTyVzZVtmnQyWcwGJi6JKt4VeVQNF5ZeZ3DjaAe9EVWKMwWDClcEt-5q5ffhCk7SwftISgnUllK_b0Wq000Vo_qTYNx-Jb0cukieZ_jwXyj5r6KroHPzrZTixNO6uelxacUJAZeGWWJ0BBHgvPuH",
            category = "Fruits",
            rating = 4.9,
            reviewCount = 530,
            description = "Sweet, aromatic garden-fresh organic strawberries handpicked at peak ripeness. Juicy, rich in antioxidants and vitamin C."
        ),
        Product(
            id = "prod_avocados",
            name = "Hass Avocados",
            brand = "Imported Fresh",
            weight = "Pack of 3",
            price = 220.0,
            unitCurrency = "₹",
            originalPrice = 260.0,
            discountPercent = 15,
            deliveryMinutes = 12,
            imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDRQyYUFJgDY9NhZ1x_V72xWB63GPNjZ57Ys-t0U0Yack_kVJ9HrZbQTsWvakkfGoQoQqvn1bUEDjAIrsWGuGqBdE_ghfahc4nG4PSCM20BEKDr5RY7e3-NLaG_OtLvpWDV4JhWzsdN5NRsrxNHp-BLbN2qVtQkIbUmK1eZ8aJx2qMSDxBHkF0gU14aA0nil9Gt0U9cDozl4vIWUhedGtbUV3XczLqRB0zlF3wtBdtsHyqVjky3Aaph",
            category = "Fruits",
            rating = 4.8,
            reviewCount = 375,
            description = "Creamy, nutrient-dense Hass avocados loaded with healthy monounsaturated fats. Excellent for guacamole, salads, or avocado toast."
        ),
        Product(
            id = "prod_maggi_noodles",
            name = "Maggi 2-Minute Masala Noodles",
            brand = "Nestlé",
            weight = "280g (Pack of 4)",
            price = 56.0,
            originalPrice = 60.0,
            discountPercent = 7,
            deliveryMinutes = 8,
            imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBWY9PALk8Qh66wqPpTzFuqv65A4ZDgv3oVtcD35aDzfsVVEbayh2njT3BruIBa1HMVr0uPdeTSmH-Jflx9yOTQy89PjuWPy1nGP2nOjg0SPKApg_pslfYnmzu8kQJJMsnh_jqzSfV6H90o9_KuUrs7ruDyJppyJiJjz1ubtM81LYvFlwNoc2sGomE2y6fBPN9e-wFGSRmauij-xf_Aoo7-WuhmryjhNrg0P53gKw9f2UFhK4x58MPg",
            category = "Snacks",
            rating = 4.9,
            reviewCount = 1420,
            description = "India's favorite instant noodles infused with authentic roasted spices and aroma. Ready in just 2 minutes for late-night cravings or quick snacks.",
            isBestSeller = true,
            isFreshDeal = true
        ),
        Product(
            id = "prod_amul_butter",
            name = "Amul Pasteurised Butter",
            brand = "Amul",
            weight = "100g",
            price = 56.0,
            originalPrice = 58.0,
            discountPercent = 3,
            deliveryMinutes = 8,
            imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBy9xRYhXcLeon3GDxHcZ2BIFWf6nN-rZwORoccjzi9MZhl-XxF08_9_Ss0umqDMU4f_M5xUApWiji7tu4XaRqFWoNToi5xMngBXeOVm6B6fwxKAwzeh6kDdyDJOimrt8J10N_yo7JtjWDSMQFoqcSdHH67fNwvSUI0cYAAR9L03qsbOOHNTOO7WXt1__KhvZTVFrTKfnCm9UzmyrRjLrhipzuc2cRgDxx0DL9_S5z7AAtINMKVO8I9",
            category = "Dairy",
            rating = 4.9,
            reviewCount = 980,
            description = "Utterly butterly delicious 100% pure creamy butter made from fresh cream. The golden standard for morning toast, parathas, and cooking.",
            isBestSeller = true
        ),
        Product(
            id = "prod_lays_chips",
            name = "Lay's Classic Salted Chips",
            brand = "Lay's",
            weight = "50g",
            price = 20.0,
            originalPrice = 20.0,
            discountPercent = 0,
            deliveryMinutes = 7,
            imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuD7dXQQ2sjFrn4Yf_PEucZPZgqOpvsJiNvWnwocc_LSWcBXtgZxkKs7HAqnb1YI_Mqlh3l3nslazpLtaYBAG2G4V_kNMxfH2hz7DsS3Uojvy349ypED0FBTfauq5DaqyfzZP98UVjqUhFSgYjK3s-tUKj_NWdJHp5daRbUXQsJ9l4KoO2QJjm0UlfZMiaBF_22Gc2Xi9O7vCcdCoYZamD2tpxkeB2CeulNFmo1m1XXSTG4TH1avESmb",
            category = "Snacks",
            rating = 4.8,
            reviewCount = 820,
            description = "Crispy thin potato slices sprinkled with a pinch of pure salt. Perfectly crunchy, timeless snack for any hour of the day.",
            isBestSeller = true
        ),
        Product(
            id = "prod_coca_cola",
            name = "Coca-Cola Original Taste Can",
            brand = "Coca-Cola",
            weight = "300ml",
            price = 40.0,
            originalPrice = 45.0,
            discountPercent = 11,
            deliveryMinutes = 8,
            imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBvgszPxJzymv01IHu-WxWNh0ROR40rvG95bYzStVwMZpLdPGSaWD5KHrUIdFshyQfTepMVIzA1zVLn2GV6WhncCLOzRtw_Ug-xYfbSX8XdhHCMXoB4steWhHPf8SNxaCRdWEw6lV5QpSo7iwgCS1X6Ot6kYWPh_RleDo1uSQ9UBoNUWX6QwdrEmuMenU2t5Tz8hIPGHecx84u7DxXJIouy0egten4q2NW8_or9BCOP7TMbUsYJcvGy",
            category = "Beverages",
            rating = 4.8,
            reviewCount = 670,
            description = "Ice-chilled refreshing carbonated soft drink delivered crisp and fizzy in under 10 minutes to your doorstep.",
            isBestSeller = true
        ),
        Product(
            id = "prod_cadbury_silk",
            name = "Cadbury Dairy Milk Silk Chocolate",
            brand = "Cadbury",
            weight = "60g",
            price = 75.0,
            originalPrice = 85.0,
            discountPercent = 12,
            deliveryMinutes = 8,
            imageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDOvnQzJ_dzQb_5Hqe0HggupNmUrIjdOkcCnVDeJncOhlWh80pccJzM8e8sTTSi8ZtU7W-ySbMoahs6SOpRGSN8MCa9BIfR6w8V6aSQE9YO0r2l4Ds1ZgoZIla2vh86-SvUjnn0VaAYmLMwVwycmJb2_uj7Q8-IoEHkO_rbsT1Ot9Aal6njYUec09OvpDPKXuVhXh_dUz1-q_1AaRNeBoNrFk2p-elCrZuP63qR9q6EtrSeNGp-Rx6i",
            category = "Snacks",
            rating = 4.9,
            reviewCount = 1190,
            description = "Silky smooth, decadent milk chocolate that melts effortlessly in your mouth. The ultimate sweet indulgence.",
            isBestSeller = true,
            isFreshDeal = true
        )
    )

    val availableCoupons = listOf(
        com.example.data.model.Coupon(
            code = "ZEPTO50",
            title = "FLAT ₹50 OFF",
            description = "Get ₹50 off on grocery orders of ₹199 or more",
            discountAmount = 50.0,
            minOrderValue = 199.0,
            tag = "MOST POPULAR",
            expiryText = "Valid today only"
        ),
        com.example.data.model.Coupon(
            code = "WELCOME100",
            title = "WELCOME ₹100 OFF",
            description = "Flat ₹100 off on your order above ₹299",
            discountAmount = 100.0,
            minOrderValue = 299.0,
            tag = "NEW USER",
            expiryText = "Expires in 3 days"
        ),
        com.example.data.model.Coupon(
            code = "CRAZEFREE",
            title = "FREE DELIVERY",
            description = "Zero delivery fee on all orders above ₹149",
            discountAmount = 25.0,
            minOrderValue = 149.0,
            tag = "FREE SHIPPING",
            expiryText = "Instant apply"
        ),
        com.example.data.model.Coupon(
            code = "BLINKIT75",
            title = "SUPER SAVER ₹75 OFF",
            description = "Get ₹75 off on orders above ₹499",
            discountAmount = 75.0,
            minOrderValue = 499.0,
            tag = "BIG BASKET",
            expiryText = "Ends tonight"
        )
    )

    val bankOffers = listOf(
        com.example.data.model.BankOffer(
            bankName = "CRED Pay",
            title = "Flat ₹50 Cashback",
            description = "Pay via CRED UPI & get ₹50 cashback directly to your bank account",
            discountPercent = 15,
            maxDiscount = 50.0,
            minOrder = 199.0,
            couponCode = "CRED50"
        ),
        com.example.data.model.BankOffer(
            bankName = "HDFC Bank",
            title = "10% Instant Discount",
            description = "Get 10% off up to ₹100 on HDFC Bank Credit/Debit Cards",
            discountPercent = 10,
            maxDiscount = 100.0,
            minOrder = 499.0,
            couponCode = "HDFC10"
        ),
        com.example.data.model.BankOffer(
            bankName = "Paytm UPI",
            title = "Flat ₹30 Cashback",
            description = "Pay using Paytm UPI to get scratch card up to ₹30",
            discountPercent = 10,
            maxDiscount = 30.0,
            minOrder = 149.0,
            couponCode = "PAYTM30"
        ),
        com.example.data.model.BankOffer(
            bankName = "ICICI Bank",
            title = "Instant ₹75 OFF",
            description = "Flat ₹75 discount on ICICI Net Banking and Cards",
            discountPercent = 12,
            maxDiscount = 75.0,
            minOrder = 399.0,
            couponCode = "ICICI75"
        )
    )

    val defaultAddresses = listOf(
        Address(
            id = "addr_home",
            tag = "Home",
            line1 = "Kalinga Vihar, Patia",
            line2 = "Bhubaneswar, Odisha 751024",
            cityStateZip = "Bhubaneswar, Odisha 751024",
            phone = "+91 98765 43210",
            isDefault = true
        ),
        Address(
            id = "addr_work",
            tag = "Work",
            line1 = "Tech Park, Tower B",
            line2 = "Chandrasekharpur, Bhubaneswar",
            cityStateZip = "Bhubaneswar, Odisha 751016",
            phone = "+91 98765 43211",
            isDefault = false
        ),
        Address(
            id = "addr_other",
            tag = "Other",
            line1 = "Apt 4B, Green Meadows",
            line2 = "KIIT Road, Bhubaneswar",
            cityStateZip = "Bhubaneswar, Odisha 751024",
            phone = "+91 98765 43212",
            isDefault = false
        )
    )
}
