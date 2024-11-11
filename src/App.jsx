import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./Components/WeatherAppComponents/WeatherApp.css";

const API_KEY = "7737d7d92f72b8cda5fb8afd9d20d58d";

const WeatherApp = () => {
  const [city, setCity] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  const fetchSuggestions = (inputValue) => {
    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${inputValue}&limit=5&appid=${API_KEY}`;
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        setSuggestions(
          data.map((city) => ({
            label: `${city.name}, ${city.country}`,
            value: { name: city.name, lat: city.lat, lon: city.lon },
          }))
        );
      });
  };

  const getWeatherDetails = ({ name, lat, lon }) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    fetch(WEATHER_API_URL)
      .then((response) => response.json())
      .then((data) => {
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter((forecast) => {
          const forecastDate = new Date(forecast.dt_txt).getDate();
          if (!uniqueForecastDays.includes(forecastDate)) {
            return uniqueForecastDays.push(forecastDate);
          }
        });

        setCurrentWeather(fiveDaysForecast[0]);
        setForecast(fiveDaysForecast.slice(1));
      })
      .catch(() => {
        alert("An error occurred while fetching the weather forecast!");
      });
  };

  useEffect(() => {
    if (city) {
      getWeatherDetails(city.value);
    }
  }, [city]);

  return (
    <div className="container">
      <h1>Weather App</h1>
      <div className="weather-input">
        <h3>Enter a City Name</h3>
        <Select
          options={suggestions}
          onInputChange={fetchSuggestions}
          onChange={(selectedOption) => setCity(selectedOption)}
          placeholder="E.g., New York, London, Tokyo"
        />
        <div className="separator"></div>
      </div>
      <div className="weather-data">
        {currentWeather && (
          <div className="current-weather">
            <div className="details">
              <h2>
                {city.label} ({currentWeather.dt_txt.split(" ")[0]})
              </h2>
              <h6>Temperature: {(currentWeather.main.temp - 273.15).toFixed(2)}°C</h6>
              <h6>Wind: {currentWeather.wind.speed} M/S</h6>
              <h6>Humidity: {currentWeather.main.humidity}%</h6>
            </div>
            <div className="icon">
              <img
                src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@4x.png`}
                alt="weather-icon"
              />
              <h6>{currentWeather.weather[0].description}</h6>
            </div>
          </div>
        )}
        <div className="days-forecast">
          <h2>5-Day Forecast</h2>
          <ul className="weather-cards">
            {forecast.map((weatherItem, index) => (
              <li key={index} className="card">
                <h3>({weatherItem.dt_txt.split(" ")[0]})</h3>
                <img
                  src={`https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png`}
                  alt="weather-icon"
                />
                <h6>Temp: {(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                <h6>Wind: {weatherItem.wind.speed} M/S</h6>
                <h6>Humidity: {weatherItem.main.humidity}%</h6>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
