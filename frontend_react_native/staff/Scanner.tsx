import { Camera, CameraView } from "expo-camera";
import { Stack } from "expo-router";
import {
  AppState,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Alert,
  Dimensions
} from "react-native";
import { useState, useEffect, useRef } from "react";

const { width, height } = Dimensions.get('window');

const Scanner = () => {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const [qrCodeData, setQrCodeData] = useState<string>();

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Function to handle QR code data
  const handleQrCode = (data: string) => {
    setQrCodeData(data);
    console.log("QR Code detected:", data);
    
    // Show an alert to confirm QR code detection
    Alert.alert(
      "QR Code Scanned", 
      `Detected: ${data}`, 
      [{ text: "OK", onPress: () => console.log("Alert dismissed") }]
    );
  };

  return (
    <SafeAreaView style={styles.scannerContainer}>
      <Stack.Screen
        options={{
          title: "Overview",
          headerShown: false,
        }}
      />
      {Platform.OS === "android" ? <StatusBar hidden /> : null}
      
      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={({ data }) => {
            console.log("Barcode scanning triggered with data:", data);
            if (data && !qrLock.current) {
              qrLock.current = true;
              handleQrCode(data);
              setTimeout(() => {
                qrLock.current = false;
              }, 500);
            }
          }}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'pdf417'], // Added more barcode types for broader scanning
          }}
        />
      </View>
      
      {/* Display QR Code data */}
      {qrCodeData && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            Scanned QR Code: {qrCodeData}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    width: width * 0.9,  // 90% of screen width
    height: width * 0.9, // Square aspect ratio
    overflow: 'hidden',
    borderRadius: 10,
  },
  camera: {
    flex: 1,  // Use flex to fill the container
    width: '100%',
    height: '100%',
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
  },
  resultText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  }
});

export default Scanner;