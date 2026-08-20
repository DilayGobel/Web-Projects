document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('#iletisim-formu');

    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault(); 

            alert('Mesajınız iletilmiştir.');

            // Formdaki alanları temizle
            contactForm.reset();
        });
    }
    
    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', () => {
            // Sayfa 10 pikselden fazla aşağı kaydırıldıysa
            if (window.scrollY > 10) {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)'; //gölge ekle
            } else {
                header.style.boxShadow = 'none'; //gölgeyi kaldır
            }
        });
    }
});