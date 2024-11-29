import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Donation, StaffOrder } from "@/helpers/types";
import { OrderStatus, translateOrderStatus } from "@/helpers/translations";
import { UserData } from "@/helpers/auth";
import BackButton from "@/components/BackButton";

const DetalleOrden = ({ route, navigation }: any) => {
  const { user }: { user: UserData } = route.params;
  const { order }: { order: StaffOrder } = route.params;
  const [rejectedDonationsIDs, setRejectedDonationsIDs] = React.useState<number[]>([]);
  const [approvedDonationsIDs, setApprovedDonationsIDs] = React.useState<number[]>([]);
  const { nonEditable }: { nonEditable: boolean } = route.params || false;

  const handleSubmit = async () => {
    try {
      const query = `http://localhost:8080/orders/verification?user_id=${user.id}`
      console.log(query)
      console.log(JSON.stringify({
        order_id: order.ID,
        rejected_donations: rejectedDonationsIDs,
      }))
      const response = await fetch(query, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: order.ID,
          rejected_donations: rejectedDonationsIDs,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al verificar la orden");
      }

      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  const handleApproveDonation = (id: number) => {
    setApprovedDonationsIDs((prev) => [...prev, id]);
    setRejectedDonationsIDs((prev) => prev.filter((donationId) => donationId !== id)); // Remove from rejected if previously added
  };

  const handleRejectDonation = (id: number) => {
    setRejectedDonationsIDs((prev) => [...prev, id]);
    setApprovedDonationsIDs((prev) => prev.filter((donationId) => donationId !== id)); // Remove from approved if previously added
  };


  const renderDonation = ({ item }: { item: Donation }) => {
    const statusColor = (id: number) => {
      if (rejectedDonationsIDs.includes(id)) {
        return "#FFCDD2";
      } else if (approvedDonationsIDs.includes(id)) {
        return "#C8E6C9";
      }
      return "#ADD8E6";
    }


    return (
      <TouchableOpacity
        style={[styles.donationCard, { backgroundColor: statusColor(item.ID) }]}
        onPress={() =>
          navigation.navigate("DetalleDonacion", {
            donation: item,
            onApprove: (id: number) => handleApproveDonation(id),
            onReject: (id: number) => handleRejectDonation(id),
            nonEditable,
          })
        }
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

  useEffect(() => {
    const approvedIDs = order.donations
      .filter((donation) => donation.status === "Approved") // Filter donations with status "Approved"
      .map((donation) => donation.ID);
    setApprovedDonationsIDs(approvedIDs);
  }, []);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <BackButton onPress={() => navigation.goBack()} />

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

      {/* Submit Button */}
      {!nonEditable && rejectedDonationsIDs.length + approvedDonationsIDs.length === order.donations.length && (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Verificar</Text>
        </TouchableOpacity>
      )}
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
  submitButton: {
    backgroundColor: "#2A9D8F",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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

export default DetalleOrden;
