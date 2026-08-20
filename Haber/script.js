document.addEventListener('DOMContentLoaded', () => {

    const mainSlider = document.querySelector('.main-slider-wrapper');
    if (mainSlider) {
        const prevBtn = document.getElementById('main-prev-btn');
        const nextBtn = document.getElementById('main-next-btn');
        const container = document.querySelector('.haberler-container');
        const slides = document.querySelectorAll('.haber-slide');
        const slideCount = slides.length;
        let currentIndex = 0;

        if (slideCount > 0) {
            function updateSlider() {
                container.style.transform = `translateX(-${currentIndex * 100}%)`;
            }

            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slideCount;
                updateSlider();
            });

            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slideCount) % slideCount;
                updateSlider();
            });
        }
    }
});