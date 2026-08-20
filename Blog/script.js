document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    const rootPath = '/HAFTA_1_Blog_Sitesi/';

    // --- Veri Yönetimi (localStorage) ---
    const getBlogs = () => {
        return JSON.parse(localStorage.getItem('blogs')) || [];
    };

    const saveBlogs = (blogs) => {
        localStorage.setItem('blogs', JSON.stringify(blogs));
    };

    // --- Sayfa Yönlendirmesi ---
    if (path.endsWith('index.html') || path === '/' || path.endsWith(rootPath)) {
        displayBlogs();
        setupSlider();
    } else if (path.endsWith('blog-ekle.html')) {
        setupBlogForm();
    } else if (path.endsWith('blog-duzenle.html')) {
        setupBlogEditForm();
    } else if (path.endsWith('blog-detay.html')) {
        displayBlogDetail();
    }

    // --- Genel Event Listeners (Event Delegation) ---
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('delete-btn')) {
            const blogId = e.target.getAttribute('data-id');
            if (confirm('Bu blogu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
                deleteBlog(parseInt(blogId));
            }
        }
    });

    function deleteBlog(id) {
        let blogs = getBlogs();
        blogs = blogs.filter(blog => blog.id !== id);
        saveBlogs(blogs);
        alert('Blog başarıyla silindi.');
        // Kullanıcıyı ana sayfaya yönlendirerek listeyi yenile
        window.location.href = 'index.html';
    }

    // --- ANA SAYFA FONKSİYONLARI ---
    function displayBlogs() {
        const blogList = document.getElementById('blog-list');
        const noBlogsMessage = document.getElementById('no-blogs-message');
        const blogs = getBlogs();

        if (blogs.length === 0) {
            noBlogsMessage.style.display = 'block';
            blogList.innerHTML = ''; // Listeyi temizle
        } else {
            noBlogsMessage.style.display = 'none';
            blogList.innerHTML = blogs.map(blog => `
                <div class="blog-card">
                    <h3>${escapeHTML(blog.title)}</h3>
                    <p>${escapeHTML(blog.topic)}</p>
                    <div class="blog-meta">
                        <span class="blog-meta-item">
                            <strong>Yazar:</strong> ${escapeHTML(blog.author || 'Bilinmiyor')}
                        </span>
                        <span class="blog-meta-item">
                            <strong>Tarih:</strong> ${formatDate(blog.createdAt)}
                        </span>
                    </div>
                    <div class="blog-card-footer">
                        <a href="blog-detay.html?id=${blog.id}" class="read-more">Devamını Oku</a>
                        <a href="blog-duzenle.html?id=${blog.id}" class="edit-btn">Düzenle</a>
                        <button class="delete-btn" data-id="${blog.id}">Sil</button>
                    </div>
                </div>
            `).join('');
        }
    }

    function formatDate(dateString) {
        if (!dateString) return 'Tarih Yok';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('tr-TR', options);
    }
    
    function setupSlider() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const blogList = document.getElementById('blog-list');
        const blogs = getBlogs();
        
        // Ekranda 3 veya daha az kart varsa veya hiç kart yoksa slider butonlarını gizle
        if (blogs.length <= 3) { 
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            if (blogs.length > 0) {
                blogList.style.justifyContent = 'center';
            }
            return;
        }

        if (prevBtn) prevBtn.style.display = 'block';
        if (nextBtn) nextBtn.style.display = 'block';

        let currentIndex = 0;

        nextBtn.addEventListener('click', () => {
            // Görünen 3 karttan sonra hala kart varsa kaydır
            if (currentIndex < blogs.length - 3) {
                currentIndex++;
                updateSliderPosition();
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSliderPosition();
            }
        });

        function updateSliderPosition() {
            const card = blogList.querySelector('.blog-card');
            if (!card) return; // Güvenlik kontrolü
            
            const cardWidth = card.offsetWidth;
            const gap = 20; // CSS'teki gap değeri
            const moveAmount = (cardWidth + gap) * currentIndex;
            blogList.style.transform = `translateX(-${moveAmount}px)`;
        }
    }

    // --- BLOG EKLEME SAYFASI FONKSİYONLARI ---
    function setupBlogForm() {
        const form = document.getElementById('add-blog-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const title = document.getElementById('blog-title').value;
            const topic = document.getElementById('blog-topic').value;
            const author = document.getElementById('blog-author').value;
            const content = document.getElementById('blog-content').value;

            const newBlog = {
                id: Date.now(), // Basit bir unique ID
                title: title,
                topic: topic,
                author: author,
                createdAt: new Date().toISOString(), // Oluşturulma tarihini ISO formatında sakla
                content: content
            };

            const blogs = getBlogs();
            blogs.unshift(newBlog); // Yeni blogu en başa ekle
            saveBlogs(blogs);

            alert('Blog başarıyla yayınlandı!');
            
            window.location.href = 'index.html'; // Ana sayfaya yönlendir
        });
    }

    // --- BLOG DÜZENLEME SAYFASI FONKSİYONLARI ---
    function setupBlogEditForm() {
        const form = document.getElementById('edit-blog-form');
        const titleInput = document.getElementById('blog-title');
        const topicInput = document.getElementById('blog-topic');
        const authorInput = document.getElementById('blog-author');
        const contentInput = document.getElementById('blog-content');

        const params = new URLSearchParams(window.location.search);
        const blogId = parseInt(params.get('id'));

        const blogs = getBlogs();
        const blogToEdit = blogs.find(b => b.id === blogId);

        if (!blogToEdit) {
            alert('Düzenlenecek blog bulunamadı.');
            window.location.href = 'index.html';
            return;
        }

        // Formu mevcut blog verileriyle doldur
        titleInput.value = blogToEdit.title;
        topicInput.value = blogToEdit.topic;
        authorInput.value = blogToEdit.author || '';
        contentInput.value = blogToEdit.content;
        document.title = `Düzenle: ${blogToEdit.title}`;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Blog nesnesini güncelle
            blogToEdit.title = titleInput.value;
            blogToEdit.topic = topicInput.value;
            blogToEdit.author = authorInput.value;
            blogToEdit.content = contentInput.value;

            // Dizideki eski blogu güncellenmiş olanla değiştir
            const blogIndex = blogs.findIndex(b => b.id === blogId);
            if (blogIndex > -1) {
                blogs[blogIndex] = blogToEdit;
            }

            saveBlogs(blogs);
            alert('Blog başarıyla güncellendi!');
            window.location.href = 'index.html';
        });
    }

    // --- BLOG DETAY SAYFASI FONKSİYONLARI ---
    function displayBlogDetail() {
        const blogDetailContent = document.getElementById('blog-detail-content');
        const blogActions = document.getElementById('blog-actions');
        const params = new URLSearchParams(window.location.search);
        const blogId = parseInt(params.get('id'));

        const blogs = getBlogs();
        const blog = blogs.find(b => b.id === blogId);

        if (blog) {
            document.title = blog.title; // Sayfa başlığını blog başlığı ile güncelle
            blogDetailContent.innerHTML = `
                <div class="blog-title">${escapeHTML(blog.title)}</div>
                <div class="blog-meta-detail">
                    <span class="blog-meta-item">
                        <strong>Yazar:</strong> ${escapeHTML(blog.author || 'Bilinmiyor')}
                    </span>
                    <span class="blog-meta-item">
                        <strong>Yayınlanma Tarihi:</strong> ${formatDate(blog.createdAt)}
                    </span>
                </div>
                <p class="blog-full-content">${escapeHTML(blog.content)}</p>
            `;
            if (blogActions) {
                blogActions.innerHTML = `
                    <a href="blog-duzenle.html?id=${blog.id}" class="edit-btn">Düzenle</a>
                    <button class="delete-btn" data-id="${blog.id}">Sil</button>
                `;
            }
        } else {
            blogDetailContent.innerHTML = `<h2>Blog bulunamadı!</h2><p>Aradığınız blog mevcut değil veya silinmiş olabilir.</p>`;
        }
    }
    
    // Güvenlik için basit bir HTML temizleme fonksiyonu
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }
});