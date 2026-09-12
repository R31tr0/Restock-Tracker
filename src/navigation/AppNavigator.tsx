import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackParamList } from './types';


import { HomeScreen } from '../screens/HomeScreen';
import { EditScreen } from '../screens/EditScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#121212' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Стоп-лист ресторана' }} 
        />
        <Stack.Screen 
          name="EditStock" 
          component={EditScreen} 
          options={{ title: 'Редактирование остатка' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};