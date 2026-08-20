document.addEventListener('DOMContentLoaded', () => {
    const page = window.location.pathname.split("/").pop();

    // Helper functions for localStorage
    const getFromStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];
    const saveToStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));
    const getLoggedInUser = () => localStorage.getItem('loggedInUser');
    const setLoggedInUser = (email) => localStorage.setItem('loggedInUser', email);
    const logoutUser = () => localStorage.removeItem('loggedInUser');

    // Müşteri detay sayfasındaki sıralama durumunu tutar (Tarih, Tutar için)
    let customerDetailSortState = { key: 'date', order: 'desc' };
    // Müşteri detay sayfasındaki işlem tipi filtre durumunu tutar
    let transactionTypeFilterState = 'all'; // 'all', 'income', 'expense'
    // Ana sayfadaki müşteri arama terimini tutar
    let customerSearchTerm = '';

    // Page-based logic
    switch (page) {
        case 'index.html':
        case '': // Root path might also lead here
            initAuthPage();
            break;
        case 'anasayfa.html':
            initMainPage();
            break;
        case 'musteri-ekle.html':
            initAddCustomerPage();
            break;
        case 'musteri-muhasebe.html':
            initCustomerDetailPage();
            break;
    }

    // --- AUTHENTICATION PAGE (index.html) ---
    function initAuthPage() {
        if (getLoggedInUser()) {
            window.location.href = 'anasayfa.html';
            return;
        }

        const loginFormContainer = document.getElementById('login-form-container');
        const registerFormContainer = document.getElementById('register-form-container');
        const showRegisterBtn = document.getElementById('show-register');
        const showLoginBtn = document.getElementById('show-login');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginFormContainer.classList.add('hidden');
            registerFormContainer.classList.remove('hidden');
        });

        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            registerFormContainer.classList.add('hidden');
            loginFormContainer.classList.remove('hidden');
        });

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim(); // Boşlukları temizle
            const password = document.getElementById('login-password').value;
            const users = getFromStorage('users');
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                setLoggedInUser(user.email);
                window.location.href = 'anasayfa.html';
            } else {
                alert('E-posta veya şifre hatalı.');
            }
        });

        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('register-name').value.trim(); // Boşlukları temizle
            const email = document.getElementById('register-email').value.trim(); // Boşlukları temizle
            const password = document.getElementById('register-password').value;
            const users = getFromStorage('users');

            if (users.some(u => u.email === email)) {
                alert('Bu e-posta adresi zaten kullanılıyor.');
                return;
            }

            const newUser = { name, email, password };
            users.push(newUser);
            saveToStorage('users', users);
            
            setLoggedInUser(email);
            alert('Kayıt başarılı! Ana sayfaya yönlendiriliyorsunuz.');
            window.location.href = 'anasayfa.html';
        });
    }

    // --- MAIN PAGE (anasayfa.html) ---
    function initMainPage() {
        const loggedInUser = getLoggedInUser();
        if (!loggedInUser) {
            window.location.href = 'index.html';
            return;
        }

        const logoutBtn = document.getElementById('logout-btn');
        logoutBtn.addEventListener('click', () => {
            logoutUser();
            window.location.href = 'index.html';
        });

        // Event Delegation for delete buttons
        const customerListContainer = document.getElementById('customer-list');
        if (customerListContainer) {
            customerListContainer.addEventListener('click', (e) => {
                const deleteButton = e.target.closest('.delete-customer-btn');
                if (deleteButton) {
                    const customerId = parseInt(deleteButton.dataset.id);
                    if (confirm('Bu müşteriyi ve tüm muhasebe kayıtlarını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
                        deleteCustomerAndTransactions(customerId);
                    }
                }
            });
        }

        // Arama çubuğu için event listener
        const customerSearchInput = document.getElementById('customer-search');
        if (customerSearchInput) {
            customerSearchInput.addEventListener('input', (e) => {
                customerSearchTerm = e.target.value.toLowerCase(); // Arama terimini küçük harfe çevir
                displayCustomers(); // Müşteri listesini yeniden çiz
            });
        }

        displayCustomers();
    }

    function displayCustomers() {
        const customerListContainer = document.getElementById('customer-list');
        if (!customerListContainer) {
            console.error("HATA: 'customer-list' ID'li element anasayfa.html'de bulunamadı. Lütfen tarayıcı önbelleğini temizleyin ve anasayfa.html dosyasını kontrol edin.");
            return;
        }

        const allCustomers = getFromStorage('customers');
        const loggedInUser = getLoggedInUser();
        console.log("displayCustomers: Şu anki giriş yapmış kullanıcı (loggedInUser):", loggedInUser);
        console.log("displayCustomers: localStorage'daki tüm müşteriler (allCustomers):", allCustomers);

        let userCustomers = allCustomers.filter(c => {
            console.log(`displayCustomers: Müşteri ID'si karşılaştırılıyor - Müşteri userId: '${c.userId}', loggedInUser: '${loggedInUser}'`);
            return c.userId === loggedInUser;
        });
        console.log("displayCustomers: Mevcut kullanıcıya ait filtrelenmiş müşteriler (userCustomers):", userCustomers);

        // Arama terimine göre filtreleme
        if (customerSearchTerm) {
            userCustomers = userCustomers.filter(customer =>
                customer.name.toLowerCase().includes(customerSearchTerm) ||
                customer.profession.toLowerCase().includes(customerSearchTerm)
            );
        }
        if (userCustomers.length === 0) {
            customerListContainer.innerHTML = '<p>Henüz müşteri eklenmemiş. "Yeni Müşteri Ekle" butonu ile ilk müşterinizi ekleyebilirsiniz.</p>';
        } else {
            customerListContainer.innerHTML = userCustomers.map(customer => `
                <div class="customer-card">
                    <div class="card-content" onclick="window.location.href='musteri-muhasebe.html?id=${customer.id}'">
                        <h3>${customer.name}</h3>
                        <p class="profession">${customer.profession}</p>
                    </div>
                    <div class="card-footer">
                        <span>ID: ${customer.id}</span>
                        <button class="btn btn-danger btn-small delete-customer-btn" data-id="${customer.id}">Sil</button>
                    </div>
                </div>
            `).join('');
        }
    }

    function deleteCustomerAndTransactions(customerId) {
        // Müşteriyi sil
        let customers = getFromStorage('customers');
        saveToStorage('customers', customers.filter(c => c.id !== customerId));

        // Müşteriye ait işlemleri sil
        let transactions = getFromStorage('transactions');
        saveToStorage('transactions', transactions.filter(t => t.customerId !== customerId));

        displayCustomers(); // Sayfadaki listeyi yenile
    }

    // --- ADD CUSTOMER PAGE (musteri-ekle.html) ---
    function initAddCustomerPage() {
        const loggedInUser = getLoggedInUser();
        if (!loggedInUser) {
            window.location.href = 'index.html';
            return;
        }

        const addCustomerForm = document.getElementById('add-customer-form');
        const customerIdInput = document.getElementById('customer-id');
        const newId = Date.now();

        // Hatanın oluştuğu yer burası. `customerIdInput` null ise .value özelliğine erişilemez.
        // Elementin varlığını kontrol ederek hatayı önleyebiliriz.
        if (customerIdInput) {
            customerIdInput.value = newId;
        } else {
            // Element bulunamazsa, bu durumun nedenini anlamak için konsola bir hata mesajı yazdıralım.
            // Bu genellikle HTML dosyasındaki bir yazım hatasından kaynaklanır.
            console.error("Hata: 'customer-id' ID'li element 'musteri-ekle.html' dosyasında bulunamadı. Lütfen HTML dosyasını kontrol edin.");
        }

        addCustomerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('customer-name').value.trim(); // Boşlukları temizle
            const profession = document.getElementById('customer-profession').value.trim(); // Boşlukları temizle
            
            const newCustomer = {
                // Not: newId, sayfa yüklendiğinde bir kez oluşturulur.
                // Eğer sayfa yenilenmeden birden fazla müşteri eklenirse,
                // hepsi aynı ID'ye sahip olur. Gerçek bir uygulamada,
                // ID'nin form gönderildiğinde oluşturulması veya benzersizlik garantisi verilmesi gerekir.
                id: newId,
                name,
                profession,
                userId: loggedInUser
            };

            const customers = getFromStorage('customers');
            console.log("initAddCustomerPage: Eklenmeye çalışılan yeni müşteri:", newCustomer);
            console.log("initAddCustomerPage: Ekleme öncesi localStorage'daki müşteriler:", customers);
            customers.push(newCustomer);
            saveToStorage('customers', customers);
            console.log("initAddCustomerPage: Ekleme sonrası localStorage'daki müşteriler:", getFromStorage('customers'));
            alert('Müşteri başarıyla eklendi.');
            window.location.href = 'anasayfa.html';
        });
    }

    // --- CUSTOMER DETAIL PAGE (musteri-muhasebe.html) ---
    function initCustomerDetailPage() {
        const loggedInUser = getLoggedInUser();
        if (!loggedInUser) {
            window.location.href = 'index.html';
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const customerId = parseInt(params.get('id'));

        if (!customerId) {
            alert('Müşteri bulunamadı.');
            window.location.href = 'anasayfa.html';
            return;
        }

        // Sayfa yüklendiğinde sıralama ve filtre durumunu sıfırla
        customerDetailSortState = { key: 'date', order: 'desc' };
        transactionTypeFilterState = 'all';
        loadCustomerData(customerId);

        // İşlem silme butonu dinleyicisini kur
        setupTransactionDeleteListener(customerId);

        // --- Müşteri Bilgilerini Düzenleme Mantığı ---
        const infoDisplay = document.getElementById('customer-info-display');
        const editFormContainer = document.getElementById('customer-info-edit-form');
        const editBtn = document.getElementById('edit-customer-btn');
        const cancelBtn = document.getElementById('cancel-edit-btn');
        const editForm = document.getElementById('edit-customer-form');

        if (editBtn) {
            editBtn.addEventListener('click', () => {
                infoDisplay.classList.add('hidden');
                editFormContainer.classList.remove('hidden');
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                editFormContainer.classList.add('hidden');
                infoDisplay.classList.remove('hidden');
            });
        }

        if (editForm) {
            editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                handleSaveCustomerDetails(customerId, editFormContainer, infoDisplay);
            });
        }

        // --- PDF İndirme Butonu ---
        const downloadPdfBtn = document.getElementById('download-pdf-btn');
        if (downloadPdfBtn) {
            downloadPdfBtn.addEventListener('click', () => {
                generateCustomerDetailPdf(customerId);
            });
        }


        // --- Sıralama ve Filtreleme Mantığı ---
        const transactionTableHead = document.querySelector('.transaction-list table thead');
        if (transactionTableHead) {
            transactionTableHead.addEventListener('click', (e) => {
                const header = e.target.closest('th[data-sort]');
                if (!header) return;

                const sortKey = header.dataset.sort;

                if (sortKey === 'type') {
                    // Filtre durumunu döngüsel olarak değiştir: all -> income -> expense -> all
                    if (transactionTypeFilterState === 'all') {
                        transactionTypeFilterState = 'income';
                    } else if (transactionTypeFilterState === 'income') {
                        transactionTypeFilterState = 'expense';
                    } else { // mevcut durum 'expense'
                        transactionTypeFilterState = 'all';
                    }
                } else {
                    // Diğer sütunlar için sıralama mantığı
                    if (customerDetailSortState.key === sortKey) {
                        customerDetailSortState.order = customerDetailSortState.order === 'asc' ? 'desc' : 'asc';
                    } else {
                        customerDetailSortState.key = sortKey;
                        customerDetailSortState.order = 'desc';
                    }
                }
                
                loadCustomerData(customerId);
            });
        }

        // --- Yeni İşlem Ekleme Formu Görünürlüğü ---
        const showAddTransactionFormBtn = document.getElementById('show-add-transaction-form-btn');
        const transactionFormContainer = document.getElementById('transaction-form-container');
        const cancelAddTransactionBtn = document.getElementById('cancel-add-transaction-btn');

        if (showAddTransactionFormBtn) {
            showAddTransactionFormBtn.addEventListener('click', () => {
                transactionFormContainer.classList.remove('hidden');
                // İsteğe bağlı: Forma odaklanmak veya sayfayı forma kaydırmak için
                transactionFormContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }

        if (cancelAddTransactionBtn) {
            cancelAddTransactionBtn.addEventListener('click', () => {
                transactionFormContainer.classList.add('hidden');
            });
        }

        const transactionForm = document.getElementById('add-transaction-form');
        transactionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const description = document.getElementById('transaction-description').value;
            const amount = parseFloat(document.getElementById('transaction-amount').value);
            const type = document.getElementById('transaction-type').value;

            if (isNaN(amount) || amount <= 0) {
                alert('Lütfen geçerli bir tutar girin.');
                return;
            }

            const newTransaction = {
                id: Date.now(),
                customerId: customerId,
                description,
                amount,
                type,
                date: new Date().toISOString()
            };

            const transactions = getFromStorage('transactions');
            transactions.push(newTransaction);
            saveToStorage('transactions', transactions);

            transactionForm.reset();
            transactionFormContainer.classList.add('hidden'); // İşlem eklendikten sonra formu gizle
            loadCustomerData(customerId); // Refresh data on the page
        });
    }

    function deleteTransaction(transactionId, customerId) {
        if (!confirm('Bu işlemi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
            return;
        }

        let transactions = getFromStorage('transactions');
        transactions = transactions.filter(t => t.id !== transactionId);
        saveToStorage('transactions', transactions);

        alert('İşlem başarıyla silindi.');
        loadCustomerData(customerId); // Sayfadaki verileri ve bakiyeyi yenile
    }


    function handleSaveCustomerDetails(customerId, formContainer, displayContainer) {
        const newName = document.getElementById('edit-customer-name').value.trim();
        const newProfession = document.getElementById('edit-customer-profession').value.trim();

        if (!newName || !newProfession) {
            alert('Lütfen tüm alanları doldurun.');
            return;
        }

        let customers = getFromStorage('customers');
        const customerIndex = customers.findIndex(c => c.id === customerId);

        if (customerIndex > -1) {
            customers[customerIndex].name = newName;
            customers[customerIndex].profession = newProfession;
            saveToStorage('customers', customers);
            loadCustomerData(customerId); // Sayfadaki verileri yenile
            formContainer.classList.add('hidden');
            displayContainer.classList.remove('hidden');
            alert('Müşteri bilgileri başarıyla güncellendi.');
        }
    }

    function generateCustomerDetailPdf(customerId) {
        const customer = getFromStorage('customers').find(c => c.id === customerId);
        if (!customer) {
            alert('Müşteri bulunamadı.');
            return;
        }

        // PDF'e dahil edilmesini istemediğimiz elementleri seç
        const editCustomerBtn = document.getElementById('edit-customer-btn');
        const transactionFormContainer = document.getElementById('transaction-form-container');
        const customerInfoEditForm = document.getElementById('customer-info-edit-form');
        const customerInfoDisplay = document.getElementById('customer-info-display');

        // PDF oluşturulurken geçici olarak gizlenecek elementleri topla
        const elementsToTemporarilyHide = [];
        
        // "Bilgileri Düzenle" butonunu her zaman gizle
        if (editCustomerBtn) {
            elementsToTemporarilyHide.push(editCustomerBtn);
        }
        // "Yeni İşlem Ekle" formunu her zaman gizle
        if (transactionFormContainer) {
            elementsToTemporarilyHide.push(transactionFormContainer);
        }

        // Müşteri bilgileri düzenleme formu açık mıydı kontrol et
        let wasEditFormActive = false;
        if (customerInfoEditForm && !customerInfoEditForm.classList.contains('hidden')) {
            wasEditFormActive = true;
            elementsToTemporarilyHide.push(customerInfoEditForm); // Düzenleme formunu PDF için gizle
            // Eğer düzenleme formu açıksa, PDF'te müşteri bilgilerinin görünmesi için display div'ini göster
            if (customerInfoDisplay) {
                customerInfoDisplay.classList.remove('hidden');
            }
        }

        // Elementlerin orijinal 'hidden' sınıf durumlarını sakla ve PDF için gizle
        const originalHiddenStates = new Map();
        elementsToTemporarilyHide.forEach(el => {
            originalHiddenStates.set(el, el.classList.contains('hidden')); // Orijinal durumu kaydet
            el.classList.add('hidden'); // PDF için gizle
        });

        // PDF'e dönüştürülecek ana içeriği seç
        const element = document.getElementById('pdf-content');

        // html2pdf için seçenekler
        const options = {
            margin: 10,
            filename: `${customer.name.replace(/\s/g, '_')}_Muhasebe_Detaylari.pdf`, // Dosya adını müşteri adına göre ayarla
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2, 
                logging: false, 
                dpi: 192, 
                letterRendering: true,
                // ignoreElements: (element) => element.classList.contains('no-print') // Alternatif: CSS sınıfı ile gizleme
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(options).from(element).save().then(() => { // PDF oluşturulduktan sonra
            // Gizlenen elementlerin orijinal durumlarını geri yükle
            elementsToTemporarilyHide.forEach(el => {
                if (!originalHiddenStates.get(el)) { // Eğer orijinalde gizli değilse, tekrar göster
                    el.classList.remove('hidden');
                } else { // Eğer orijinalde gizliyse, gizli kalsın
                    el.classList.add('hidden');
                }
            });

            // Eğer düzenleme formu PDF oluşturulmadan önce açıksa, eski durumuna geri döndür
            if (wasEditFormActive) {
                if (customerInfoEditForm) customerInfoEditForm.classList.remove('hidden'); // Düzenleme formunu tekrar göster
                if (customerInfoDisplay) customerInfoDisplay.classList.add('hidden'); // Müşteri bilgilerini tekrar gizle
            }
        });
    }

    // --- İşlem Silme Butonu Olay Dinleyicisi (Event Delegation) ---
    // initCustomerDetailPage içinde çağrılacak
    function setupTransactionDeleteListener(customerId) {
        const transactionTableBody = document.getElementById('transaction-table-body');
        if (transactionTableBody) {
            transactionTableBody.addEventListener('click', (e) => {
                const deleteBtn = e.target.closest('.delete-transaction-btn');
                if (deleteBtn) {
                    const transactionId = parseInt(deleteBtn.dataset.id);
                    deleteTransaction(transactionId, customerId);
                }
            });
        }
    }
        

    

    

    function loadCustomerData(customerId) {
        const customers = getFromStorage('customers');
        const customer = customers.find(c => c.id === customerId);

        if (!customer) {
            alert('Müşteri bilgileri yüklenemedi.');
            window.location.href = 'anasayfa.html';
            return;
        }

        // Müşteri bilgilerini ve düzenleme formunu doldur
        document.getElementById('customer-name-header').textContent = customer.name;
        document.getElementById('customer-profession-display').textContent = customer.profession;
        document.getElementById('edit-customer-name').value = customer.name;
        document.getElementById('edit-customer-profession').value = customer.profession;

        document.title = `${customer.name} - Detaylar`; // Sayfa başlığını güncelle

        const allTransactions = getFromStorage('transactions');
        let customerTransactions = allTransactions.filter(t => t.customerId === customerId);

        // --- Tipe Göre Filtreleme ---
        if (transactionTypeFilterState !== 'all') {
            customerTransactions = customerTransactions.filter(t => t.type === transactionTypeFilterState);
        }

        let totalIncome = 0;
        let totalExpense = 0;

        // --- Sıralama ---
        customerTransactions.sort((a, b) => {
            const key = customerDetailSortState.key;
            const order = customerDetailSortState.order;
            let valA, valB;

            if (key === 'date') {
                valA = new Date(a.date);
                valB = new Date(b.date);
            } else if (key === 'amount') {
                valA = a.amount;
                valB = b.amount;
            } else {
                // 'type' artık burada sıralanmıyor.
                return 0;
            }

            if (valA < valB) return order === 'asc' ? -1 : 1;
            if (valA > valB) return order === 'asc' ? 1 : -1;
            return 0;
        });

        customerTransactions.forEach(t => {
            if (t.type === 'income') {
                totalIncome += t.amount;
            } else {
                totalExpense += t.amount;
            }
        });

        const balance = totalIncome - totalExpense;

        const formatCurrency = (amount) => `${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} ₺`;

        document.getElementById('total-income').textContent = formatCurrency(totalIncome);
        document.getElementById('total-expense').textContent = formatCurrency(totalExpense);
        document.getElementById('balance').textContent = formatCurrency(balance);

        const tableBody = document.getElementById('transaction-table-body');
        tableBody.innerHTML = customerTransactions
            .map(t => `
                <tr>
                    <td>${new Date(t.date).toLocaleDateString('tr-TR')}</td>
                    <td>${t.description}</td>
                    <td class="transaction-type-${t.type}">${formatCurrency(t.amount)}</td>
                    <td>${t.type === 'income' ? 'Gelir' : 'Gider'}</td>
                    <td><button class="btn btn-danger btn-small delete-transaction-btn" data-id="${t.id}">Sil</button></td>
                </tr>
            `).join('');
        
        // --- Tablo Başlığındaki Göstergeleri ve Metinleri Güncelle ---
        document.querySelectorAll('th[data-sort]').forEach(th => {
            const sortKey = th.dataset.sort;
            // Metni ve class'ları sıfırla
            th.classList.remove('sort-asc', 'sort-desc');
            if (sortKey === 'date') {
                th.textContent = 'Tarih';
            } else if (sortKey === 'amount') {
                th.textContent = 'Tutar';
            } else if (sortKey === 'type') {
                // 'type' için varsayılan metin
                th.textContent = 'Tip (Tümü)';
            }

            // Aktif sıralama sütunu ise, metni ve class'ı güncelle
            if (sortKey !== 'type' && sortKey === customerDetailSortState.key) {
                th.classList.add(`sort-${customerDetailSortState.order}`);
                
                if (sortKey === 'date') {
                    th.textContent = customerDetailSortState.order === 'desc' 
                        ? 'Tarih (En yeniden en eskiye)' 
                        : 'Tarih (En eskiden en yeniye)';
                } else if (sortKey === 'amount') {
                    th.textContent = customerDetailSortState.order === 'desc'
                        ? 'Tutar (En çoktan en aza)'
                        : 'Tutar (En azdan en çoğa)';
                }
            }

            // 'type' sütunu için filtre metnini güncelle
            if (sortKey === 'type') {
                if (transactionTypeFilterState === 'income') {
                    th.textContent = 'Tip (Sadece Gelir)';
                } else if (transactionTypeFilterState === 'expense') {
                    th.textContent = 'Tip (Sadece Gider)';
                }
            }
        });
    }
});