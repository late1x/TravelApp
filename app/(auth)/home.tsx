import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/config/initSupabase';
import { useAuth } from '@/provider/AuthProvider';

const Home = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [todos, setTodos] = useState<{ id: string; task: string }[]>([]);
  const [text, setText] = useState('');

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

  useEffect(() => {
    if (user) {
      loadTodos();
    }
  }, [user]);

  const loadTodos = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user!.id);

    if (error) {
      console.error(error);
    } else {
      setTodos(data || []);
    }
  };

  const addTodo = async () => {
    if (text.trim()) {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ user_id: user!.id, task: text }])
        .select()
        .single();

      if (error) {
        console.error(error);
      } else if (data) {
        setTodos([...todos, data]);
        setText('');
      }
    }
  };

  const removeTodo = async (id: string) => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(error);
    } else {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  return (
    <ScrollView style={styles.container}>
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

      <Text style={styles.title}>Mi itinerario de Viaje</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Agregar un nuevo destino"
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList style={styles.list}
        data={todos}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <Text style={styles.todoText}>{item.task}</Text>
            <TouchableOpacity onPress={() => removeTodo(item.id)}>
              <Ionicons name="trash" size={24} style={styles.removeButton} />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </ScrollView>
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
    marginTop: 20,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  weatherCard: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginTop: 10,
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
    fontSize: 14,
    marginBottom: 10,
    color: '#333',
  },
  weatherIcon: {
    width: 50,
    height: 50,
    marginTop: 10,
  },
  addButton: {
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
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#2b825b',
    borderWidth: 1,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  todoText: {
    fontSize: 18,
    color: '#333',
  },
  removeButton: {
    color: '#ff6347',
  },
  list:{
    marginBottom: 25,
  }
});

export default Home;