// Weather App with Free API (No Key Required)

class WeatherApp {
    constructor() {
        // Using Open-Meteo API (no API key required)
        this.weatherApiUrl = 'https://api.open-meteo.com/v1/forecast';
        this.geocodingApiUrl = 'https://geocoding-api.open-meteo.com/v1/search';
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadDefaultLocation();
    }
    
    initializeElements() {
        this.cityInput = document.getElementById('cityInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.loading = document.getElementById('loading');
        this.weatherInfo = document.getElementById('weatherInfo');
        this.errorMessage = document.getElementById('errorMessage');
        
        // Weather data elements
        this.cityName = document.getElementById('cityName');
        this.country = document.getElementById('country');
        this.temp = document.getElementById('temp');
        this.description = document.getElementById('description');
        this.feelsLike = document.getElementById('feelsLike');
        this.humidity = document.getElementById('humidity');
        this.windSpeed = document.getElementById('windSpeed');
        this.pressure = document.getElementById('pressure');
        this.visibility = document.getElementById('visibility');
        this.weatherIcon = document.getElementById('weatherIcon');
    }
    
    attachEventListeners() {
        this.searchBtn.addEventListener('click', () => this.searchWeather());
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchWeather();
            }
        });
    }
    
    async loadDefaultLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    this.getWeatherByCoords(lat, lon);
                },
                () => {
                    this.getWeatherByCity('London');
                }
            );
        } else {
            this.getWeatherByCity('London');
        }
    }
    
    async searchWeather() {
        const city = this.cityInput.value.trim();
        if (!city) {
            this.showError('Please enter a city name');
            return;
        }
        
        await this.getWeatherByCity(city);
    }
    
    async getWeatherByCity(city) {
        this.showLoading();
        
        try {
            // First, get coordinates for the city
            const geoResponse = await fetch(`${this.geocodingApiUrl}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
            const geoData = await geoResponse.json();
            
            if (!geoData.results || geoData.results.length === 0) {
                throw new Error('City not found');
            }
            
            const location = geoData.results[0];
            await this.getWeatherByCoords(location.latitude, location.longitude, location.name, location.country);
            
        } catch (error) {
            console.error('Error:', error);
            this.showError('City not found. Please try again.');
        }
    }
    
    async getWeatherByCoords(lat, lon, cityName = 'Your Location', country = '') {
        this.showLoading();
        
        try {
            const weatherUrl = `${this.weatherApiUrl}?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,surface_pressure,visibility,wind_speed_10m&timezone=auto`;
            
            const response = await fetch(weatherUrl);
            const data = await response.json();
            
            if (!data.current_weather) {
                throw new Error('Weather data not available');
            }
            
            // Transform data to match our display format
            const transformedData = {
                name: cityName,
                sys: { country: country },
                main: {
                    temp: data.current_weather.temperature,
                    feels_like: data.current_weather.temperature + 2, // Approximation
                    humidity: data.hourly.relative_humidity_2m[0] || 50,
                    pressure: data.hourly.surface_pressure[0] || 1013
                },
                weather: [{
                    description: this.getWeatherDescription(data.current_weather.weathercode),
                    icon: this.getWeatherCode(data.current_weather.weathercode)
                }],
                wind: {
                    speed: data.current_weather.windspeed / 3.6 // Convert to m/s
                },
                visibility: (data.hourly.visibility[0] || 10000) / 1000 // Convert to km
            };
            
            this.displayWeatherData(transformedData);
            
        } catch (error) {
            console.error('Error:', error);
            this.showError('Unable to get weather data');
        }
    }
    
    getWeatherDescription(code) {
        const descriptions = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Foggy',
            48: 'Depositing rime fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            61: 'Slight rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            71: 'Slight snow fall',
            73: 'Moderate snow fall',
            75: 'Heavy snow fall',
            95: 'Thunderstorm',
            96: 'Thunderstorm with hail',
            99: 'Thunderstorm with heavy hail'
        };
        return descriptions[code] || 'Unknown';
    }
    
    getWeatherCode(code) {
        const icons = {
            0: '☀️',    // Clear sky
            1: '🌤️',    // Mainly clear
            2: '⛅',    // Partly cloudy
            3: '☁️',    // Overcast
            45: '🌫️',   // Fog
            48: '🌫️',   // Depositing rime fog
            51: '🌦️',   // Light drizzle
            53: '🌦️',   // Moderate drizzle
            55: '🌧️',   // Dense drizzle
            61: '🌧️',   // Slight rain
            63: '🌧️',   // Moderate rain
            65: '🌧️',   // Heavy rain
            71: '❄️',   // Slight snow
            73: '❄️',   // Moderate snow
            75: '❄️',   // Heavy snow
            95: '⛈️',   // Thunderstorm
            96: '⛈️',   // Thunderstorm with hail
            99: '⛈️'    // Thunderstorm with heavy hail
        };
        return icons[code] || '🌤️';
    }
    
    displayWeatherData(data) {
        // Update location
        this.cityName.textContent = data.name || 'Unknown Location';
        this.country.textContent = data.sys?.country || '';
        
        // Update temperature
        this.temp.textContent = Math.round(data.main?.temp || 0);
        this.feelsLike.textContent = `Feels like ${Math.round(data.main?.feels_like || 0)}°C`;
        
        // Update description
        this.description.textContent = data.weather?.[0]?.description || 'No description available';
        
        // Update weather icon
        this.weatherIcon.textContent = data.weather?.[0]?.icon || '🌤️';
        
        // Update details
        this.humidity.textContent = `${Math.round(data.main?.humidity || 0)}%`;
        this.windSpeed.textContent = `${Math.round((data.wind?.speed || 0) * 3.6)} km/h`;
        this.pressure.textContent = `${Math.round(data.main?.pressure || 0)} hPa`;
        this.visibility.textContent = `${Math.round(data.visibility || 10)} km`;
        
        this.showWeatherInfo();
    }
    
    showLoading() {
        this.loading.style.display = 'block';
        this.weatherInfo.style.display = 'none';
        this.errorMessage.style.display = 'none';
    }
    
    showWeatherInfo() {
        this.loading.style.display = 'none';
        this.weatherInfo.style.display = 'block';
        this.errorMessage.style.display = 'none';
    }
    
    showError(message) {
        this.loading.style.display = 'none';
        this.weatherInfo.style.display = 'none';
        this.errorMessage.style.display = 'block';
        this.errorMessage.querySelector('p').textContent = message;
    }
}

// Initialize the weather app
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});