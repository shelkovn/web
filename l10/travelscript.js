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

function findPlaceUrl(place)
{
    return `https://nominatim.openstreetmap.org/search?q=${place}&format=json`
}

//карта
document.addEventListener("DOMContentLoaded", function () {
    const mapelement = L.map('map-element').setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapelement);
    
    let url = findPlaceUrl("Novosibirsk");
    const regionButtons = document.querySelectorAll(".region-button");
    const regionTitle = document.getElementById("region-title");
    const regionDescription = document.getElementById("region-description");

    regionButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const title = this.dataset.regionTitle;
            const description = this.dataset.regionDescription;
            const place = this.dataset.place || "Novosibirsk"
            url = findPlaceUrl(place);
            const circleR = this.dataset.circleR || 0; 

            regionTitle.style.opacity = "0";
            regionDescription.style.opacity = "0";

            setTimeout(() => {
                regionTitle.textContent = title || "Не знаем, где это";
                regionDescription.textContent = description || "Не знаем, что это";
                regionTitle.style.opacity = "1";
                regionDescription.style.opacity = "1";
            }, 100); // поочередное появление
            
            fetch(url)
                .then(response => response.json())      // 3. Преобразуем ответ в JSON
                .then(data => {                         // 4. Получили массив с координатами
                    const lat = data[0].lat;            // широта из ответа
                    const lon = data[0].lon;            // долгота из ответа
                
                    // 5. Рисуем окружность на карте
                    if (circleR > 0){
                        const circle = L.circle([lat, lon], { radius: Number(circleR) }).addTo(mapelement);
                        mapelement.fitBounds(circle.getBounds());
                    }
                })
                .catch(error => {                       // 6. Обрабатываем ошибки
                    console.log('API недоступно, отрисовки не будет');
                });

            regionButtons.forEach((btn) => btn.classList.remove("active"));
            this.classList.add("active");
        });
    });
});

//погода
function buildWeatherRequestJson(lon = 82.92, lat = 55.03) {
    let ln = Number(lon), lt = Number(lat);
    return `https://api.open-meteo.com/v1/forecast?latitude=${lt}&longitude=${ln}&hourly=temperature_2m,wind_speed_10m,cloud_cover,weather_code&forecast_days=2&wind_speed_unit=ms`;
}

window.addEventListener('DOMContentLoaded', () => {
    //console.log("weather loading started")
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                getWeatherForecast(position.coords.longitude, position.coords.latitude);
            },
            (error) => {
                console.warn("Геолокация недоступна, используем координаты по умолчанию.", error.message);
                getWeatherForecast(); //нск
            }
        );
    } else {
        console.warn("Браузер не поддерживает геолокацию, используем координаты по умолчанию.");
        getWeatherForecast();
    }
});

async function getWeatherForecast(lon, lat) {
    const url = buildWeatherRequestJson(lon, lat);
    
    try {
        //console.log(`weather fetching at ${url}`)
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Ошибка сети: ${response.status}`);
        
        const data = await response.json();
        const parsedForecast = parseNext24Hours(data);
        
        //TODO интерфейс
        console.log(parsedForecast)
        
    } catch (error) {
        console.error("Не удалось получить прогноз погоды:", error);
    }
}

function parseNext24Hours(apiResponse) {
    const now = new Date();
    const resultForecast = [];

    // Перевод кодов погоды Open-Meteo (WMO) в понятный текст
    // 0 - ясно, 1-3 - переменная, 45-48 - туман, 51-65 - дождь, 71-77 - снег
    const getWeatherStatus = (code) => {
        if (code === 0) return "Ясно";
        if (code >= 1 && code <= 3) return "Переменная облачность";
        if (code >= 45 && code <= 48) return "Туман";
        if (code >= 51 && code <= 65) return "Дождь";
        if (code >= 71 && code <= 77) return "Снег";
        if (code >= 80 && code <= 82) return "Ливень";
        if (code >= 85 && code <= 86) return "Снегопад";
        return "Облачно";
    };

    const getPrecipitationType = (code) => {
        if (code >= 51 && code <= 65) return "Дождь";
        if (code >= 71 && code <= 77) return "Снег";
        if (code >= 80 && code <= 82) return "Дождь (ливень)";
        if (code >= 85 && code <= 86) return "Снег (снегопад)";
        return "Без осадков";
    };

    // Open-Meteo возвращает плоские массивы в hourly
    const hourlyData = apiResponse.hourly;
    
    for (let i = 0; i < hourlyData.time.length; i++) {
        const itemDate = new Date(hourlyData.time[i]); // Время там уже в ISO формате
        
        // Фильтруем: только будущее время в пределах 24 часов
        const hoursDifference = (itemDate - now) / (1000 * 60 * 60);
        
        if (hoursDifference >= 0 && hoursDifference <= 24) {
            const hoursStr = String(itemDate.getHours()).padStart(2, '0');
            const dayStr = String(itemDate.getDate()).padStart(2, '0');
            const monthStr = String(itemDate.getMonth() + 1).padStart(2, '0');

            resultForecast.push({
                time: `${dayStr}.${monthStr} ${hoursStr}:00`,
                temperature: `${Math.round(hourlyData.temperature_2m[i])} °C`,
                wind: `${Math.round(hourlyData.wind_speed_10m[i])} м/с`, // Сразу в м/с без индексов
                weather_status: getWeatherStatus(hourlyData.weather_code[i]),
                precipitation: getPrecipitationType(hourlyData.weather_code[i])
            });
        }
    }

    return resultForecast;
}

