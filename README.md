# Weather App

A simple, responsive Weather App built using JavaScript, HTML, and CSS. This app fetches real-time weather data for any city using a public weather API and displays current weather conditions, temperature, humidity, wind speed, and more.

## Features

- Search weather by city name
- Displays temperature, humidity, wind speed, and weather condition
- Responsive design for mobile and desktop
- Dynamic background image based on weather
- Error handling for invalid city names

## Demo

![Weather App Screenshot](assets/demo-screenshot.png)

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Edge, Safari, etc.)
- Internet connection for fetching live weather data

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tyagigolu02/Weather-App.git
   cd Weather-App
   ```

2. **Get an API key:**
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api) (or the weather API used in your code).
   - Copy your API key.

3. **Configure the API key:**
   - Open the JavaScript configuration or main JS file.
   - Replace the placeholder with your actual API key:
     ```js
     const API_KEY = 'YOUR_API_KEY_HERE';
     ```

4. **Run the application:**
   - Open `index.html` in your browser.

## Usage

- Enter a city name in the search bar and press Enter or click the search button.
- The app will display current weather information for the entered city.

## Folder Structure

```
Weather-App/
├── assets/               # Images and icons
├── css/                  # Stylesheets
├── js/                   # JavaScript files
├── index.html
├── README.md
```

## Technologies Used

- JavaScript (ES6)
- HTML5
- CSS3
- [OpenWeatherMap API](https://openweathermap.org/)

## Customization

- **Background Image:**  
  You can customize the background image by editing the `background-image` property in `css/style.css`.

- **UI Styling:**  
  Modify `css/style.css` for custom colors, fonts, and layout.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [OpenWeatherMap](https://openweathermap.org/) for the API
- Inspiration from various weather app tutorials
