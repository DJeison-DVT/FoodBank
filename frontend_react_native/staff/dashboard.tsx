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
} from "react-native";

const Dashboard = ({ route, navigation }: any) => {
  const [orders, setOrders] = useState<StaffOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = route.params;

  const fetchOrders = async () => {
    try {
      const query = `http://localhost:8080/orders?user_id=${user.id}`;
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

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const renderOrder = ({ item }: { item: StaffOrder }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate("VerDonacion", { order: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>Orden ID: {item.ID}</Text>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardText}>Cliente: {item.user.name || "N/A"}</Text>
        <Text style={styles.cardText}>Creado: {formatDate(item.CreatedAt)}</Text>
        <Text style={styles.cardText}>Dirección: {item.user.address}</Text>
      </View>

      <TouchableOpacity
        style={styles.detailButton}
        disabled
      >
        <Text style={styles.detailButtonText}>Ver Detalles</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Pending":
        return { color: "#FFA500" }; // Orange for pending
      case "Completed":
        return { color: "#2A9D8F" }; // Green for completed
      case "Rejected":
        return { color: "#E63946" }; // Red for rejected
      default:
        return { color: "#ECF0F1" }; // Default white
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <Header title="Verificación" />
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

export default Dashboard;
