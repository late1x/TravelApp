import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../config/initSupabase'; 
import { useAuth } from '../provider/AuthProvider'; 

const TodoList = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState<{ id: string; task: string }[]>([]);
  const [text, setText] = useState('');

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
    <View style={styles.container}>
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
      <FlatList
        data={todos}
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
  inputContainer: {
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
});

export default TodoList;