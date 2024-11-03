import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type FooterProps = {
  reviewCount: number;
  pickUpCount: number;
  setCurrentScreen: (screen: 'Dashboard' | 'Pickup') => void;
};

export default function Footer({ reviewCount, pickUpCount, setCurrentScreen }: FooterProps) {
  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity style={styles.footerButton} onPress={() => setCurrentScreen('Dashboard')}>
        <Text style={styles.buttonText}>Revisar</Text>
        <Text style={styles.badge}>{reviewCount}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton} onPress={() => setCurrentScreen('Pickup')}>
        <Text style={styles.buttonText}>Recoger</Text>
        <Text style={styles.badge}>{pickUpCount}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#3b5a72',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#254b62',
    padding: 10,
    borderRadius: 5,
  },
  badge: {
    marginLeft: 10,
    backgroundColor: '#E63946',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
