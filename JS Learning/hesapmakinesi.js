//hesaplama için fonksiyonlar
function topla(sayi1, sayi2) {
    return sayi1 + sayi2;
}

function cikar(sayi1, sayi2) {
    return sayi1 - sayi2;
}

function carp(sayi1, sayi2) {
    return sayi1 * sayi2;
}

function bol(sayi1, sayi2) {
    if (sayi2 === 0) {
        return "Hata: Bir sayı 0'a bölünemez!";
    }
    return sayi1 / sayi2;
}

// kullanıcıdan veri alma
const kullaniciSayi1 = parseFloat(prompt("Lütfen birinci sayıyı giriniz:"));
const kullaniciSayi2 = parseFloat(prompt("Lütfen ikinci sayıyı giriniz:"));
const islem = prompt("Yapmak istediğiniz işlemi seçin (+, -, *, /):");

let sonuc;

switch (islem) {
    case '+': sonuc = topla(kullaniciSayi1, kullaniciSayi2); break;
    case '-': sonuc = cikar(kullaniciSayi1, kullaniciSayi2); break;
    case '*': sonuc = carp(kullaniciSayi1, kullaniciSayi2); break;
    case '/': sonuc = bol(kullaniciSayi1, kullaniciSayi2); break;
    default: sonuc = "Geçersiz işlem girdiniz. Lütfen +, -, *, / operatörlerinden birini kullanın."; break;
}

alert("İşleminizin Sonucu: " + sonuc);
console.log("İşleminizin Sonucu: " + sonuc);

