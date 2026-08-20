# 🚀 Web Geliştirme Staj Projeleri

Bu depo, yaz stajı süresince geliştirilen 5 farklı web projesini içermektedir. Projelerin bağımsız yapısını korumak ve modüler bir mimari sunmak amacıyla her proje **ayrı bir Git branch'inde** izole edilmiştir.

---

## 📌 Proje & Branch Tablosu

| Proje Adı | Branch Adı | Temel Odak Noktaları |
| :--- | :--- | :--- |
| **Portfolyo Sitesi** | `Project-Portfolyo` | Modern UI/UX, Responsive Grid, Kişisel Vitrin |
| **Haber Sitesi** | `Project-Haber` | Kategori Filtreleme, Dinamik İçerik, Manşet Akışı |
| **Blog Sitesi** | `Project-Blog` | Okuma Odaklı Tipografi, Etiketleme, İçerik Hiyerarşisi |
| **To Do & Pomodoro** | `Project-Todo-Pomodoro` | DOM Manipülasyonu, Zamanlayıcı Mantığı, LocalStorage |
| **E-Ticaret Sitesi** | `Project-Eticaret` | Dinamik Sepet Yönetimi, Ürün Filtreleme, State Mantığı |

---

## 🛠️ Proje Detayları

**1. Portfolyo Sitesi (`Project-Portfolyo`)**
* Yeteneklerin, projelerin ve deneyimlerin sergilendiği kişisel tanıtım platformu.
* **Öne Çıkanlar:** Mobil uyumlu menü mimarisi, interaktif proje kartları, modern CSS animasyonları ve responsive layout.

**2. Haber Sitesi (`Project-Haber`)**
* Güncel haberlerin kategorilere ayrılarak kullanıcıya sunulduğu dinamik haber arayüzü.
* **Öne Çıkanlar:** Kategori bazlı listeleme (Teknoloji, Gündem, Spor), manşet slider bileşeni ve haber detay görünümleri.

**3. Blog Sitesi (`Project-Blog`)**
* Makale ve rehberlerin temiz bir tipografiyle sunulduğu minimalist blog arayüzü.
* **Öne Çıkanlar:** Okuma süresi göstergesi, etiket/yazar filtreleme mekanizması ve esnek grid düzeni.

**4. To Do & Pomodoro Sitesi (`Project-Todo-Pomodoro`)**
* Görev yönetimi ile odaklanma tekniğini birleştiren üretkenlik aracı.
* **Öne Çıkanlar:** Dinamik görev ekleme/düzenleme/silme, 25/5 dakikalık Pomodoro sayacı, durum filtreleri ve verilerin tarayıcıda kalıcılığı (`LocalStorage`).

**5. E-Ticaret Sitesi (`Project-Eticaret`)**
* Ürün sergileme ve alışveriş süreçlerini simüle eden dinamik mağaza ön yüzü.
* **Öne Çıkanlar:** Ürün filtreleme/arama, sepete ekleme/çıkarma, anlık fiyat ve miktar hesaplama, dinamik sepet modalı.

---

## 💻 Kurulum ve Projeler Arası Geçiş

Herhangi bir projeyi yerel ortamınızda görüntülemek için ilgili branch'e geçiş yapmanız yeterlidir:

```bash
# Repoyu klonlayın
git clone (https://github.com/DilayGobel/Web-Projects.git)
cd Web Projects

# Tüm branch'leri listeleyin
git branch -a

# İncelemek istediğiniz projenin branch'ine geçin
git checkout Project-Portfolyo
# ya da
git checkout Project-E_Ticaret
