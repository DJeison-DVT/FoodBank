import { getJwtToken } from "@/helpers/auth";
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from "react-native";

const Profile = ({ route, navigation }: { route: any; navigation: any }) => {
    const { user } = route.params;
    const updateUser = route.params.updateUser;

    const [address, setAddress] = useState(user?.address || "");
    const [pickupDetails, setPickupDetails] = useState(user?.pickup_details || "");

    const handleSaveChanges = async () => {
        if (!address || !pickupDetails) {
            Alert.alert("Error", "Por favor completa todos los campos.");
            return;
        }
        try {
            const query = `http://localhost:8080/users?id=${user.id}`;
            const body = {
                address,
                pickupDetails,
            }
            const response = await fetch(query, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${await getJwtToken()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error("Failed to update user");
            }

            const updatedUser = await response.json(); // Assuming the API returns the updated user
            updateUser(updatedUser); // Update the global user state
            navigation.navigate("Donaciones", { user: updatedUser });
        } catch (error) {
            Alert.alert("Error", "Hubo un error al intentar guardar los cambios. Por favor intenta de nuevo en unos momentos.");
        }

    };

    useEffect(() => {
        setAddress(user?.address || "");
        setPickupDetails(user?.pickup_details || "");
    }, [user]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Perfil</Text>

            <Text style={styles.label}>Dirección:</Text>
            <TextInput
                style={styles.input}
                placeholder="Escribe tu dirección"
                placeholderTextColor="#A9A9A9"
                value={address}
                onChangeText={setAddress}
            />

            <Text style={styles.label}>Detalles de Recolección:</Text>
            <TextInput
                style={styles.input}
                placeholder="Escribe los detalles de recolección"
                placeholderTextColor="#A9A9A9"
                value={pickupDetails}
                onChangeText={setPickupDetails}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#457B9D",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#ECF0F1",
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: "#ECF0F1",
        alignSelf: "flex-start",
        marginBottom: 8,
    },
    input: {
        width: "100%",
        padding: 12,
        marginBottom: 20,
        borderRadius: 8,
        backgroundColor: "#1D3557",
        color: "#ECF0F1",
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: "#E63946",
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 8,
        alignItems: "center",
    },
    saveButtonText: {
        color: "#ECF0F1",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default Profile;
