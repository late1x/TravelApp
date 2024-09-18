import { useAuth } from '../../provider/AuthProvider';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import List from './list';
import Home from './home';

const Tab = createBottomTabNavigator();
// Simple tab layout within the authenticated area
const TabLayout = () => {
  const { signOut } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0f0f0f',
        },
        headerTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#0f0f0f',
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#999',
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name='Home'
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
          headerRight: () => (
            <TouchableOpacity onPress={signOut}>
              <Ionicons name="log-out-outline" size={30} color={'#fff'} />
            </TouchableOpacity>
          ),
        }}></Tab.Screen>
      <Tab.Screen
        name="Mis recuerdos"
        component={List}
        options={{
          tabBarLabel: 'Recuerdos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="images-outline" color={color} size={size} />
          ),
          headerRight: () => (
            <TouchableOpacity onPress={signOut}>
              <Ionicons name="log-out-outline" size={30} color={'#fff'} />
            </TouchableOpacity>
          ),
        }}></Tab.Screen>
    </Tab.Navigator>
  );
};

export default TabLayout;