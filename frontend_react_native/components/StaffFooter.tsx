import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function StaffFooter({ navigation }: { navigation: any }) {
    return (
        <View style={styles.footer}>
            <TouchableOpacity
                style={styles.footerButton}
                onPress={() => navigation.navigate("Dashboard")}
            >
                <Text style={styles.footerButtonText}>Verificación</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.footerButton}
                onPress={() => navigation.navigate("Schedule")}
            >
                <Text style={styles.footerButtonText}>Programar</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.footerButton}
                onPress={() => navigation.navigate("Pickup")}
            >
                <Text style={styles.footerButtonText}>Recolección</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.footerButton}
                onPress={() => navigation.navigate("Historial")}
            >
                <Text style={styles.footerButtonText}>Historial</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 10,
        backgroundColor: "#1D3557",
    },
    footerButton: {
        backgroundColor: "#E63946",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    footerButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

