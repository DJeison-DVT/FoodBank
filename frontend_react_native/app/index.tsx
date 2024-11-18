import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './login';
import Dashboard from '../staff/dashboard'; 
import Pickup from '../staff/recoger';
import Historial from '../staff/historial';
import VerDonacion from '../staff/verDonacion';
import DetalleDonacion from '../staff/detalleDonacion';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer independent={true}>

      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Dashboard" 
          component={Dashboard} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Pickup" 
          component={Pickup} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Historial" 
          component={Historial} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="VerDonacion" 
          component={VerDonacion} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="DetalleDonacion" 
          component={DetalleDonacion} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;