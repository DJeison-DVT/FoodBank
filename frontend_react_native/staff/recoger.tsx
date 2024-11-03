import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Footer from './footer';

// Define the type for navigation screens
type RootStackParamList = {
  Dashboard: undefined;
  Pickup: undefined;
};

const Pickup = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const reviewCount = users.filter(user => user.status === 'Revisar').length;
  const pickUpCount = users.filter(user => user.status === 'Recoger').length;

  const handleNavigation = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* User List Items to Pick Up */}
        {users.filter(user => user.status === 'Recoger').map((user, index) => (
          <View key={index} style={styles.userItem}>
            <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.image} />
            <View style={styles.userDetails}>
              <TouchableOpacity style={styles.reviewButton}>
                <Text style={styles.buttonText}>Recoger</Text>
              </TouchableOpacity>
              <Text style={styles.userLabel}>{user.label}</Text>
              {user.additionalLabels && user.additionalLabels.map((label, i) => (
                <Text key={i} style={styles.userLabel}>{label}</Text>
              ))}
            </View>
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
  },
  scrollContainer: {
    paddingVertical: 20,
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
  image: {
    width: 100,
    height: 100,
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  userLabel: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reviewButton: {
    backgroundColor: '#E63946',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Pickup;
