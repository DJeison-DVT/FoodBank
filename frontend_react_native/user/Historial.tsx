import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

export default function Historial() {
  return (
    <View style={styles.container}>
      {/* Título del historial */}
      <Text style={styles.title}>Historial:</Text>

      {/* Lista de donaciones */}
      <ScrollView style={styles.listContainer}>
        {[1, 2, 3, 4].map((item, index) => (
          <View key={index} style={styles.listItem}>
            <MaterialIcons name="image" size={40} color="#E63946" />
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>Descripción</Text>
              <Text style={styles.descriptionText}>#70 Medicina. Rauw. ...</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#ECF0F1" />
          </View>
        ))}
      </ScrollView>

      {/* Botón de Donando */}
      <TouchableOpacity style={styles.donatingButton}>
        <Text style={styles.donatingButtonText}>Donando</Text>
        <View style={styles.counter}>
          <Text style={styles.counterText}>4</Text>
        </View>
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
    color: '#ECF0F1',
    fontSize: 24,
    marginBottom: 20,
  },
  listContainer: {
    flex: 1,
    marginBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    marginBottom: 15,
  },
  descriptionContainer: {
    flex: 1,
    marginLeft: 10,
  },
  descriptionTitle: {
    color: '#1D3557',
    fontSize: 14,
    fontWeight: 'bold',
  },
  descriptionText: {
    color: '#ECF0F1',
    fontSize: 12,
  },
  donatingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1D3557',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  donatingButtonText: {
    color: '#ECF0F1',
    fontSize: 16,
    marginRight: 10,
  },
  counter: {
    backgroundColor: '#E63946',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  counterText: {
    color: '#ECF0F1',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

