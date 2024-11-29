import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { StaffOrder } from "@/helpers/types";
import { OrderStatus, translateOrderStatus } from "@/helpers/translations";

const VerDonacion = ({ route, navigation }: any) => {
  const { order }: { order: StaffOrder } = route.params;

  const renderDonation = ({ item }: { item: any }) => {
    const getBackgroundColor = (status: string) => {
      switch (status) {
        case "Pending":
          return "#ADD8E6"; // Light blue for pending
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
        onPress={() => navigation.navigate("DetalleDonacion", { donation: item })}
      >
        <Image source={{ uri: item.images?.[0] || "https://via.placeholder.com/100" }} style={styles.image} />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.indexText}>Estado: {item.status}</Text>
          </View>
          <Text style={styles.itemText}>Tipo: {item.type}</Text>
          <Text style={styles.detailsText}>Detalles: {item.details}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#fff" />
        <Text style={styles.backButtonText}>Regresar</Text>
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.header}>Detalles de la Orden</Text>

      {/* Order Info */}
      <View style={styles.orderDetails}>
        <Text style={styles.infoText}>ID de Orden: {order.ID}</Text>
        <Text style={styles.infoText}>Estado: {translateOrderStatus(order.status)}</Text>
        <Text style={styles.infoText}>Nombre del Usuario: {order.user.name}</Text>
        <Text style={styles.infoText}>Correo Electrónico: {order.user.email}</Text>
        <Text style={styles.infoText}>Dirección: {order.user.address || "No proporcionada"}</Text>
        <Text style={styles.infoText}>
          Detalles de Recolección: {order.user.pickup_details || "No proporcionados"}
        </Text>

        {order.status == OrderStatus.Scheduled && (
          <>
            <Text style={styles.infoText}>Fecha de Recolección: {order.PickupDate || "No asignada"}</Text>
            <Text style={styles.infoText}>Hora de Recolección: {order.PickupTime || "No asignada"}</Text>
          </>
        )}
      </View>

      {/* Donations List */}
      <FlatList
        data={order.donations}
        renderItem={renderDonation}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#457B9D",
    padding: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  header: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  orderDetails: {
    backgroundColor: "#6A8FA7",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoText: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 5,
  },
  listContainer: {
    paddingBottom: 20,
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
  image: {
    width: 60,
    height: 60,
    marginRight: 15,
    backgroundColor: "#ccc",
    borderRadius: 5,
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
  itemText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  detailsText: {
    fontSize: 16,
    color: "#1D3557",
    marginVertical: 4,
  },
});

export default VerDonacion;
