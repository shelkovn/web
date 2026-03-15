// карусель
document.addEventListener("DOMContentLoaded", function () {
    const slides = document.querySelectorAll(".carousel-slide");
    const prevButton = document.querySelector(".carousel-button-prev");
    const nextButton = document.querySelector(".carousel-button-next");
    const indicators = document.querySelectorAll(".indicator");

    let currentSlide = 0;
    let autoPlayInterval;
    const AUTO_PLAY_DELAY = 5000;

    function showSlide(index) {
        slides.forEach((slide) => slide.classList.remove("active"));
        indicators.forEach((ind) => ind.classList.remove("active"));

        slides[index].classList.add("active");
        indicators[index].classList.add("active");
        currentSlide = index;
    }

    function nextSlide() {
        let nextIndex = currentSlide + 1;
        if (nextIndex >= slides.length) {
            nextIndex = 0;
        }
        showSlide(nextIndex);
    }

    function prevSlide() {
        let prevIndex = currentSlide - 1;
        if (prevIndex < 0) {
            prevIndex = slides.length - 1;
        }
        showSlide(prevIndex);
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(nextSlide, AUTO_PLAY_DELAY);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }

    if (prevButton) {
        prevButton.addEventListener("click", function () {
            prevSlide();
            stopAutoPlay();
            startAutoPlay();
        });
    }

    if (nextButton) {
        nextButton.addEventListener("click", function () {
            nextSlide();
            stopAutoPlay();
            startAutoPlay();
        });
    }

    indicators.forEach((indicator, index) => {
        indicator.addEventListener("click", function () {
            showSlide(index);
            stopAutoPlay();
            startAutoPlay();
        });
    });

    const carouselContainer = document.querySelector(".carousel-container");
    if (carouselContainer) {
        carouselContainer.addEventListener("mouseenter", stopAutoPlay);
        carouselContainer.addEventListener("mouseleave", startAutoPlay);
    }

    startAutoPlay();
});

//карта
document.addEventListener("DOMContentLoaded", function () {
    const regionButtons = document.querySelectorAll(".region-button");
    const regionTitle = document.getElementById("region-title");
    const regionDescription = document.getElementById("region-description");
    const regionCircle = document.getElementById("region-circle");
    const mapContainer = document.querySelector(".map-image-container");

    regionButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const title = this.dataset.regionTitle;
            const description = this.dataset.regionDescription;
            const circleX = this.dataset.circleX || "0%";
            const circleY = this.dataset.circleY || "0%";
            const circleR = this.dataset.circleR || "0%";

            regionTitle.style.opacity = "0";
            regionDescription.style.opacity = "0";
            regionCircle.style.opacity = "0";

            setTimeout(() => {
                regionTitle.textContent = title || "Не знаем, где это";
                regionDescription.textContent = description || "Не знаем, что это";
                regionTitle.style.opacity = "1";
                regionDescription.style.opacity = "1";
            }, 100); // поочередное появление

            if (circleX !== "0%" && circleY !== "0%") { //круг
                updateCircle(circleX, circleY, circleR, regionCircle, mapContainer);
            }

            regionButtons.forEach((btn) => btn.classList.remove("active"));
            this.classList.add("active");
        });
    });
});

function updateCircle(xPercent, yPercent, rPercent, regionCircle, mapContainer) {
    const x = parseFloat(xPercent) * mapContainer.clientWidth / 100;
    const y = parseFloat(yPercent) * mapContainer.clientHeight / 100;
    const r = parseFloat(rPercent) * mapContainer.clientWidth / 100;
    
    regionCircle.style.opacity = "1";
    regionCircle.setAttribute("cx", x);
    regionCircle.setAttribute("cy", y);
    regionCircle.setAttribute("r", r);

    regionCircle.setAttribute("transform", "scale(1)");
    regionCircle.offsetHeight; // Trigger reflow
}

