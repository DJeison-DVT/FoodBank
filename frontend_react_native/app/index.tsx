import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { fetchUserInfo, UserData } from '@/helpers/auth';

import Login from './login';
import Dashboard from '../staff/dashboard';
import Pickup from '../staff/recoger';

import Bienvenido from '@/user/bienvenidos';
import Donaciones from '@/user/donaciones';
import DatosRecoleccion from '@/user/recoleccion';
import Donation from '@/user/Donation';

const Stack = createStackNavigator();

function StaffStack() {
  return (
    <Stack.Navigator>
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
    </Stack.Navigator>
  );
}

function UserStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Bienvenido"
        component={Bienvenido}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DatosRecoleccion"
        component={DatosRecoleccion}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Donaciones"
        component={Donaciones}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Donation"
        component={Donation}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function App() {
  const [user, setUser] = React.useState<UserData | null>(null);
  const [loading, setLoading] = React.useState(true);


  const handleLogin = (user: UserData) => {
    setUser(user);
  };

  React.useEffect(() => {
    // Check if user is already logged in
    fetchUserInfo().then((userData) => {
      if (userData) {
        setUser(userData);
      }
      // go to staff or user screen
      console.log('userData', userData);


      setLoading(false); // Stop loading once the fetch is complete
    });
  }, []);

  // Show a loading screen while checking the user's login status
  if (loading) {
    return null;
  }

  return (
    <NavigationContainer independent={true}>
      {user ? (
        user.role === 'staff' ? (
          <StaffStack />
        ) : (
          <UserStack />
        )
      ) : (
        // Show Login screen if user is not logged in
        <Stack.Navigator>
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {props => <Login {...props} onLogin={handleLogin} />}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default App;