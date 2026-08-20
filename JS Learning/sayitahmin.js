function sayiTahminOyunu() {
    const min = 1;
    const max = 10;
    const dogruSayi = Math.floor(Math.random() * (max - min + 1)) + min; //tutulan sayı
    
    let tahminHakki = 3;
    let kazandi = false;

    console.log("Doğru Sayı:", dogruSayi); // Test için doğru sayıyı konsola yazdır

    alert("Sayı Tahmin Oyununa Hoş Geldin! 1 ile 10 arasında bir sayı tuttum. Bakalım 3 denemede bulabilecek misin?");

    // tahmin hakkı bitene kadar oyunu devam ettirme
    while (tahminHakki > 0) {
        const kullaniciTahmini = parseInt(prompt(`Kalan Hakkınız: ${tahminHakki}\nLütfen tahmininizi girin (1-10):`));

        // Geçersiz bir giriş yapılıp yapılmadığını kontrol etme
        if (isNaN(kullaniciTahmini)) {
            alert("Lütfen geçerli bir sayı girin.");
            continue; // Döngünün bu adımını atla ve bir sonrakine geç
        }

        // Girilen sayının belirtilen aralıkta olup olmadığını kontrol etme
        if (kullaniciTahmini < min || kullaniciTahmini > max) {
            alert(`Lütfen ${min} ile ${max} arasında bir sayı girin.`);
            continue; 
        }

        tahminHakki--;

        if (kullaniciTahmini === dogruSayi) {
            alert(`Tebrikler! Doğru sayıyı ${3 - tahminHakki}. denemede buldunuz. Sayı: ${dogruSayi}`);
            kazandi = true;
            break; // Doğru tahmin
        } else if (kullaniciTahmini < dogruSayi) {
            alert("Daha yüksek bir sayı deneyin.");
        } else {
            alert("Daha düşük bir sayı deneyin.");
        }
    }

    // Oyun sonucu
    if (!kazandi) {
        alert(`Maalesef hakkınız bitti. Doğru sayı ${dogruSayi} idi. Tekrar denemek için sayfayı yenileyin.`);
    }
}
sayiTahminOyunu();
