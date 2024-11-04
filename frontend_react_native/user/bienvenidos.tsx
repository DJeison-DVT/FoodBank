import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function Bienvenido({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>BIENVENIDO</Text>

      <Text style={styles.subtitle}>Cosas que puedes donar:</Text>

      <View style={styles.itemContainer}>
        <MaterialIcons name="restaurant" size={48} color="#E63946" />
        <Text style={styles.itemText}>Comida</Text>
      </View>

      <View style={styles.itemContainer}>
        <MaterialIcons name="checkroom" size={48} color="#E63946" />
        <Text style={styles.itemText}>Ropa</Text>
      </View>

      <View style={styles.itemContainer}>
        <MaterialIcons name="medical-services" size={48} color="#E63946" />
        <Text style={styles.itemText}>Medicina</Text>
      </View>

      <Text style={styles.instructionText}>
        Sube una foto del artículo que quieras donar y te indicaremos si es válido o no. ¿List@?
      </Text>

      <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('Donaciones')}>
        <Text style={styles.startButtonText}>Comenzar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#457B9D',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ECF0F1',
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#ECF0F1',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  itemText: {
    fontSize: 18,
    color: '#ECF0F1',
    marginLeft: 10,
  },
  instructionText: {
    backgroundColor: '#1D3557',
    color: '#ECF0F1',
    textAlign: 'center',
    padding: 10,
    borderRadius: 8,
    marginVertical: 20,
    width: '80%',
  },
  startButton: {
    backgroundColor: '#E63946',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#ECF0F1',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
