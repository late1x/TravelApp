import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=f4db208b8820bc0e966f14e946fd5b0e&units=metric`);
      const data = await response.json();
      if (response.ok) {
        setWeatherData(data);
        setError(null);
      } else {
        setError(data.message);
        setWeatherData(null);
      }
    } catch (error) {
      setError('Error fetching weather data');
      setWeatherData(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Datos del Clima</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar ciudad"
          value={city}
          onChangeText={setCity}
        />
        <TouchableOpacity style={styles.searchButton} onPress={fetchWeather}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {weatherData && (
        <View style={styles.weatherCard}>
          <Text style={styles.weatherText}>Ciudad: {weatherData.name}</Text>
          <Text style={styles.weatherText}>Temperatura: {weatherData.main.temp}°C</Text>
          <Text style={styles.weatherText}>Clima: {weatherData.weather[0].description}</Text>
          <Text style={styles.weatherText}>Humedad: {weatherData.main.humidity}%</Text>
          <Text style={styles.weatherText}>Viento: {weatherData.wind.speed} m/s</Text>
          <Image
            style={styles.weatherIcon}
            source={{ uri: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png` }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#151515',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  searchButton: {
    backgroundColor: '#2b825b',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  errorText: {
    color: '#ff6347',
    textAlign: 'center',
    marginBottom: 20,
  },
  weatherCard: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginTop: 20,
    borderColor: '#2b825b',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  weatherText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  weatherIcon: {
    width: 50,
    height: 50,
    marginTop: 10,
  },
});

export default Weather;