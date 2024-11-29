import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Header = ({ title }: { title: string }) => {
    return (
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>{title}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        paddingVertical: 15,
        backgroundColor: "#457B9D",
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderColor: "#ccc",
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#ECF0F1",
    },
});

export default Header;
