import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { deleteJwtToken } from '@/helpers/auth';
import CryptoJS from 'crypto-js';

interface Donation {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  Type: string;
  Details: string;
  OrderID: number;
  // Images: string[];
}

export default function Donaciones({ navigation }: any) {
  const [donations, setDonations] = useState<Donation[]>([]);

  const encryptionKey = process.env.EXPO_PUBLIC_ENCRYPT_KEY;

  const fetchDonations = async () => {
    try {
      const response = await fetch("http://localhost:8080/donations");
      const data: Donation[] = await response.json();
      // Decrypt the donation details, type, and images
      const decryptedDonations = data.map((donation) => ({
        ...donation,
        Type: decryptData(donation.Type),
        Details: decryptData(donation.Details),
        // Images: donation.Images.map((imageUrl) => decryptData(imageUrl)), // Decrypt each image URL
      }));

      setDonations(decryptedDonations);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDonations();
    }, [])
  );

  // Decrypt encrypted data (Details, Type, Image URLs)
  const decryptData = (encryptedData: string): string => {
    if (!encryptionKey) {
      console.error("Encryption key is missing.");
      return "";
    }
    const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8); // Convert to UTF-8 string
  };


  // Render each donation card
  const renderDonation = ({ item, index }: { item: Donation; index: number }) => (
    <TouchableOpacity style={styles.donationCard}>
      <MaterialIcons name={getIconName(item.Type)} size={48} color="#E63946" />
      <View style={styles.cardContent}>
        <Text style={styles.indexText}>#{index + 1}</Text>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>Ver</Text>
        </TouchableOpacity>
        <Text style={styles.itemText}>{item.Type}</Text>
        <Text style={styles.detailsText}>{item.Details}</Text>
        <Text style={styles.statusText}>{formatDate(item.CreatedAt)}</Text>
      </View>
    </TouchableOpacity>
  );

  // Determine icon based on donation type
  const getIconName = (type: string) => {
    switch (type) {
      case "Medicine":
        return "medical-services";
      case "Food":
        return "restaurant";
      case "Clothing":
        return "checkroom";
      default:
        return "help-outline";
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={donations}
        keyExtractor={(item) => item.ID.toString()}
        renderItem={renderDonation}
        contentContainerStyle={styles.listContainer}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.footerButtonText}>Donando</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{donations.length}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Donation')}>
          <FontAwesome name="plus" size={24} color="#1D3557" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContainer: {
    padding: 16,
  },
  donationCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#F1FAEE",
    borderRadius: 8,
  },
  cardContent: {
    flex: 1,
    marginLeft: 16,
  },
  indexText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#457B9D",
  },
  viewButton: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: 8,
    backgroundColor: "#457B9D",
    borderRadius: 4,
  },
  viewButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  itemText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  detailsText: {
    fontSize: 16,
    color: "#1D3557",
    marginVertical: 4,
  },
  statusText: {
    fontSize: 14,
    color: "#6D6875",
    marginTop: 4,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#457B9D",
    borderRadius: 4,
    marginRight: 16,
  },
  footerButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  badge: {
    backgroundColor: "#E63946",
    borderRadius: 12,
    marginLeft: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  iconButton: {
    marginHorizontal: 8,
  },
});
