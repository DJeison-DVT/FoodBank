import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import Scanner from './Scanner';  // Import your Scanner component

const QRPickUp = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [hasPermission, setHasPermission] = useState(false);

  const isPermissionGranted = Boolean(permission?.granted);

  // Request permission and update the state
  const handlePermissionRequest = async () => {
    await requestPermission();
    setHasPermission(permission?.granted || false);
  };

  return (
    <SafeAreaView style={styles.container}>
        <Text style={styles.title}>QR Code Scanner</Text>
        <Pressable onPress={handlePermissionRequest}>
          <Text style={styles.buttonStyle}>Request Permissions</Text>
        </Pressable>
        {isPermissionGranted && (
        <View style={styles.scannerWrapper}>
            <Scanner />
        </View>
        )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#457B9D",
    },
    title: {
      color: 'white',
      fontSize: 40,
      textAlign: 'center',
      paddingTop: 20
    },
    buttonStyle: {
      color: 'black',
      fontSize: 20,
      textAlign: 'center',
      marginBottom: 20
    },
    scannerWrapper: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',  // Center the scanner view in the screen
      width: '100%',
    }
  });

export default QRPickUp;
