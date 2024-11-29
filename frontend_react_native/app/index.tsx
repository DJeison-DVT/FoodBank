import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { fetchUserInfo, UserData } from '@/helpers/auth';

import Login from './login';
import Dashboard from '@/staff/dashboard';
import Pickup from '@/staff/recoger';
import Historial from '@/staff/historial';
import DetalleDonacion from '@/staff/DetalleDonacion';
import DetalleOrden from '@/staff/DetalleOrden';

import Bienvenido from '@/user/bienvenidos';
import ActiveOrder from '@/user/ActiveOrder';
import Donation from '@/user/Donation';
import DonationDetailView from '@/user/DonationDetailView';
import Profile from '@/user/Profile';

const Stack = createStackNavigator();

function StaffStack({ user }: { user: UserData }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        initialParams={{ user }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Pickup"
        component={Pickup}
        initialParams={{ user }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Historial"
        component={Historial}
        initialParams={{ user }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VerDonacion"
        component={DetalleOrden}
        initialParams={{ user }}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetalleDonacion"
        component={DetalleDonacion}
        initialParams={{ user }}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>

  );
}

function UserStack({ user, updateUser }: { user: UserData; updateUser: (user: UserData) => void }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Bienvenido"
        component={Bienvenido}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Donaciones"
        component={ActiveOrder}
        options={{ headerShown: false }}
        initialParams={{ user }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
        initialParams={{ user, updateUser }}
      />
      <Stack.Screen
        name="Donation"
        component={Donation}
        options={{ headerShown: false }}
        initialParams={{ user }}
      />
      <Stack.Screen
        name="DonationDetailView"
        component={DonationDetailView}
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

  const updateUser = (updatedUser: UserData) => {
    console.log('updating app user', updatedUser);
    setUser(updatedUser);
  };

  React.useEffect(() => {
    fetchUserInfo().then((userData) => {
      if (userData) {
        setUser(userData);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer independent={true}>
      {user ? (
        user.role === 'staff' ? (
          <StaffStack user={user} />
        ) : (
          <UserStack user={user} updateUser={updateUser} />
        )
      ) : (
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
