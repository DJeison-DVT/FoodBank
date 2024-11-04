import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Update this import

const Donation = ({ navigation }: any) => {
    const [type, setType] = useState("Medicine");
    const [details, setDetails] = useState("");

    const handleSubmit = async () => {
        if (!type || !details) {
            Alert.alert("Error", "Please fill all fields.");
            return;
        }

        const donationData = {
            Type: type,
            Details: details,
        };
        console.log("Donation", JSON.stringify(donationData))

        try {
            const response = await fetch("http://localhost:8080/donations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(donationData),
            });

            if (response.ok) {
                Alert.alert("Success", "Donation submitted successfully!");
                setDetails("");
                setType("Medicine");
                navigation.navigate("Donaciones");
            } else {
                Alert.alert("Error", "Failed to submit donation.");
            }
        } catch (error) {
            console.error("Error submitting donation:", error);
            Alert.alert("Error", "An error occurred while submitting donation.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Donation Type</Text>
            <Picker
                selectedValue={type}
                style={styles.picker}
                onValueChange={(itemValue: string) => setType(itemValue)}
            >
                <Picker.Item label="Medicina" value="Medicine" />
                <Picker.Item label="Comida" value="Food" />
                <Picker.Item label="Ropa" value="Clothing" />
            </Picker>

            <Text style={styles.label}>Details</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter donation details"
                value={details}
                onChangeText={setDetails}
            />

            <Button title="Submit Donation" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    picker: {
        height: 50,
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        paddingHorizontal: 8,
        marginBottom: 16,
    },
});

export default Donation;
