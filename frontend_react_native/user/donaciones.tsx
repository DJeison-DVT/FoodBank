import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

export default function Donaciones() {
  return (
    <View style={styles.container}>
      <View style={styles.donationCard}>
        <MaterialIcons name="medical-services" size={48} color="#E63946" />
        <View style={styles.cardContent}>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>Ver</Text>
          </TouchableOpacity>
          <Text style={styles.itemText}>Medicina</Text>
          <Text style={styles.statusText}>Favor de revisar los detalles y volver a enviar</Text>
        </View>
      </View>

      <View style={styles.donationCard}>
        <MaterialIcons name="restaurant" size={48} color="#E63946" />
        <View style={styles.cardContent}>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>Ver</Text>
          </TouchableOpacity>
          <Text style={styles.itemText}>Comida</Text>
          <Text style={styles.statusText}>Listo para recoger</Text>
        </View>
      </View>

      <View style={styles.donationCard}>
        <MaterialIcons name="checkroom" size={48} color="#E63946" />
        <View style={styles.cardContent}>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>Ver</Text>
          </TouchableOpacity>
          <Text style={styles.itemText}>Ropa</Text>
          <Text style={styles.statusText}>En camino, llegando...</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.footerButtonText}>Donando</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>4</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <FontAwesome name="plus" size={24} color="#1D3557" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <FontAwesome name="camera" size={24} color="#1D3557" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#457B9D',
    padding: 20,
  },
  donationCard: {
    flexDirection: 'row',
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    marginLeft: 10,
  },
  viewButton: {
    backgroundColor: '#1D3557',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  viewButtonText: {
    color: '#ECF0F1',
    fontWeight: 'bold',
  },
  itemText: {
    fontSize: 16,
    color: '#E63946',
    marginTop: 5,
    fontWeight: 'bold',
  },
  statusText: {
    color: '#ECF0F1',
    marginTop: 5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 20,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1D3557',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  footerButtonText: {
    color: '#ECF0F1',
    fontSize: 16,
    marginRight: 5,
  },
  badge: {
    backgroundColor: '#E63946',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#ECF0F1',
    fontSize: 14,
    fontWeight: 'bold',
  },
  iconButton: {
    backgroundColor: '#ECF0F1',
    padding: 10,
    borderRadius: 50,
  },
});
