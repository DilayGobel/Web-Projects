function diziYazdirmaIslemleri() {
    const uzunluk = parseInt(prompt("Lütfen oluşturmak istediğiniz dizinin uzunluğunu girin:"));

    if (isNaN(uzunluk) || uzunluk <= 0) {
        alert("Geçersiz uzunluk! Lütfen 0'dan büyük bir sayı girin.");
        return; // Fonksiyonu sonlandır
    }

    //diziyi yazdırma
    const kullaniciDizisi = [];
    for (let i = 0; i < uzunluk; i++) {
        const eleman = prompt(`Dizinin ${i + 1}. elemanını girin:`);
        kullaniciDizisi.push(eleman);
    }

    alert(`Oluşturduğunuz Dizi: [${kullaniciDizisi.join(', ')}]`);

    //diziyi ters çevirme
    const tersDizi = [];
   
    for (let i = kullaniciDizisi.length - 1; i >= 0; i--) {
        tersDizi.push(kullaniciDizisi[i]);
    }

    alert(`Dizinin Tersi: [${tersDizi.join(', ')}]`);
}

diziYazdirmaIslemleri();

