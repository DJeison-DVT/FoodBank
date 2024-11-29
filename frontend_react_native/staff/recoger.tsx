import Header from "@/components/Header";
import StaffFooter from "@/components/StaffFooter";
import { getJwtToken } from "@/helpers/auth";
import { decryptDonations } from "@/helpers/crypto";
import { StaffOrder } from "@/helpers/types";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";

const Pickup = ({ route, navigation }: any) => {
  const [orders, setOrders] = useState<StaffOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = route.params;

  const fetchOrders = async () => {
    try {
      const query = `http://localhost:8080/orders/pickup?user_id=${user.id}`;
      const response = await fetch(query, {
        headers: {
          Authorization: `Bearer ${getJwtToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching orders");
      }
      const data: StaffOrder[] = await response.json();
      for (const order of data) {
        order.donations = decryptDonations(order.donations);
      }
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePickUp = async (order_id: number) => {
    try {
        let response = await fetch(`http://localhost:8080/orders/pickup?user_id=${user.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ order_id: order_id }),
        });

        if (response.ok) {
            Alert.alert("Success", "Order picked up successfully!");
            navigation.navigate("Historial");
        } else {
            Alert.alert("Error", "Failed to pick up order.");
        }
    } catch (error) {
        console.error("Error picking up order:", error);
        Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const renderOrder = ({ item }: { item: StaffOrder }) => (
    <TouchableOpacity
      style={styles.orderCard}
      // TODO Si quieres meter un detail view para que hay sea la camara
      // onPress={() => navigation.navigate("QRPickUp", { order: item })}
      onPress={() => handlePickUp(item.ID)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>Orden ID: {item.ID}</Text>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardText}>Cliente: {item.user.name || "N/A"}</Text>
        <Text style={styles.cardText}>Creado: {formatDate(item.CreatedAt)}</Text>
        <Text style={styles.cardTextImportant}>Dirección: {item.user.address}</Text>
        <Text style={styles.cardTextImportant}>Indicaciones de entrega: {item.user.pickup_details}</Text>
        {item.PickupDate && (
          <Text style={styles.cardTextImportant}>Fecha de recolección agendada: {formatDate(item.PickupDate)}</Text>
        )}
        {item.PickupTime && (
          <Text style={styles.cardTextImportant}>Hora de recolección agendada: {item.PickupTime}</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.detailButton}
        disabled
      >
        <Text style={styles.detailButtonText}>Recoger</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <Header title="Recoger" />
      {loading ? (
        <ActivityIndicator size="large" color="#ECF0F1" />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.ID.toString()}
          contentContainerStyle={styles.scrollContainer}
        />
      )}

      <StaffFooter navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#457B9D",
  },
  scrollContainer: {
    paddingVertical: 20,
  },
  orderCard: {
    backgroundColor: "#1D3557",
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    padding: 15,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ECF0F1",
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: "bold",
  },
  cardBody: {
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    color: "#ECF0F1",
  },
  cardTextImportant: {
    fontSize: 16,
    color: "#ECF0F1",
    fontWeight: "bold",
  },
  detailButton: {
    backgroundColor: "#E63946",
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  detailButtonText: {
    color: "#ECF0F1",
    fontWeight: "bold",
  },
});

export default Pickup;
