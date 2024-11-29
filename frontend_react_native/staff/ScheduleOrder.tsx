import { UserData } from "@/helpers/auth";
import { Order } from "@/helpers/types";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const ScheduleOrder = ({ route, navigation }: any) => {
  const { order }: { order: Order } = route.params;
  const { user }: { user: UserData } = route.params;

  const [scheduleDate, setScheduleDate] = useState<string>("");
  const [timeRange, setTimeRange] = useState<string>("");

  const handleSubmit = async () => {
    try {
      const query = `http://localhost:8080/orders/schedule?user_id=${user.id}`;
      console.log(query);
      console.log({
        order_id: order.ID,
        pickup_date: scheduleDate,
        pickup_time: timeRange,
      });
      const response = await fetch(query, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: order.ID,
          pickup_date: scheduleDate,
          pickup_time: timeRange,
        }),
      });

      console.log(response);

      if (!response.ok) {
        throw new Error("Error al programar la orden");
      }

      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#fff" />
        <Text style={styles.backButtonText}>Regresar</Text>
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.header}>Programar Recolección</Text>

      {/* Form */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Fecha de Recolección:</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#A9A9A9"
          value={scheduleDate}
          onChangeText={setScheduleDate}
        />

        <Text style={styles.label}>Horario de Recolección:</Text>
        <TextInput
          style={styles.input}
          placeholder="HH:MM - HH:MM"
          placeholderTextColor="#A9A9A9"
          value={timeRange}
          onChangeText={setTimeRange}
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
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
  formContainer: {
    backgroundColor: "#6A8FA7",
    padding: 20,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    color: "#ECF0F1",
    marginBottom: 8,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#F1FAEE",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
    color: "#1D3557",
  },
  submitButton: {
    backgroundColor: "#2A9D8F",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ScheduleOrder;
