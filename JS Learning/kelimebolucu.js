function kelimeBolme() {
    // kelime alma
    const kelime = prompt("Lütfen harflerine ayırmak istediğiniz bir kelime girin:");

    // bir şey girilip girilmediği kontrolü
    // .trim() ile kullanıcının sadece boşluk girmesi engellenir.
    if (!kelime || kelime.trim() === "") {
        alert("Geçerli bir kelime girmediniz!");
        return; 
    }

    //Kelimeyi harflerine ayırma 
    const harfler = kelime.split('');

    console.log(`'${kelime}' kelimesinin harfleri:`, harfler);
    alert(`Girdiğiniz kelimenin harfleri: [${harfler.join(', ')}]`);
}

kelimeBolme();
