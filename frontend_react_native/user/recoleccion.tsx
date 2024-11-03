import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function DatosRecoleccion() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Datos de recolección</Text>

      <Text style={styles.label}>Ubicación de recolección</Text>
      <TextInput style={styles.input} placeholder="Ingresa ubicación" />

      <Text style={styles.label}>Horarios disponibles de recolección</Text>
      <TextInput style={styles.input} placeholder="Selecciona horarios" />

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Comentarios para el recolector</Text>
      <TextInput 
        style={[styles.input, styles.textArea]} 
        placeholder="Comentarios adicionales" 
        multiline 
      />

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#457B9D',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ECF0F1',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    color: '#ECF0F1',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#457B9D',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    color: '#000',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#457B9D',
    alignSelf: 'center',
    borderRadius: 50,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#ECF0F1',
    fontSize: 20,
  },
  saveButton: {
    backgroundColor: '#1D3557',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ECF0F1',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
