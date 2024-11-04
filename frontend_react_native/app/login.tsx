import React, { useState } from 'react';
import { Text, View, StyleSheet, Pressable, Image, TextInput, Button } from "react-native";
import GoogleLoginButton from '../components/GoogleLoginButton';
import { fetchUserInfo, UserData } from '@/helpers/auth';

export default function Login({ navigation, onLogin }: { navigation: any, onLogin: (user: UserData) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const user = await fetchUserInfo();
      if (!user) {
        console.error('No user found');
        return;
      }
      onLogin(user);
      if (user.role === 'staff') {
        navigation.navigate('Dashboard');
      } else {
        navigation.navigate('Bienvenido');
      }

    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>

      <GoogleLoginButton navigation={navigation} onLogin={handleLogin} />

      <Pressable style={styles.pressable}>
        <Image source={require('../assets/images/insta.png')} style={styles.icon} />
        <Text style={styles.buttonText}>Continuar con Instagram</Text>
      </Pressable>

      <Pressable style={styles.pressable}>
        <Image source={require('../assets/images/microsoft.png')} style={styles.icon} />
        <Text style={styles.buttonText}>Continuar con Microsoft</Text>
      </Pressable>

      <Pressable style={styles.pressable}>
        <Image source={require('../assets/images/apple.png')} style={styles.icon} />
        <Text style={styles.buttonText}>Continuar con Apple</Text>
      </Pressable>

      <Text style={styles.orText}>O</Text>

      <TextInput
        style={styles.textInput}
        placeholder="Correo electrónico"
        placeholderTextColor="#A0A0A0"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.textInput}
        placeholder="Contraseña"
        placeholderTextColor="#A0A0A0"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Iniciar sesión" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#457B9D",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  pressable: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    width: '100%',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  orText: {
    color: 'white',
    marginVertical: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginVertical: 8,
    width: '100%',
    fontSize: 16,
    color: '#333',
  }
});
