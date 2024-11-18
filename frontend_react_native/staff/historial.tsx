import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Footer from './footer';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Asegúrate de tener esta biblioteca instalada.

type RootStackParamList = {
  Dashboard: undefined;
  Pickup: undefined;
  Historial: undefined;
};

const Historial = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const reviewCount = users.filter(user => user.status === 'Revisar').length;
  const pickUpCount = users.filter(user => user.status === 'Recoger').length;

  const handleNavigation = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Historial:</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {users.map((user, index) => (
          <View key={index} style={styles.userItem}>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="chevron-left" size={24} color="#fff" />
            </TouchableOpacity>
            <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.image} />
            <View style={styles.userDetails}>
              <TouchableOpacity style={styles.reviewButton}>
                <Text style={styles.buttonText}>Descripción</Text>
              </TouchableOpacity>
              <Text style={styles.userLabel}>{`#70 ${user.label}. ${user.additionalLabels?.join(', ') || ''}`}</Text>
            </View>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="chevron-right" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Footer Component */}
        <Footer reviewCount={reviewCount} pickUpCount={pickUpCount} setCurrentScreen={handleNavigation} />
    </View>
  );
};

const users = [
  { label: 'Medicina', status: 'Revisar' },
  { label: 'Medicina', status: 'Revisar', additionalLabels: ['Ropa', 'Comida'] },
  { label: 'Comida', status: 'Recoger' },
  { label: 'Ropa', status: 'Recoger' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#457B9D',
    paddingTop: 20,
  },
  header: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 10,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6a8fa7',
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  image: {
    width: 60,
    height: 60,
    marginHorizontal: 10,
    borderRadius: 30,
    backgroundColor: '#ccc',
  },
  userDetails: {
    flex: 1,
    flexDirection: 'column',
  },
  userLabel: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
  },
  reviewButton: {
    backgroundColor: '#1D3557',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#254b62',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1D3557',
    padding: 10,
    borderRadius: 5,
  },
  footerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 5,
  },
  badge: {
    backgroundColor: '#E63946',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontWeight: 'bold',
  },
  iconFooter: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1D3557',
    borderRadius: 5,
  },
});

export default Historial;
