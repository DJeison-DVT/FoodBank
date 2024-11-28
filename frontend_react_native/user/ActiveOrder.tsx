import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { deleteJwtToken, getJwtToken } from '@/helpers/auth';
import CryptoJS from 'crypto-js';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export default function ActiveOrder({ route, navigation }: { route: any; navigation: any }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [disabled, setDisabled] = useState(false);
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

  const handleDelete = async (id: number) => {
    setDisabled(true);
    try {
      const query = `http://localhost:8080/donations?id=${id}`;
      const response = await fetch(query, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${await getJwtToken()}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to delete donation:', response.status, response.statusText);
        return;
      }

      getActiveOrder();
    } catch (error) {
      console.error('Error deleting donation:', error);
    }
    setDisabled(false);
  };

  const handleConfirmOrder = async () => {
    const query = `http://localhost:8080/orders/verification?user_id=${user.id}`;
    const response = await fetch(query, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getJwtToken()}`,
      },

    });

    if (!response.ok) {
      console.error('Failed to confirm order:', response.status, response.statusText);
      return;
    }

    getActiveOrder();
  };



  const renderDonation = ({
    item,
    index,
    navigation,
    onDelete,
    deletable,
  }: {
    item: Donation;
    index: number;
    navigation: any;
    onDelete: (id: number) => void;
    deletable: boolean;
  }) => {
    const getBackgroundColor = (status: string) => {
      switch (status) {
        case "Pending":
          return "#ADD8E6";
        case "Approved":
          return "#C8E6C9"; // Light green for approved
        case "Rejected":
          return "#FFCDD2"; // Light red for rejected
        default:
          return "#E0E0E0"; // Light gray for unknown statuses
      }
    };

    return (

      <TouchableOpacity
        style={[styles.donationCard, { backgroundColor: getBackgroundColor(item.status) }]}
        onPress={() => {
          console.log('Donation:', item);
          navigation.navigate('DonationDetailView', { donation: item });
        }} // Navigate to detailed view'
        disabled={disabled}
      >
        <MaterialIcons name={getIconName(item.type)} size={48} color="#E63946" />

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.indexText}>#{index + 1}</Text>

            {/* Delete Button */}
            {deletable && (
              <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item.ID)}>
                <Text style={styles.deleteButtonText}>Eliminar</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Donation Details */}
          <Text style={styles.itemText}>{item.type}</Text>
          <Text style={styles.detailsText}>{item.details}</Text>
          <Text style={styles.statusText}>Creado: {formatDate(item.CreatedAt)}</Text>
        </View>
      </TouchableOpacity>
    )
  };

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

  const canBeModified = () => {
    return order.status == 'BeingModified';
  }

  const canBeDeleted = () => {
    return order.status == 'NeedsToBeChecked';
  }

  const renderStatusComponent = (status: string) => {
    switch (status) {
      case "NeedsToBeChecked":
        return (
          <View style={styles.statusContainer}>
            <Text style={styles.errorText}>
              Estado: La donación contiene artículos inválidos. Por favor, corrige los errores.
            </Text>
          </View>
        );

      case "NeedsToBeVerified":
        return (
          <View style={styles.statusContainer}>
            <Text style={styles.infoText}>
              Estado: La donación está esperando verificación del personal.
            </Text>
          </View>
        );

      case "Verified":
        return (
          <View style={styles.statusContainer}>
            <Text style={styles.successText}>
              Estado: ¡La donación ha sido aprobada! Gracias por tu apoyo.
            </Text>
          </View>
        );

      case "Scheduled":
        return (
          <View style={styles.statusContainer}>
            <Text style={styles.infoText}>
              Estado: La recolección ha sido programada. Por favor, consulta los detalles de recolección.
            </Text>
          </View>
        );

      default:
        return (
          <View style={styles.statusContainer}>
            <Text style={styles.defaultText}>
              Estado: Desconocido. Por favor, contacta al soporte.
            </Text>
          </View>
        );
    }
  };


  return (
    <View style={styles.container}>
      {!canBeModified() && (
        renderStatusComponent(order.status)
      )}
      <FlatList
        data={order.donations}
        renderItem={(itemData) => renderDonation({ ...itemData, navigation, onDelete: handleDelete, deletable: canBeDeleted() })}
        keyExtractor={(item) => item.ID.toString()}
        contentContainerStyle={styles.listContainer}
      />

      {order.donations.length > 1 && canBeModified() && (
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmOrder}
        >
          <Text style={styles.confirmButtonText}>Confirmar Donaciones</Text>
        </TouchableOpacity>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.footerButtonText}>Donando</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{order.donations?.length || '0'}</Text>
          </View>
        </TouchableOpacity>
        {canBeModified() && (
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Donation')} disabled={disabled}>
            <FontAwesome name="plus" size={24} color="#1D3557" />
          </TouchableOpacity>
        )
        }
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
  statusContainer: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  errorText: {
    fontSize: 16,
    color: "#E63946", // Red for errors
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 16,
    color: "#1D3557", // Blue for information
    fontWeight: "bold",
  },
  successText: {
    fontSize: 16,
    color: "#2A9D8F", // Green for success
    fontWeight: "bold",
  },
  defaultText: {
    fontSize: 16,
    color: "#6C757D", // Gray for unknown statuses
    fontWeight: "bold",
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
  confirmButton: {
    position: 'absolute',
    bottom: 80, // Just above the footer
    left: 16,
    right: 16,
    backgroundColor: '#457B9D',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  deleteButton: {
    backgroundColor: '#E63946',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-end',
    marginLeft: 'auto',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

});
