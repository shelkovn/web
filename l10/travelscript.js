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
    let ln = Number(lon).toFixed(2), lt = Number(lat).toFixed(2);
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
        renderWeatherCarousel(parsedForecast);
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
        const itemDate = new Date(hourlyData.time[i]);
        
        // Фильтруем: только будущее время в пределах 24 часов
        const hoursDifference = (itemDate - now) / (1000 * 60 * 60);
        
        if (hoursDifference >= 0 && hoursDifference <= 24) {
            const hoursStr = String(itemDate.getHours()).padStart(2, '0');
            const dayStr = String(itemDate.getDate()).padStart(2, '0');
            const monthStr = String(itemDate.getMonth() + 1).padStart(2, '0');

            resultForecast.push({
                time: `${hoursStr}:00, ${dayStr}.${monthStr}`,
                temperature: `${Math.round(hourlyData.temperature_2m[i])} °C`,
                wind: `${Math.round(hourlyData.wind_speed_10m[i])} м/с`, 
                weather_status: getWeatherStatus(hourlyData.weather_code[i]),
                precipitation: getPrecipitationType(hourlyData.weather_code[i])
            });
        }
    }

    return resultForecast;
}

function renderWeatherCarousel(forecastList) {
    const track = document.getElementById('weather-track');
    const indicatorsContainer = document.getElementById('weather-indicators');
    
    if (!track) return;
    
    // HTML карточек
    track.innerHTML = forecastList.map(item => `
        <div class="weather-card">
            <div class="weather-time">${item.time}</div>
            <div class="weather-status">${item.weather_status}</div>
            <div class="weather-temp">${item.temperature}</div>
            <div class="weather-info">
                <span>💨 Ветер: ${item.wind}</span>
                <span>💧 Осадки: ${item.precipitation}</span>
            </div>
        </div>
    `).join('');

    initWeatherSlider(track, indicatorsContainer);
}

function initWeatherSlider(track, indicatorsContainer) {
    const prevBtn = document.querySelector('.weather-carousel-button-prev');
    const nextBtn = document.querySelector('.weather-carousel-button-next');
    const viewport = document.querySelector('.weather-viewport');
    
    let currentIndex = 0;
    let maxPages = 0;
    
    function updateSliderConfig() {
        const cards = Array.from(track.children);
        if (cards.length === 0) return;

        const cardWidth = cards[0].getBoundingClientRect().width;
        const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
        const viewportWidth = viewport.getBoundingClientRect().width;
        
        // сколько карточек помещается на экране целиком
        const visibleCards = Math.round(viewportWidth / (cardWidth + gap));
        // количество страниц прокрутки
        maxPages = Math.max(0, cards.length - visibleCards);
        
        if (currentIndex > maxPages) currentIndex = maxPages;
        
        // Генерация точек-индикаторов
        indicatorsContainer.innerHTML = '';
        for (let i = 0; i <= maxPages; i++) {
            const btn = document.createElement('button');
            btn.classList.add('weather-indicator');
            if (i === currentIndex) btn.classList.add('active');
            btn.setAttribute('data-page', i);
            indicatorsContainer.appendChild(btn);
        }
        
        scrollToPage(currentIndex, cardWidth, gap);
    }

    function scrollToPage(page, cardWidth, gap) {
        currentIndex = page;
        // Считаем точный сдвиг в пикселях
        const offset = currentIndex * (cardWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;
        
        // Обновляем состояние кнопок стрелок
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === maxPages;
        
        // Обновляем активную точку
        const indicators = indicatorsContainer.querySelectorAll('.weather-indicator');
        indicators.forEach((ind, idx) => {
            ind.classList.toggle('active', idx === currentIndex);
        });
    }

    // прокрутка к карточке по нажатию
    track.addEventListener('click', (e) => {
        const clickedCard = e.target.closest('.weather-card');
        if (!clickedCard) return;

        const cards = Array.from(track.children);
        const cardWidth = cards[0].getBoundingClientRect().width;
        const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
        const viewportWidth = viewport.getBoundingClientRect().width;
        
        const visibleCards = Math.round(viewportWidth / (cardWidth + gap));
        const cardIndex = cards.indexOf(clickedCard);
    
        // вычитаем половину видимых (чтобы оказалась в центре)
        let targetPage = cardIndex - Math.floor(visibleCards / 2);
        
        // проверка на индекс
        if (targetPage < 0) targetPage = 0;
        if (targetPage > maxPages) targetPage = maxPages;

        scrollToPage(targetPage, cardWidth, gap);
    });

    // Обработчики кликов по стрелкам
    nextBtn.addEventListener('click', () => {
        if (currentIndex < maxPages) {
            const cardWidth = track.children[0].getBoundingClientRect().width;
            const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
            scrollToPage(currentIndex + 1, cardWidth, gap);
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            const cardWidth = track.children[0].getBoundingClientRect().width;
            const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
            scrollToPage(currentIndex - 1, cardWidth, gap);
        }
    });

    // Делегирование кликов для точек-индикаторов
    indicatorsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('weather-indicator')) {
            const page = parseInt(e.target.getAttribute('data-page'));
            const cardWidth = track.children[0].getBoundingClientRect().width;
            const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
            scrollToPage(page, cardWidth, gap);
        }
    });

    // Пересчитываем слайдер при ресайзе окна (чтобы не ломался шаг на смартфонах)
    window.addEventListener('resize', updateSliderConfig);
    
    // Первый запуск калькуляции конфигурации
    setTimeout(updateSliderConfig, 100); 
}

