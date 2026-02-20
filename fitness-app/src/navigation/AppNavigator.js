import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import PlansScreen from '../screens/PlansScreen';
import PlanDetailScreen from '../screens/PlanDetailScreen';
import WorkoutDayScreen from '../screens/WorkoutDayScreen';
import CreatePlanScreen from '../screens/CreatePlanScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ name, focused }) {
  const icons = {
    Home: focused ? '🏠' : '🏡',
    Plans: focused ? '📋' : '📄',
    Create: focused ? '➕' : '✏️',
  };
  return <Text style={{ fontSize: 20 }}>{icons[name]}</Text>;
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarStyle: {
          backgroundColor: '#1A1A2E',
          borderTopColor: '#333',
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 12, marginBottom: 4 },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Übersicht' }} />
      <Tab.Screen name="Plans" component={PlansScreen} options={{ tabBarLabel: 'Pläne' }} />
      <Tab.Screen name="Create" component={CreatePlanScreen} options={{ tabBarLabel: 'Erstellen' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#1A1A2E' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: '#0F0F23' },
        }}
      >
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="PlanDetail" component={PlanDetailScreen} options={{ title: 'Trainingsplan' }} />
        <Stack.Screen name="WorkoutDay" component={WorkoutDayScreen} options={{ title: 'Training' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
