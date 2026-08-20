document.addEventListener('DOMContentLoaded', () => {
    // --- Yeni Veri Yapısı ve Başlangıç Fonksiyonu ---
    const DATA_VERSION = '1.9'; // proje adı değişimi

    function normalizeProducts(products) {
        const seenProducts = new Set();
        return (products || []).filter((product) => {
            const key = `${product.storeEmail || ''}:${product.storeProductId ?? product.id ?? product.name}`;
            if (seenProducts.has(key)) {
                return false;
            }
            seenProducts.add(key);
            return true;
        });
    }

    function initializeData() {
        const currentVersion = localStorage.getItem('dataVersion');
        if (currentVersion === DATA_VERSION) {
            const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
            const normalizedProducts = normalizeProducts(existingProducts);
            if (normalizedProducts.length !== existingProducts.length) {
                localStorage.setItem('products', JSON.stringify(normalizedProducts));
                console.log('Yinelenen ürünler temizlendi.');
            }
            return; // Veri güncel, tekrar kurmaya gerek yok
        }

        // Eski verileri temizle
        localStorage.clear();

        // Yeni Kullanıcıları (Mağazalar ve Müşteri) Oluştur
        const newUsers = [
            // Adminler (Mağazalar)
            { name: "Flaş Elektronik", email: "a@gmail.com", password: "123456", userType: "admin" },
            { name: "Evim Mobilya", email: "b@gmail.com", password: "123456", userType: "admin" },
            { name: "Kitapçım", email: "c@gmail.com", password: "123456", userType: "admin" },
            { name: "Güzel Giyim", email: "d@gmail.com", password: "123456", userType: "admin" },
            // Normal Kullanıcı
            { name: "Ali Veli", email: "user@gmail.com", password: "123456", userType: "customer" }
        ];
        localStorage.setItem('users', JSON.stringify(newUsers));

        // Yeni Ürünleri Oluştur
        const newProducts = [
            // Flaş Elektronik (a@gmail.com)
            { id: 1, storeProductId: 1, name: "iPhone 15 Pro", price: 75000, category: "Elektronik", brand: "Apple", color: "Natural Titanium", image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692845702708", stock: 20, storeEmail: "a@gmail.com" },
            { id: 2, storeProductId: 2, name: "Samsung Galaxy S24 Ultra", price: 70000, category: "Elektronik", brand: "Samsung", color: "Siyah", image: "https://image-us.samsung.com/SamsungUS/home/mobile/phones/galaxy-s/galaxy-s24-ultra/pdp/gallery/S24-Ultra-Gallery-Titanium-Black-1.jpg", stock: 15, storeEmail: "a@gmail.com" },
            { id: 3, storeProductId: 3, name: "Xiaomi 13T Pro", price: 35000, category: "Elektronik", brand: "Xiaomi", color: "Mavi", image: "https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-13t-pro-1.jpg", stock: 30, storeEmail: "a@gmail.com" },
            { id: 4, storeProductId: 4, name: "Google Pixel 8", price: 40000, category: "Elektronik", brand: "Google", color: "Gri", image: "https://fdn2.gsmarena.com/vv/pics/google/google-pixel-8-1.jpg", stock: 10, storeEmail: "a@gmail.com" },
            { id: 5, storeProductId: 5, name: "Huawei P60 Pro", price: 42000, category: "Elektronik", brand: "Huawei", color: "Beyaz", image: "https://fdn2.gsmarena.com/vv/pics/huawei/huawei-p60-pro-1.jpg", stock: 12, storeEmail: "a@gmail.com" },
            { id: 6, storeProductId: 6, name: "Apple Watch Series 9", price: 18000, category: "Elektronik", brand: "Apple", color: "Gümüş", image: "https://fdn2.gsmarena.com/vv/pics/apple/apple-watch-series-9-1.jpg", stock: 25, storeEmail: "a@gmail.com" },
            { id: 7, storeProductId: 7, name: "Samsung Galaxy Watch 6", price: 8000, category: "Elektronik", brand: "Samsung", color: "Siyah", image: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-watch6-1.jpg", stock: 40, storeEmail: "a@gmail.com" },
            { id: 8, storeProductId: 8, name: "Huawei Watch GT 4", price: 7500, category: "Elektronik", brand: "Huawei", color: "Kahverengi", image: "https://fdn2.gsmarena.com/vv/pics/huawei/huawei-watch-gt4-2.jpg", stock: 35, storeEmail: "a@gmail.com" },
            { id: 9, storeProductId: 9, name: "Garmin Venu 3", price: 15000, category: "Elektronik", brand: "Garmin", color: "Siyah", image: "https://res.garmin.com/en/products/010-02785-01/v/cf-lg-556339a3-c8ce-4188-b1a0-3f244b581b53.jpg", stock: 18, storeEmail: "a@gmail.com" },
            { id: 10, storeProductId: 10, name: "Xiaomi Watch S1 Active", price: 4000, category: "Elektronik", brand: "Xiaomi", color: "Mavi", image: "https://m.media-amazon.com/images/I/516p2eI6V3L._AC_UF894,1000_QL80_.jpg", stock: 50, storeEmail: "a@gmail.com" },
            { id: 11, storeProductId: 11, name: "AirPods Pro 2. Nesil", price: 8000, category: "Elektronik", brand: "Apple", color: "Beyaz", image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MTJV3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1694014871985", stock: 60, storeEmail: "a@gmail.com" },
            { id: 12, storeProductId: 12, name: "Sony WH-1000XM5", price: 12000, category: "Elektronik", brand: "Sony", color: "Siyah", image: "https://m.media-amazon.com/images/I/61Vza5DG0zL.jpg", stock: 22, storeEmail: "a@gmail.com" },
            { id: 13, storeProductId: 13, name: "Samsung Buds 2 Pro", price: 4500, category: "Elektronik", brand: "Samsung", color: "Mor", image: "https://images.samsung.com/is/image/samsung/p6pim/tr/2208/gallery/tr-galaxy-buds2-pro-r510-sm-r510nlvatur-533186519?$650_519_PNG$", stock: 45, storeEmail: "a@gmail.com" },
            { id: 14, storeProductId: 14, name: "Anker 20W Hızlı Şarj Adaptörü", price: 400, category: "Elektronik", brand: "Anker", color: "Beyaz", image: "https://m.media-amazon.com/images/I/51y-8q3vS-L._AC_UF894,1000_QL80_.jpg", stock: 100, storeEmail: "a@gmail.com" },
            { id: 15, storeProductId: 15, name: "Belkin 3'ü 1 Arada Magsafe Şarj", price: 3500, category: "Elektronik", brand: "Belkin", color: "Siyah", image: "https://www.belkin.com/dw/image/v2/BGBH_PRD/on/demandware.static/-/Sites-master-product-catalog-belkin/default/dw3583c847/images/hi-res/1_WIZ017-B_8830-03363_BoostChargePro_3in1_WirelessChargingPad_Black_Hero.jpg?sw=700&sh=700&sm=fit", stock: 30, storeEmail: "a@gmail.com" },
            { id: 16, storeProductId: 16, name: "Spigen iPhone 15 Pro Kılıf", price: 800, category: "Elektronik", brand: "Spigen", color: "Şeffaf", image: "https://m.media-amazon.com/images/I/61n1Zg7-LUL._AC_UF894,1000_QL80_.jpg", stock: 80, storeEmail: "a@gmail.com" },
            { id: 17, storeProductId: 17, name: "Deri Telefon Kılıfı", price: 600, category: "Elektronik", brand: "Generic", color: "Kahverengi", image: "https://m.media-amazon.com/images/I/81k5B2h+j+L._AC_UF894,1000_QL80_.jpg", stock: 120, storeEmail: "a@gmail.com" },
            { id: 18, storeProductId: 18, name: "Silikon S24 Kılıf", price: 300, category: "Elektronik", brand: "Samsung", color: "Yeşil", image: "https://images.samsung.com/is/image/samsung/p6pim/tr/2311/gallery/tr-galaxy-s24-silicone-case-ef-ps921-ef-ps921tlegww-thumb-539553631?$344_344_PNG$", stock: 90, storeEmail: "a@gmail.com" },
            { id: 19, storeProductId: 19, name: "Cüzdanlı Telefon Kılıfı", price: 500, category: "Elektronik", brand: "Generic", color: "Siyah", image: "https://m.media-amazon.com/images/I/713e-dG35tL._AC_UF894,1000_QL80_.jpg", stock: 70, storeEmail: "a@gmail.com" },
            { id: 20, storeProductId: 20, name: "Magsafe Batarya", price: 2500, category: "Elektronik", brand: "Apple", color: "Beyaz", image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MU2F3?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1693342327342", stock: 40, storeEmail: "a@gmail.com" },

            // Evim Mobilya (b@gmail.com)
            { id: 21, storeProductId: 1, name: "Modern Köşe Koltuk Takımı", price: 25000, category: "Ev & Yaşam", brand: "Istikbal", color: "Gri", image: "https://www.istikbal.com.tr/files/pi/big/istikbal-canyon-kose-takimi-1.jpg", stock: 10, storeEmail: "b@gmail.com" },
            { id: 22, storeProductId: 2, name: "Ahşap Yemek Masası Takımı", price: 18000, category: "Ev & Yaşam", brand: "Bellona", color: "Ceviz", image: "https://st.myideasoft.com/idea/kc/80/myassets/products/358/bellona-mavenna-yemek-masasi-takimi-1.jpg?revision=1699347075", stock: 15, storeEmail: "b@gmail.com" },
            { id: 23, storeProductId: 3, name: "TV Ünitesi", price: 6000, category: "Ev & Yaşam", brand: "Vivense", color: "Beyaz", image: "https://img.vivense.com/2YTYoUoF4s-l4Pzfrpks3i5RER0=/images/4c65432930e34e69a86a6f1b4a0b847d.jpg", stock: 20, storeEmail: "b@gmail.com" },
            { id: 24, storeProductId: 4, name: "Çift Kişilik Yatak ve Baza", price: 22000, category: "Ev & Yaşam", brand: "Yataş", color: "Bej", image: "https://cdn.yatas.com.tr/2/Upload/Urunler/2023/10/24/1/b_1_1698150499.jpeg", stock: 8, storeEmail: "b@gmail.com" },
            { id: 25, storeProductId: 5, name: "Kitaplık", price: 3000, category: "Ev & Yaşam", brand: "Ikea", color: "Beyaz", image: "https://www.ikea.com.tr/urun-gorselleri/250x250/20351552.jpg", stock: 50, storeEmail: "b@gmail.com" },

            // Kitapçım (c@gmail.com)
            { id: 26, storeProductId: 1, name: "Dune", price: 150, category: "Kitap", brand: "İthaki Yayınları", color: "Turuncu", image: "https://i.dr.com.tr/cache/600x600-0/originals/0001893229001-1.jpg", stock: 100, storeEmail: "c@gmail.com" },
            { id: 27, storeProductId: 2, name: "Yüzüklerin Efendisi - Tek Cilt", price: 450, category: "Kitap", brand: "Metis", color: "Yeşil", image: "https://i.dr.com.tr/cache/600x600-0/originals/0000000105367-1.jpg", stock: 80, storeEmail: "c@gmail.com" },
            { id: 28, storeProductId: 3, name: "Suç ve Ceza", price: 90, category: "Kitap", brand: "İş Bankası", color: "Kırmızı", image: "https://i.dr.com.tr/cache/600x600-0/originals/0001788279001-1.jpg", stock: 120, storeEmail: "c@gmail.com" },
            { id: 29, storeProductId: 4, name: "Sapiens: Hayvanlardan Tanrılara", price: 180, category: "Kitap", brand: "Kolektif Kitap", color: "Beyaz", image: "https://i.dr.com.tr/cache/600x600-0/originals/0001762782001-1.jpg", stock: 90, storeEmail: "c@gmail.com" },
            { id: 30, storeProductId: 5, name: "Atomik Alışkanlıklar", price: 120, category: "Kitap", brand: "Pegasus", color: "Sarı", image: "https://i.dr.com.tr/cache/600x600-0/originals/0001792994001-1.jpg", stock: 150, storeEmail: "c@gmail.com" },

            // Güzel Giyim (d@gmail.com)
            { id: 31, storeProductId: 1, name: "Kot Ceket", price: 1500, category: "Giyim", brand: "Levi's", color: "Mavi", image: "https://img-maviprod.mncdn.com/mnresize/1200/1600/productimages/011033-83218_0.jpg", stock: 40, storeEmail: "d@gmail.com" },
            { id: 32, storeProductId: 2, name: "Basic T-shirt", price: 400, category: "Giyim", brand: "Mavi", color: "Beyaz", image: "https://img-maviprod.mncdn.com/mnresize/1200/1600/productimages/062999-620_0.jpg", stock: 200, storeEmail: "d@gmail.com" },
            { id: 33, storeProductId: 3, name: "Kargo Pantolon", price: 1200, category: "Giyim", brand: "H&M", color: "Haki", image: "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F21%2F1a%2F211a2f0103b83918b948790b41e53523a0898b67.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url[file:/product/main]", stock: 60, storeEmail: "d@gmail.com" },
            { id: 34, storeProductId: 4, name: "Kapüşonlu Sweatshirt", price: 900, category: "Giyim", brand: "Adidas", color: "Siyah", image: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/73e5149795524762b0beaf5900949855_9366/Lounge_Kapusonlu_Ust_Siyah_IB8481_21_model.jpg", stock: 80, storeEmail: "d@gmail.com" },
            { id: 35, storeProductId: 5, name: "Deri Çanta", price: 2500, category: "Giyim", brand: "Zara", color: "Siyah", image: "https://static.zara.net/photos///2024/V/1/1/p/6038/310/800/2/w/824/6038310800_6_1_1.jpg?ts=1704733679872", stock: 25, storeEmail: "d@gmail.com" },
        ];

        localStorage.setItem('products', JSON.stringify(newProducts));

        // Veri versiyonunu kaydet
        localStorage.setItem('dataVersion', DATA_VERSION);
        console.log('Veri deposu temizlendi ve yeniden kuruldu. Versiyon:', DATA_VERSION);
    }

    // Uygulama her yüklendiğinde veri kurulumunu kontrol et
    initializeData();

    // Çalışma zamanı için verileri değişkenlere al
    let mockProducts = normalizeProducts(JSON.parse(localStorage.getItem('products')) || []);

    // --- Sepet Fonksiyonları ---
    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function loadCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }

    function updateCartCount(cart) {
        const cartCountElements = document.querySelectorAll('#cart-count');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElements.forEach(el => el.textContent = totalItems);
    }

    // --- User Management Functions ---
    // Tüm kullanıcıları localStorage'dan yükler
    function loadUsers() {
        return JSON.parse(localStorage.getItem('users')) || [];
    }

    // Tüm kullanıcıları localStorage'a kaydeder
    function saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    // --- Genel Fonksiyonlar ---

    function checkLoginState() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const pathname = window.location.pathname;
        const isAuthPage = pathname.includes('login.html');
        const isProtectedPage = !isAuthPage;

        if (isLoggedIn !== 'true' && isProtectedPage) {
            window.location.href = 'login.html?message=not_logged_in';
        }
    }

    function checkAdmin() {
        const userType = localStorage.getItem('userType');
        if (userType !== 'admin') {
            alert('Bu sayfaya erişim yetkiniz yok!');
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }

    function logout() {
        localStorage.removeItem('isLoggedIn');
        // Kullanıcı bilgilerini (user) ve sepeti (cart) silmiyoruz.
        // Sadece çıkış yapmış oluyorlar, tekrar girdiklerinde bilgileri ve sepetleri kalmalı.
        // localStorage.removeItem('userType'); // Kullanıcı tipi de kalabilir.
        window.location.href = 'login.html';
        alert('Başarıyla çıkış yapıldı.');
    }

    function setupDropdownMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const dropdownMenu = document.getElementById('dropdown-menu');
        const dropdownProfileLink = document.getElementById('dropdown-profile-link');
        const dropdownLogoutLink = document.getElementById('dropdown-logout-link');

        if (menuToggle && dropdownMenu) {
            menuToggle.addEventListener('click', (e) => {
                e.stopPropagation(); // Menü butonuna tıklayınca menüyü kapatma olayı tetiklenmesin
                dropdownMenu.classList.toggle('hidden');
            });

            document.addEventListener('click', (e) => {
                if (!menuToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
                    dropdownMenu.classList.add('hidden');
                }
            });
        }

        const userType = localStorage.getItem('userType');
        if (dropdownProfileLink && userType === 'admin') {
            dropdownProfileLink.textContent = 'Yönetici Paneli';
            dropdownProfileLink.href = 'admin.html';
        }

        const dropdownOrdersLink = document.getElementById('dropdown-orders-link');
        if (dropdownOrdersLink && userType === 'admin') {
            dropdownOrdersLink.textContent = 'Siparişleri Yönet';
            dropdownOrdersLink.href = 'admin-siparisler.html';
        }

        if (dropdownLogoutLink) {
            dropdownLogoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }
    }

    // --- Sayfa Yönlendirmesi ve UI ---
    // Her sayfa yüklendiğinde checkLoginState ve setupDropdownMenu fonksiyonlarını çağır
    // Login sayfası için checkLoginState çağırmaya gerek yok, çünkü oradan yönlendirme yapılıyor
    if (document.body.contains(document.getElementById('login-view'))) {
        handleLoginPage();
    } else { // Login sayfası değilse
        let cart = loadCart();
        updateCartCount(cart);
        checkLoginState(); // Her sayfada giriş kontrolü yap
        setupDropdownMenu(); // Navbar menüsünü kur
    }

    if (document.body.contains(document.getElementById('product-grid'))) {
        handleMainPage();
    }

    if (document.body.contains(document.getElementById('profile-form'))) {
        handleProfilePage();
    }

    if (document.body.contains(document.getElementById('cart-items-container'))) {
        handleCartPage();
    }

    if (document.body.contains(document.getElementById('payment-form'))) {
        handlePaymentPage();
    }

    if (document.body.contains(document.getElementById('product-detail-container'))) {
        handleProductDetailPage();
    }

    if (document.body.contains(document.getElementById('orders-container'))) {
        handleOrdersPage();
    }

    if (document.getElementById('admin-products-content')) {
        handleAdminProductsPage();
    }

    if (document.body.contains(document.getElementById('admin-orders-container'))) {
        handleAdminOrdersPage();
    }

    if (document.body.contains(document.getElementById('admin-dashboard-page'))) {
        handleAdminDashboardPage();
    }

    // --- LOGIN SAYFASI İŞLEVLERİ ---
    function handleLoginPage() {
        const loginView = document.getElementById('login-view');
        const registerView = document.getElementById('register-view');
        const showRegister = document.getElementById('show-register');
        const showLogin = document.getElementById('show-login');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('message') === 'not_logged_in') {
            alert('Bu sayfayı görüntülemek için önce giriş yapmalısınız!');
        }

        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            loginView.classList.add('hidden');
            registerView.classList.remove('hidden');
        });

        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            registerView.classList.add('hidden');
            loginView.classList.remove('hidden');
        });

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value; //Emaili al
            const password = document.getElementById('login-password').value; // Şifreyi al

            const users = loadUsers();
            // E-posta ve şifre ile kullanıcıyı bul
            const foundUser = users.find(u => u.email === email && u.password === password);

            if (foundUser) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userType', foundUser.userType); 
                localStorage.setItem('user', JSON.stringify(foundUser));

                alert('Giriş başarılı! Ana sayfaya yönlendiriliyorsunuz.');
                if (foundUser.userType === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'index.html';
                }
            } else {
                alert('E-posta veya şifre hatalı.'); // Hatalı giriş mesajı
            }
        });

        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userType = document.getElementById('user-type').value;
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;

            let users = loadUsers();

            // E-posta adresinin kayıtlı olup olmadığını kontrol et
            if (users.some(u => u.email === email)) {
                alert('Bu e-posta adresi zaten kayıtlı. Lütfen başka bir e-posta kullanın veya giriş yapın.');
                return;
            }

            const newUser = { name: name, email: email, password: password, userType: userType }; // Yeni kullanıcı nesnesini oluştur
            users.push(newUser); // Yeni kullanıcıyı listeye ekle
            saveUsers(users); // Listeyi localStorage'a kaydet

            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userType', userType);
            localStorage.setItem('user', JSON.stringify(newUser)); 

            alert('Kayıt başarılı! Ana sayfaya yönlendiriliyorsunuz.');
            if (userType === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html';
            }
        });
    }

    // --- ANA SAYFA İŞLEVLERİ ---
    function handleMainPage() {
        const productGrid = document.getElementById('product-grid');
        const searchInput = document.getElementById('search-input');
        const categoryLinks = document.querySelectorAll('#category-filter a');
        const priceFilter = document.getElementById('price-filter');
        const minPriceInput = document.getElementById('min-price-input');
        const maxPriceInput = document.getElementById('max-price-input');
        const priceValue = document.getElementById('price-value');
        const colorFilter = document.getElementById('color-filter');
        const brandFilter = document.getElementById('brand-filter');
        const sortBy = document.getElementById('sort-by');

        let currentFilters = {
            search: '', category: 'all',
            minPrice: 0, maxPrice: 50000,
            color: 'all', brand: 'all', sort: 'default'
        };

        function renderProducts(productsToRender) {
            productGrid.innerHTML = '';
            if (productsToRender.length === 0) {
                productGrid.innerHTML = '<p>Filtrelere uygun ürün bulunamadı.</p>';
                return;
            }
            const currentCart = loadCart(); // Sepeti bir kez yükle
            productsToRender.forEach(product => {
                const card = document.createElement('div');
                const isOutOfStock = product.stock <= 0;
                card.className = `product-card ${isOutOfStock ? 'out-of-stock' : ''}`;

                // Mağaza adını bul
                const allUsers = loadUsers();
                const store = allUsers.find(u => u.email === product.storeEmail);
                const storeName = store ? store.name : 'Bilinmeyen Mağaza';

                const existingCartItem = currentCart.find(item => item.id === product.id);
                const quantity = existingCartItem ? existingCartItem.quantity : 0;

                card.innerHTML = `
                    <div class="product-card-body">
                        <a href="urun-detay.html?id=${product.id}" class="product-card-link">
                            <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='placeholder.svg';">
                            <h4>${product.name}</h4>
                        </a>
                        <p class="store-name"><i class="fas fa-store"></i> ${storeName}</p>
                        <p class="price">₺${product.price.toLocaleString()}</p>
                        <p class="stock-text">Stok: ${product.stock} adet</p>
                        
                        <div class="quantity-control-wrapper">
                            ${isOutOfStock
                        ? `<div class="out-of-stock-text">Tükendi</div>`
                        : (quantity > 0
                            ? `<div class="quantity-control" data-product-id="${product.id}">
                                        <button class="quantity-btn decrease-quantity" data-id="${product.id}">-</button>
                                        <span class="product-quantity">${quantity}</span>
                                        <button class="quantity-btn increase-quantity" data-id="${product.id}">+</button>
                                      </div>`
                            : `<button class="add-to-cart-btn" data-id="${product.id}">Sepete Ekle</button>`)
                    } 
                        </div>
                    </div>`;
                productGrid.appendChild(card);
            });
        }

        function applyFilters() {
            let filteredProducts = [...mockProducts];
            if (currentFilters.search) {
                filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(currentFilters.search));
            }
            if (currentFilters.category !== 'all') {
                filteredProducts = filteredProducts.filter(p => p.category === currentFilters.category);
            }
            // Fiyat aralığına göre filtrele
            filteredProducts = filteredProducts.filter(p =>
                p.price >= currentFilters.minPrice && p.price <= currentFilters.maxPrice
            );
            if (currentFilters.color !== 'all') {
                filteredProducts = filteredProducts.filter(p => p.color === currentFilters.color);
            }
            if (currentFilters.brand !== 'all') {
                filteredProducts = filteredProducts.filter(p => p.brand === currentFilters.brand);
            }
            if (currentFilters.sort === 'price-asc') {
                filteredProducts.sort((a, b) => a.price - b.price);
            } else if (currentFilters.sort === 'price-desc') {
                filteredProducts.sort((a, b) => b.price - a.price);
            }
            renderProducts(filteredProducts);
        }

        searchInput.addEventListener('input', (e) => {
            currentFilters.search = e.target.value.toLowerCase();
            applyFilters();
        });
        categoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector('#category-filter a.active').classList.remove('active');
                e.target.classList.add('active');
                currentFilters.category = e.target.dataset.category;
                applyFilters();
            });
        });
        document.querySelector('#category-filter a[data-category="all"]').classList.add('active');
        priceFilter.addEventListener('input', (e) => {
            const newMaxPrice = parseInt(e.target.value);
            // Slider'ın min değerin altına inmesini engelle
            if (newMaxPrice < currentFilters.minPrice) {
                priceFilter.value = currentFilters.minPrice;
                return;
            }
            currentFilters.maxPrice = newMaxPrice;
            maxPriceInput.value = currentFilters.maxPrice; // Input'u güncelle
            priceValue.textContent = `₺${currentFilters.maxPrice.toLocaleString()}`; // Slider altındaki metni güncelle
            applyFilters();
        });
        minPriceInput.addEventListener('input', (e) => {
            currentFilters.minPrice = parseInt(e.target.value) || 0;
            priceFilter.min = currentFilters.minPrice; // Slider'ın min değerini güncelle
            applyFilters();
        });
        maxPriceInput.addEventListener('input', (e) => {
            currentFilters.maxPrice = parseInt(e.target.value) || 50000;
            priceFilter.value = currentFilters.maxPrice; // Slider'ı güncelle
            priceValue.textContent = `₺${currentFilters.maxPrice.toLocaleString()}`; // Slider altındaki metni güncelle
            applyFilters();
        });
        colorFilter.addEventListener('change', (e) => {
            currentFilters.color = e.target.value;
            applyFilters();
        });
        brandFilter.addEventListener('change', (e) => {
            currentFilters.brand = e.target.value;
            applyFilters();
        });
        sortBy.addEventListener('change', (e) => {
            currentFilters.sort = e.target.value;
            applyFilters();
        });
        productGrid.addEventListener('click', (e) => {
            const target = e.target.closest('.add-to-cart-btn, .increase-quantity, .decrease-quantity');
            if (!target) return;

            const productId = parseInt(target.dataset.id);
            let cart = loadCart();
            const productToAdd = mockProducts.find(p => p.id === productId);

            if (!productToAdd) return; // Geçersiz ürün ID'si

            const existingCartItemIndex = cart.findIndex(item => item.id === productId);

            if (target.classList.contains('add-to-cart-btn')) {
                // Eğer stokta yoksa ekleme yapma
                const currentQtyInCart = existingCartItemIndex > -1 ? cart[existingCartItemIndex].quantity : 0;
                if (productToAdd.stock <= currentQtyInCart) {
                    alert('Üzgünüz, bu üründen stokta daha fazla yok.');
                } else {
                    if (existingCartItemIndex > -1) {
                        cart[existingCartItemIndex].quantity++;
                    } else {
                        cart.push({ ...productToAdd, quantity: 1 });
                    }
                    alert(`${productToAdd.name} sepete eklendi!`);
                }
            } else if (target.classList.contains('increase-quantity')) {
                if (existingCartItemIndex > -1) {
                    const currentQty = cart[existingCartItemIndex].quantity;
                    if (currentQty < productToAdd.stock) {
                        cart[existingCartItemIndex].quantity++;
                    } else {
                        alert('Bu üründen daha fazla ekleyemezsiniz. Stok yetersiz.');
                    }
                }
            } else if (target.classList.contains('decrease-quantity')) {
                if (existingCartItemIndex > -1) {
                    cart[existingCartItemIndex].quantity--;
                    if (cart[existingCartItemIndex].quantity <= 0) {
                        cart.splice(existingCartItemIndex, 1); // Miktar 0 veya altına düşerse ürünü sepetten çıkar
                    }
                }
            }
            saveCart(cart);
            updateCartCount(cart);
            applyFilters(); // Ürün kartlarını yeniden render ederek miktarı veya butonu güncelle
        });
        applyFilters();
    }

    // --- PROFİL SAYFASI İŞLEVLERİ ---
    function handleProfilePage() {
        const profileForm = document.getElementById('profile-form');
        const nameInput = document.getElementById('profile-name');
        const emailInput = document.getElementById('profile-email');
        const passwordInput = document.getElementById('profile-password'); // Şifre giriş alanını al

        // Kullanıcı bilgilerini localStorage'dan yükle
        let currentUser = JSON.parse(localStorage.getItem('user'));
        if (currentUser) {
            nameInput.value = currentUser.name;
            emailInput.value = currentUser.email;
            // Güvenlik nedeniyle şifre alanını doldurmuyoruz
        } else {
            alert('Kullanıcı bilgileri bulunamadı. Lütfen giriş yapın.');
            window.location.href = 'login.html'; // Kullanıcı yoksa giriş sayfasına yönlendir
            return;
        }

        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const updatedName = nameInput.value;
            const updatedEmail = emailInput.value;
            const newPassword = passwordInput.value; // Yeni şifreyi al (boş olabilir)

            let users = loadUsers();
            // Güncel kullanıcının dizideki indeksini bul
            const userIndex = users.findIndex(u => u.email === currentUser.email);

            if (userIndex === -1) {
                alert('Kullanıcı veritabanında bulunamadı. Lütfen tekrar giriş yapın.');
                localStorage.removeItem('user'); // Hatalı durumu temizle
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userType');
                window.location.href = 'login.html';
                return;
            }

            // Yeni e-posta adresinin başka bir kullanıcı tarafından kullanılıp kullanılmadığını kontrol et
            if (updatedEmail !== currentUser.email && users.some(u => u.email === updatedEmail)) {
                alert('Bu e-posta adresi zaten başka bir kullanıcı tarafından kullanılıyor.');
                return;
            }

            // Kullanıcı bilgilerini güncelle
            const updatedUser = {
                name: updatedName,
                email: updatedEmail,
                password: newPassword ? newPassword : currentUser.password, // Yeni şifre varsa güncelle, yoksa eskiyi koru
                userType: currentUser.userType // Kullanıcı tipini koru
            };
            users[userIndex] = updatedUser; // Dizideki kullanıcıyı güncelle
            saveUsers(users); // Güncellenmiş kullanıcı listesini kaydet

            localStorage.setItem('user', JSON.stringify(updatedUser)); // Giriş yapmış kullanıcının bilgilerini de güncelle
            currentUser = updatedUser; // currentUser referansını da güncelle
            alert('Profil bilgilerin başarıyla güncellendi!');
        });
    }

    // --- ÜRÜN DETAY SAYFASI İŞLEVLERİ ---
    function handleProductDetailPage() {
        const productDetailContainer = document.getElementById('product-detail-container');
        const params = new URLSearchParams(window.location.search);
        const productId = parseInt(params.get('id'));

        const product = mockProducts.find(p => p.id === productId);

        if (!product) {
            productDetailContainer.innerHTML = '<p>Ürün bulunamadı. Lütfen ana sayfaya dönün.</p>';
            return;
        }

        // Mağaza adını bul
        const allUsers = loadUsers();
        const store = allUsers.find(u => u.email === product.storeEmail);
        const storeName = store ? store.name : 'Bilinmeyen Mağaza';

        document.title = `${product.name} | DevMarket`; // Sayfa başlığını güncelle

        productDetailContainer.innerHTML = `
            <div class="product-detail">
                <div class="product-detail-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='placeholder.svg';">
                </div>
                <div class="product-detail-info">
                    <h1>${product.name}</h1>
                    <p class="detail-price">₺${product.price.toLocaleString()}</p>
                    <div class="detail-meta">
                        <span><strong>Marka:</strong> ${product.brand}</span>
                        <span><strong>Stok:</strong> ${product.stock} adet</span>
                        <span class="store-name"><strong>Mağaza:</strong> ${storeName}</span>
                    </div>
                    <p class="detail-description">
                        Bu ürün hakkında açıklama metni buraya gelecek. Mock datada olmadığı için şimdilik standart bir metin eklenmiştir. 
                        Ürünün kalitesi, özellikleri ve kullanım alanları hakkında detaylı bilgi sunar.
                    </p>
                    <button class="btn add-to-cart-detail-btn" data-id="${product.id}">Sepete Ekle</button>
                </div>
            </div>
        `;

        const addToCartBtn = productDetailContainer.querySelector('.add-to-cart-detail-btn');
        addToCartBtn.addEventListener('click', () => {
            const productId = parseInt(addToCartBtn.dataset.id);
            let cart = loadCart();
            const productToAdd = mockProducts.find(p => p.id === productId);

            if (!productToAdd) return;

            const existingCartItemIndex = cart.findIndex(item => item.id === productId);
            const currentQtyInCart = existingCartItemIndex > -1 ? cart[existingCartItemIndex].quantity : 0;

            if (productToAdd.stock <= currentQtyInCart) {
                alert('Üzgünüz, stokta daha fazla ürün yok.');
                return;
            }

            if (existingCartItemIndex > -1) {
                cart[existingCartItemIndex].quantity++;
            } else {
                cart.push({ ...productToAdd, quantity: 1 });
            }

            saveCart(cart);
            updateCartCount(cart);
            alert(`${productToAdd.name} sepete eklendi!`);

            // Butonun metnini ve durumunu güncelleyebiliriz
            addToCartBtn.textContent = 'Sepete Eklendi!';
            addToCartBtn.disabled = true;
            setTimeout(() => {
                addToCartBtn.textContent = 'Sepete Ekle';
                addToCartBtn.disabled = false;
            }, 2000);
        });
    }

    // --- ÖDEME SAYFASI İŞLEVLERİ ---
    function handlePaymentPage() {
        const paymentForm = document.getElementById('payment-form');
        if (!paymentForm) return;

        const cardNumberInput = document.getElementById('card-number');
        const expiryDateInput = document.getElementById('expiry-date');
        const cvvInput = document.getElementById('cvv');

        // Son kullanma tarihi formatını otomatik düzeltme
        expiryDateInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, ''); // Sadece rakamları al
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });

        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const cardNumber = cardNumberInput.value.replace(/\s/g, ''); // Boşlukları kaldır
            const expiryDate = expiryDateInput.value;
            const cvv = cvvInput.value;

            // Basit doğrulama (sadece uzunluk ve format)
            if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
                alert('Lütfen 16 haneli geçerli bir kart numarası girin.');
                return;
            }

            if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
                alert('Lütfen son kullanma tarihini AA/YY formatında girin (örn: 12/25).');
                return;
            }

            if (cvv.length !== 3 || !/^\d+$/.test(cvv)) {
                alert('Lütfen 3 haneli geçerli bir CVV kodu girin.');
                return;
            }

            // Ödeme başarılı sayılır
            const cart = loadCart();
            const currentUser = JSON.parse(localStorage.getItem('user'));

            if (cart.length === 0) {
                alert('Sepetiniz boş.');
                return;
            }

            // Stok doğrulaması
            const products = JSON.parse(localStorage.getItem('products')) || [];
            for (let cartItem of cart) {
                const prod = products.find(p => p.id === cartItem.id);
                if (!prod) {
                    alert(`Ürün bulunamadı: ${cartItem.name}`);
                    return;
                }
                if (cartItem.quantity > prod.stock) {
                    alert(`'${cartItem.name}' için istenen miktar stoktan fazla. Lütfen miktarı azaltın.`);
                    return;
                }
            }

            // Stokları düş
            cart.forEach(ci => {
                const prodIndex = products.findIndex(p => p.id === ci.id);
                if (prodIndex > -1) {
                    products[prodIndex].stock = Math.max(0, products[prodIndex].stock - ci.quantity);
                }
            });
            localStorage.setItem('products', JSON.stringify(products));
            mockProducts = products; // runtime verisini güncelle

            if (currentUser) {
                let orders = JSON.parse(localStorage.getItem('orders')) || [];
                const newOrder = {
                    id: Date.now(),
                    userId: currentUser.email, // Siparişi kullanıcıya bağla
                    date: new Date().toISOString(),
                    items: cart,
                    total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                    status: 'Hazırlanıyor' // Varsayılan sipariş durumu
                };
                orders.push(newOrder);
                localStorage.setItem('orders', JSON.stringify(orders));
            }

            localStorage.removeItem('cart'); // Sepeti temizle
            updateCartCount([]); // Sepet sayacını güncelle

            alert('Ödeme başarıyla tamamlandı! Siparişiniz alındı.');
            // Kullanıcıyı siparişlerim sayfasına yönlendir
            window.location.href = 'siparislerim.html';
        });
    }

    // --- SEPET SAYFASI İŞLEVLERİ ---
    function handleCartPage() {
        const cartItemsContainer = document.getElementById('cart-items-container');

        function renderCart() {
            const cart = loadCart();
            updateCartCount(cart);

            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="cart-empty">
                        <p>Sepetinizde henüz ürün bulunmuyor.</p>
                        <a href="index.html" class="btn">Alışverişe Başla</a>
                    </div>`;
                return;
            }

            let total = 0;
            cartItemsContainer.innerHTML = `
                <div class="cart-list">
                    ${cart.map((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                return ` 
                        <div class="cart-item" data-id="${item.id}">
                            <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null;this.src='placeholder.svg';">
                            <div class="cart-item-info">
                                <h4>${item.name}</h4>
                                <p class="price">Birim Fiyat: ₺${item.price.toLocaleString()}</p>
                            </div>
                            <div class="quantity-control">
                                <button class="quantity-btn decrease-quantity" data-id="${item.id}">-</button>
                                <span class="product-quantity">${item.quantity}</span>
                                <button class="quantity-btn increase-quantity" data-id="${item.id}">+</button>
                            </div>
                            <div class="cart-item-total">
                                <span>₺${itemTotal.toLocaleString()}</span>
                            </div>
                            <button class="remove-from-cart-btn" data-index="${index}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>`;
            }).join('')}
                </div>
                <div class="cart-summary">
                    <h3>Sipariş Özeti</h3> 
                    <div class="summary-row">
                        <span>Toplam Tutar:</span>
                        <span class="total-price">₺${total.toLocaleString()}</span>
                    </div>
                    <button class="btn checkout-btn">Ödemeye Geç</button>
                </div>
            `;
        }

        cartItemsContainer.addEventListener('click', (e) => {
            // Hem miktar butonlarını, hem silme butonunu hem de ödeme butonunu dinle
            const target = e.target.closest('.increase-quantity, .decrease-quantity, .remove-from-cart-btn, .checkout-btn');
            if (!target) return;

            let cart = loadCart();
            let itemIndex;

            if (target.classList.contains('checkout-btn')) {
                // Ödeme sayfasına yönlendir
                window.location.href = 'odeme.html';
                return; // Fonksiyonun geri kalanını çalıştırma
            }
            else if (target.classList.contains('remove-from-cart-btn')) {
                itemIndex = parseInt(target.dataset.index);
                cart.splice(itemIndex, 1); // Öğeyi indekse göre sil
            } else {
                const productId = parseInt(target.dataset.id);
                itemIndex = cart.findIndex(item => item.id === productId);
                if (itemIndex === -1) return; // Ürün bulunamadıysa çık

                const productRef = mockProducts.find(p => p.id === productId);
                if (target.classList.contains('increase-quantity')) {
                    // Stok kontrolü
                    if (productRef && cart[itemIndex].quantity < productRef.stock) {
                        cart[itemIndex].quantity++;
                    } else {
                        alert('Bu üründen daha fazla ekleyemezsiniz. Stok yetersiz.');
                    }
                } else if (target.classList.contains('decrease-quantity')) {
                    cart[itemIndex].quantity--;
                    if (cart[itemIndex].quantity <= 0) {
                        cart.splice(itemIndex, 1); // Miktar 0 veya altına düşerse ürünü sepetten çıkar
                    }
                }
            }

            saveCart(cart);
            renderCart(); // Sayfayı yeniden çiz
        });

        renderCart();
    }

    // --- SİPARİŞLERİM SAYFASI İŞLEVLERİ ---
    function handleOrdersPage() {
        const ordersContainer = document.getElementById('orders-container');
        const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
        const currentUser = JSON.parse(localStorage.getItem('user'));

        if (!currentUser) {
            alert('Siparişlerinizi görmek için giriş yapmalısınız.');
            window.location.href = 'login.html';
            return;
        }

        const userOrders = allOrders.filter(order => order.userId === currentUser.email).reverse(); // En yeni siparişler üstte

        if (userOrders.length === 0) {
            ordersContainer.innerHTML = `
                <div class="orders-empty">
                    <h1>Siparişlerim</h1>
                    <p>Henüz hiç sipariş vermediniz.</p>
                    <a href="index.html" class="btn">Alışverişe Başla</a>
                </div>`;
            return;
        }

        ordersContainer.innerHTML = `
            <div class="orders-header-container">
                <h1>Siparişlerim</h1>
            </div>
            <div class="orders-list-container">
                <div class="orders-list">
                    ${userOrders.map(order => `
                        <div class="order-card">
                            <div class="order-header"> 
                                <div>
                                    <strong>Sipariş Tarihi:</strong>
                                <span>${new Date(order.date).toLocaleDateString('tr-TR')}</span>
                            </div>
                            <div>
                                <strong>Sipariş No:</strong>
                                <span>#${order.id}</span>
                            </div>
                             <div>
                                <strong>Sipariş Durumu:</strong>
                                <span class="order-status-${order.status.replace(' ', '-')}">${order.status}</span>
                            </div>
                            <div class="total-price-container">
                                <strong>Toplam Tutar:</strong>
                                <span class="total-price">₺${order.total.toLocaleString()}</span>
                            </div>
                        </div>
                            <div class="order-body">
                                ${order.items.map(item => `
                                    <div class="order-item">
                                        <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null;this.src='placeholder.svg';">
                                        <span>${item.name} (${item.quantity} adet)</span>
                                        <span class="item-price">₺${(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // --- YÖNETİCİ - ÜRÜNLER SAYFASI İŞLEVLERİ ---
    function handleAdminProductsPage() {
        if (!checkAdmin()) return;

        const productListContainer = document.getElementById('admin-product-list');
        const openAddProductModalBtn = document.getElementById('open-add-product-modal-btn');
        const searchInput = document.getElementById('admin-product-search');

        // Modal elementleri
        const productModalOverlay = document.getElementById('product-modal-overlay');
        const productModalTitle = document.getElementById('product-modal-title');
        const productForm = document.getElementById('product-form');
        const productIdToEdit = document.getElementById('product-id-to-edit');
        const productNameInput = document.getElementById('product-name');
        const productPriceInput = document.getElementById('product-price');
        const productStockInput = document.getElementById('product-stock');
        const productCategoryInput = document.getElementById('product-category');
        const productBrandInput = document.getElementById('product-brand');
        const productImageInput = document.getElementById('product-image');
        let currentFilters = {
            search: ''
        };

        function openProductModal(mode, product = null) {
            productModalOverlay.classList.remove('hidden');
            productForm.reset(); // Formu temizle
            productIdToEdit.value = ''; // Düzenlenecek ürün ID'sini sıfırla

            if (mode === 'add') {
                productModalTitle.textContent = 'Yeni Ürün Ekle';
            } else if (mode === 'edit' && product) {
                productModalTitle.textContent = `Ürünü Düzenle: ${product.name}`;
                productIdToEdit.value = product.id;
                productNameInput.value = product.name;
                productPriceInput.value = product.price;
                productStockInput.value = product.stock;
                productCategoryInput.value = product.category;
                productBrandInput.value = product.brand;
                productImageInput.value = product.image;
            }
        }

        function closeProductModal() {
            productModalOverlay.classList.add('hidden');
            productForm.reset();
            productIdToEdit.value = '';
        }

        // Modal kapatma butonuna ve overlay'e tıklama olayları
        productModalOverlay.querySelector('.modal-close-btn').addEventListener('click', closeProductModal);
        productModalOverlay.addEventListener('click', (e) => {
            if (e.target === productModalOverlay) {
                closeProductModal();
            }
        });

        function applyAndRenderProducts() {
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const allProducts = JSON.parse(localStorage.getItem('products')) || [];

            // *** ANA DEĞİŞİKLİK: Sadece mevcut adminin ürünlerini filtrele ***
            let adminProducts = allProducts.filter(p => p.storeEmail === currentUser.email);

            // Arama filtresi
            let filteredProducts = [...adminProducts];
            if (currentFilters.search) {
                filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(currentFilters.search));
            }

            if (filteredProducts.length === 0) {
                productListContainer.innerHTML = '<p>Filtreye uygun ürün bulunamadı veya hiç ürün eklenmemiş.</p>';
                return;
            }

            const tableHTML = `
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Mağaza ID</th>
                            <th>Kategori</th>
                            <th>Ürün Adı</th>
                            <th>Fiyat</th>
                            <th>Stok</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredProducts.map(p => `
                            <tr data-id="${p.id}">
                                <td>${p.storeProductId}</td>
                                <td>${p.category || ''}</td>
                                <td>${p.name}</td>
                                <td>₺${p.price.toLocaleString()}</td>
                                <td><input type="number" class="stock-input" value="${p.stock}" min="0"></td>
                                <td class="admin-product-actions">
                                    <button class="btn edit-product-btn" data-id="${p.id}">Düzenle</button>
                                    <button class="btn update-stock-btn">Stok Güncelle</button>
                                    <button class="btn btn-danger remove-product-btn">Ürünü Kaldır</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;

            productListContainer.innerHTML = tableHTML;
            // Her render sonrası düzenle butonlarına event listener ekle
            productListContainer.querySelectorAll('.edit-product-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = parseInt(e.target.dataset.id);
                    const productToEdit = adminProducts.find(p => p.id === productId); // Sadece kendi ürünleri içinde ara
                    if (productToEdit) {
                        openProductModal('edit', productToEdit);
                    }
                });
            });
        }

        // Yeni Ürün Ekle butonuna tıklama
        if (openAddProductModalBtn) {
            openAddProductModalBtn.addEventListener('click', () => openProductModal('add'));
        }

        // Ürün formu gönderildiğinde (hem ekleme hem düzenleme için)
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const productId = productIdToEdit.value ? parseInt(productIdToEdit.value) : null;
            const productData = {
                name: productNameInput.value,
                price: parseFloat(productPriceInput.value),
                stock: parseInt(productStockInput.value),
                category: productCategoryInput.value,
                brand: productBrandInput.value,
                image: productImageInput.value,
                color: 'Belirtilmedi' // Basitlik için
            };

            let products = JSON.parse(localStorage.getItem('products')) || [];

            if (productId) { // Ürün düzenleme
                const productIndex = products.findIndex(p => p.id === productId);
                if (productIndex > -1) {
                    // storeEmail ve storeProductId'yi koru, diğerlerini güncelle
                    products[productIndex] = { ...products[productIndex], ...productData };
                    alert('Ürün başarıyla güncellendi.');
                }
            } else { // Yeni ürün ekleme
                const currentUser = JSON.parse(localStorage.getItem('user'));
                // Mağazaya ait en yüksek storeProductId'yi bul ve bir artır
                const storeProducts = products.filter(p => p.storeEmail === currentUser.email);
                const maxStoreId = storeProducts.reduce((max, p) => p.storeProductId > max ? p.storeProductId : max, 0);
                const newStoreProductId = maxStoreId + 1;

                // Yeni ürünü o an giriş yapmış olan adminin mağazasına ekle
                products.push({
                    id: Date.now(), // Global benzersiz ID
                    storeProductId: newStoreProductId, // Mağaza içi benzersiz ID
                    ...productData,
                    storeEmail: currentUser.email
                });
                alert('Ürün başarıyla eklendi.');
            }
            localStorage.setItem('products', JSON.stringify(products));
            mockProducts = products; // Çalışma zamanı verisini de güncelle
            closeProductModal();
            applyAndRenderProducts();
        });

        productListContainer.addEventListener('click', (e) => {
            const target = e.target;
            const row = target.closest('tr');
            if (!row) return;

            const productId = parseInt(row.dataset.id);
            let products = JSON.parse(localStorage.getItem('products')) || [];

            if (target.classList.contains('update-stock-btn')) {
                const newStock = parseInt(row.querySelector('.stock-input').value);
                const productIndex = products.findIndex(p => p.id === productId);
                if (productIndex > -1) {
                    products[productIndex].stock = newStock;
                    localStorage.setItem('products', JSON.stringify(products));
                    mockProducts = products;
                    alert('Stok başarıyla güncellendi.');
                    applyAndRenderProducts();
                }
            } else if (target.classList.contains('remove-product-btn')) {
                if (confirm('Bu ürünü kalıcı olarak silmek istediğinizden emin misiniz?')) {
                    products = products.filter(p => p.id !== productId);
                    localStorage.setItem('products', JSON.stringify(products));
                    mockProducts = products;
                    alert('Ürün başarıyla silindi.');
                    applyAndRenderProducts();
                }
            }
        });

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                currentFilters.search = e.target.value.toLowerCase();
                applyAndRenderProducts();
            });
        }

        applyAndRenderProducts();
    }

    // --- YÖNETİCİ - SİPARİŞLER SAYFASI İŞLEVLERİ ---
    function handleAdminOrdersPage() {
        if (!checkAdmin()) return;

        const ordersListContainer = document.getElementById('admin-orders-list');

        function renderAdminOrders() {
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
            const users = loadUsers();

            // *** ANA DEĞİŞİKLİK: Sadece mevcut adminin ürünlerini içeren siparişleri filtrele ***
            const adminOrders = allOrders.filter(order =>
                order.items.some(item => item.storeEmail === currentUser.email)
            );

            if (adminOrders.length === 0) {
                ordersListContainer.innerHTML = '<p>Henüz hiç sipariş yok.</p>';
                return;
            }

            ordersListContainer.innerHTML = adminOrders.reverse().map(order => {
                const user = users.find(u => u.email === order.userId);
                // Siparişin içinden sadece bu mağazaya ait ürünleri göster
                return `
                    <div class="order-card">
                        <div class="order-header">
                            <div><strong>Sipariş No:</strong> #${order.id}</div>
                            <div><strong>Müşteri:</strong> <span class="order-user">${user ? user.name : order.userId}</span></div>
                            <div><strong>Tarih:</strong> ${new Date(order.date).toLocaleDateString('tr-TR')}</div>
                            <div><strong>Toplam:</strong> <span class="total-price">₺${order.total.toLocaleString()}</span></div>
                            <div>
                                <strong>Durum:</strong>
                                <select class="order-status-selector" data-order-id="${order.id}">
                                    <option value="Hazırlanıyor" ${order.status === 'Hazırlanıyor' ? 'selected' : ''}>Hazırlanıyor</option>
                                    <option value="Yolda" ${order.status === 'Yolda' ? 'selected' : ''}>Yolda</option>
                                    <option value="Teslim Edildi" ${order.status === 'Teslim Edildi' ? 'selected' : ''}>Teslim Edildi</option>
                                </select>
                            </div>
                        </div>
                        <div class="order-body">${order.items
                        .filter(item => item.storeEmail === currentUser.email) // Sadece bu mağazanın ürünlerini göster
                        .map(item => `
                                <div class="order-item">
                                    <img src="${item.image}" alt="${item.name}">
                                    <span>${item.name} (${item.quantity} adet)</span>
                                    <span class="item-price">₺${(item.price * item.quantity).toLocaleString()}</span>
                                </div>`
                        ).join('')}
                        </div>
                    </div>`;
            }).join('');
        }

        ordersListContainer.addEventListener('change', (e) => {
            if (e.target.classList.contains('order-status-selector')) {
                const orderId = parseInt(e.target.dataset.orderId);
                const newStatus = e.target.value;
                let allOrders = JSON.parse(localStorage.getItem('orders')) || [];
                const orderIndex = allOrders.findIndex(o => o.id === orderId);
                if (orderIndex > -1) {
                    allOrders[orderIndex].status = newStatus;
                    localStorage.setItem('orders', JSON.stringify(allOrders));
                    alert(`Sipariş #${orderId} durumu "${newStatus}" olarak güncellendi.`);
                    renderAdminOrders(); // Gerekirse yeniden çiz, ama genellikle gerekmez
                }
            }
        });

        renderAdminOrders();
    }

    // --- YÖNETİCİ - DASHBOARD SAYFASI İŞLEVLERİ ---
    function handleAdminDashboardPage() {
        if (!checkAdmin()) return;

        // Değişiklik: Hedefleri güncelle
        const welcomeCard = document.querySelector('.admin-welcome');
        const originalStatsSection = document.querySelector('.stats-cards')?.parentElement;
        const salesChartContainer = document.getElementById('sales-chart-container');

        if (!welcomeCard || !originalStatsSection) return; // Gerekli elementler yoksa çalışma

        // Değişiklik: "Hoş Geldiniz" metnini iki satıra böl
        const welcomeHeader = welcomeCard.querySelector('h1');
        const welcomeSubtext = welcomeCard.querySelector('p');
        if (welcomeHeader && welcomeSubtext) {
            welcomeHeader.textContent = 'Yönetici Paneline';
            welcomeSubtext.textContent = 'Hoş Geldiniz';
        }

        // Orijinal istatistik bölümünü gizle
        originalStatsSection.classList.add('hidden');
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const allOrders = JSON.parse(localStorage.getItem('orders')) || [];

        const adminOrders = allOrders.filter(order =>
            order.items.some(item => item.storeEmail === currentUser.email)
        );

        let totalRevenue = 0;
        const productSales = {};

        adminOrders.forEach(order => {
            order.items.forEach(item => {
                if (item.storeEmail === currentUser.email) {
                    totalRevenue += item.price * item.quantity;
                    productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
                }
            });
        });

        const sortedProducts = Object.entries(productSales)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5);

        const bestSeller = sortedProducts.length > 0 ? sortedProducts[0][0] : "Henüz Yok";
        
        // İstatistik kartları için veri dizisi oluştur
        const statsData = [
            { icon: 'fas fa-wallet', title: 'Toplam Ciro', value: `₺${totalRevenue.toLocaleString()}` },
            { icon: 'fas fa-box-open', title: 'Toplam Sipariş', value: adminOrders.length },
            { icon: 'fas fa-star', title: 'En Çok Satan', value: bestSeller, isText: true }
        ];
        
        // Değişiklik: Dönen kart için yeni bir konteyner oluştur ve "Hoşgeldiniz" kartına ekle
        const rotatingStatsContainer = document.createElement('div');
        rotatingStatsContainer.className = 'welcome-stats-container';
        welcomeCard.appendChild(rotatingStatsContainer);

        let currentStatIndex = 0;

        function updateStatCard() {
            const stat = statsData[currentStatIndex];
            // Değişiklik: Yeni konteynerin içeriğini güncelle
            rotatingStatsContainer.innerHTML = `
                <div class="stat-card rotating">
                    <i class="${stat.icon}"></i>
                    <h3>${stat.title}</h3>
                    <p style="font-size: ${stat.isText ? '1.2rem' : '1.8rem'};">${stat.value}</p>
                </div>
            `;
            // Bir sonraki istatistiğe geç
            currentStatIndex = (currentStatIndex + 1) % statsData.length;
        }

        // İlk kartı göster
        updateStatCard();
        // Her 4 saniyede bir kartı güncelle
        setInterval(updateStatCard, 4000);

        renderSalesChart(sortedProducts);

        function renderSalesChart(productsData) {
            if (productsData.length === 0) {
                salesChartContainer.innerHTML = '<h3>En Çok Satan Ürünler</h3><p>Henüz hiç satış yapılmamış.</p>';
                return;
            }

            const maxQuantity = Math.max(...productsData.map(([, qty]) => qty), 1);

            const chartHTML = `
                <h3>En Çok Satan Ürünler</h3>
                <div class="chart">
                    ${productsData.map(([name, quantity]) => {
                        const barHeight = (quantity / maxQuantity) * 100;
                        return `
                            <div class="chart-bar" style="height: ${barHeight}%;" title="${name} - ${quantity} adet satıldı">
                                <span>${name.substring(0, 10)}...</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;

            salesChartContainer.innerHTML = chartHTML;
        }
    }

});
