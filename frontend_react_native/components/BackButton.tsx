import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface BackButtonProps {
    onPress: () => void;
    text?: string; // Optional prop for customizable text
}

const BackButton: React.FC<BackButtonProps> = ({ onPress, text = "Regresar" }) => {
    return (
        <TouchableOpacity style={styles.backButton} onPress={onPress}>
            <Icon name="arrow-back" size={24} color="#fff" />
            <Text style={styles.backButtonText}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
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
});

export default BackButton;
