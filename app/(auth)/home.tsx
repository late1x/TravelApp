import React from 'react';
import { View, StyleSheet } from 'react-native';
import TodoList from '@/components/TodoList';
import Weather from '@/components/Weather';

const Home = () => {
  return (
    <View style={styles.container}>
      <Weather />
      <TodoList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#151515',
  },
});

export default Home;