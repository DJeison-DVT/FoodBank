import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; 

type RootStackParamList = {
  VerDonacion: undefined;
  DetalleDonacion: { donation: any }; 
};

const VerDonacion = () => {
  const navigation = useNavigation();

  const items = [
    { label: 'Revisar', status: 'Comida', id: 1 },
    { label: 'Revisar', status: 'Comida', id: 2 },
    { label: 'Archivado', status: 'Medicina', id: 3 },
  ];

  const handleDetailsPress = (donation: any) => {
    navigation.navigate('DetalleDonacion', { donation }); 
  };

  return (
    <View style={styles.container}>
      {/* Botón de regresar */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#fff" />
        <Text style={styles.backButtonText}>Regresar</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Donación de Rauw</Text>

      {/* Listado de donaciones */}
      {items.map((item, index) => (
        <View key={index} style={styles.card}>
          <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.image} />
          <View style={styles.details}>
            <TouchableOpacity
              style={[styles.statusButton, item.label === 'Archivado' ? styles.archived : styles.review]}
              onPress={() => handleDetailsPress(item)} // Evento para ir a DetalleDonacion
            >
              <Text style={styles.statusText}>{item.label}</Text>
            </TouchableOpacity>
            <Text style={styles.itemStatus}>{item.status}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#457B9D',
    padding: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  header: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6A8FA7',
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 15,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  details: {
    flex: 1,
  },
  statusButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  review: {
    backgroundColor: '#E63946',
  },
  archived: {
    backgroundColor: '#A4161A',
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  itemStatus: {
    backgroundColor: '#1D3557',
    color: '#fff',
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default VerDonacion;
