import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Para los íconos de flechas

type RootStackParamList = {
  DetalleDonacion: { donation: any }; // Parámetro donation para esta pantalla
};

type DetalleDonacionRouteProp = RouteProp<RootStackParamList, 'DetalleDonacion'>;

const DetalleDonacion = () => {
  const route = useRoute<DetalleDonacionRouteProp>();
  const { donation } = route.params; // Obtener los datos del donativo

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Imagen principal */}
      <Image source={{ uri: 'https://via.placeholder.com/300' }} style={styles.mainImage} />

      {/* Miniaturas */}
      <View style={styles.thumbnailContainer}>
        <TouchableOpacity>
          <Image source={{ uri: 'https://via.placeholder.com/60' }} style={styles.thumbnail} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={{ uri: 'https://via.placeholder.com/60' }} style={styles.thumbnail} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={{ uri: 'https://via.placeholder.com/60' }} style={styles.thumbnail} />
        </TouchableOpacity>
      </View>

      {/* Opciones */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Comida</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Ropa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Medicina</Text>
        </TouchableOpacity>
      </View>

      {/* Datos de recolección */}
      <Text style={styles.sectionHeader}>Datos de recolección</Text>
      <View style={styles.textAreaContainer}>
      </View>

      {/* Comentarios previos */}
      <Text style={styles.sectionHeader}>Comentarios previo a la recolección</Text>
      <TextInput
        style={styles.commentBox}
        placeholder="Escribe tus comentarios..."
        placeholderTextColor="#ccc"
      />

      {/* Botón de aprobar */}
      <TouchableOpacity style={styles.approveButton}>
        <Text style={styles.approveButtonText}>Aprobar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#457B9D',
    flexGrow: 1,
  },
  mainImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#ccc',
  },
  thumbnailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 5,
    backgroundColor: '#ccc',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  option: {
    backgroundColor: '#1D3557',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  optionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionHeader: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textAreaContainer: {
    backgroundColor: '#6A8FA7',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    height: 80,
  },
  textArea: {
    height: 80,
    color: '#fff',
    textAlignVertical: 'top',
  },
  commentBox: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    color: '#000',
  },
  approveButton: {
    backgroundColor: '#E63946',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  approveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DetalleDonacion;
