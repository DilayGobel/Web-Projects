const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let isError = false;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const buttonValue = button.value;
        const displayValue = display.textContent;

        // "C" butonuna basıldığında ekranı temizle
        if (button.id === 'clear') {
            display.textContent = '0';
            isError = false;
            return;
        }

        // "=" butonuna basıldığında hesaplama yap
        if (button.id === 'equals') {
            if (isError) return;
            try {
                const expression = displayValue.replace(/x/g, '*');
                const result = eval(expression);
                
                // Sonucun çok uzunsa bilimsel gösterim 
                display.textContent = result.toString().length > 10 ? result.toExponential(5) : result;
            } catch (error) {
                display.textContent = 'Hata';
                isError = true;
            }
            return;
        }

        // Eğer ekranda '0' veya 'Hata' yazıyorsa, yeni basılan değerle değiştir
        if (displayValue === '0' || isError) {
            display.textContent = buttonValue;
            isError = false;
        } else {
            // Değilse, basılan değeri mevcut ifadenin sonuna ekle
            display.textContent += buttonValue;
        }
    });
});