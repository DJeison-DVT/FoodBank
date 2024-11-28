import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { deleteJwtToken, getJwtToken } from '@/helpers/auth';
import CryptoJS from 'crypto-js';

export default function ActiveOrder({ route, navigation }: { route: any; navigation: any }) {
  const [order, setOrder] = useState<Order | null>(null);
  const { user } = route.params;

  const encryptionKey = process.env.EXPO_PUBLIC_ENCRYPT_KEY;

  const getActiveOrder = async () => {
    try {
      const query = `http://localhost:8080/orders?user_id=${user.id}`;
      let response = await fetch(query, {
        headers: {
          Authorization: `Bearer ${await getJwtToken()}`,
        },
      });

      if (response.ok && response.status === 204) {
        // Create a new order if no active order exists
        response = await fetch(query, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${await getJwtToken()}`,
          },
        });
      }

      if (!response.ok) {
        console.error('Failed to fetch order:', response.status, response.statusText);
        return;
      }

      const data: Order = await response.json();

      data.donations = decryptDonations(data.donations);

      console.log('Active order:', data);
      setOrder(data);
    } catch (error) {
      console.error('Error fetching active order:', error);
    }
  };


  const decryptDonations = (donations: Donation[]) => {
    const decryptedDonations = donations.map((donation) => ({
      ...donation,
      type: decryptData(donation.type),
      details: decryptData(donation.details),
      images: donation.images.map((imageUrl) => decryptData(imageUrl)),
    }));

    return decryptedDonations;
  };

  useFocusEffect(
    useCallback(() => {
      getActiveOrder();
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


  const renderDonation = ({ item, index, navigation }: { item: Donation; index: number; navigation: any }) => (
    <TouchableOpacity
      style={styles.donationCard}
      onPress={() => {
        console.log('Donation:', item);
        navigation.navigate('DonationDetailView', { donation: item })
      }} // Navigate to detailed view
    >
      <MaterialIcons
        name={getIconName(item.type)}
        size={48}
        color="#E63946"
      />

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.indexText}>#{index + 1}</Text>
        </View>

        {/* Donation Details */}
        <Text style={styles.itemText}>{item.type}</Text>
        <Text style={styles.detailsText}>{item.details}</Text>
        <Text style={styles.statusText}>Created: {formatDate(item.CreatedAt)}</Text>
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

  if (!order) {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color="#1D3557" />
        <Text style={styles.spinnerText}>Loading your order...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={order.donations}
        renderItem={(itemData) => renderDonation({ ...itemData, navigation })}
        keyExtractor={(item) => item.ID.toString()}
        contentContainerStyle={styles.listContainer}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.footerButtonText}>Donando</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{order.donations?.length || '0'}</Text>
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  spinnerText: {
    marginTop: 10,
    fontSize: 16,
    color: '#1D3557',
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
