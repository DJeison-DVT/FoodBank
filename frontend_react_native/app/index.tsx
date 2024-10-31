import { Text, View, StyleSheet, Pressable, Image, TextInput } from "react-native";
import React, { useState } from "react";

export default function Index() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      
      <Pressable style={styles.pressable}>
        <Image source={require('../assets/images/google.png')} style={styles.icon} />
        <Text style={styles.buttonText}>Continuar con Google</Text>
      </Pressable>
      
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
