import { Text, View, StyleSheet, Pressable, Image} from "react-native";
import React from "react";

export default function Index() {
  return (
    <View
      style={styles.container}>
      <Text style={styles.text}>Iniciar sesión</Text>
      <Pressable style={styles.pressable}>
        <Text>Continuar con Google</Text>
      </Pressable>
      <Pressable style={styles.pressable}>
        <Text>Continuar con Instagram</Text>
      </Pressable>
      <Pressable style={styles.pressable}>
        <Text>Continuar con Microsoft</Text>
      </Pressable>
      <Pressable style={styles.pressable}>
        <Text>Continuar con Apple</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#457B9D",
    alignItems: "center",
    justifyContent: "center"
  }, 

  text:{
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold'
  },

  pressable:{
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    margin: 10,
    width: 200,
    alignItems: 'center'
  }
});