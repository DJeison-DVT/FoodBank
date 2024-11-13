import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';

const Donation = ({ navigation }: any) => {
    const [type, setType] = useState("Medicine");
    const [details, setDetails] = useState("");
    const [selectedImages, setSelectedImages] = useState<string[]>([]); // Track multiple images

    const handleImagePick = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Permission Denied", "You need to grant permission to access the camera roll.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            selectionLimit: 5, // Limit the number of images to select
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            // Add selected images to the state array
            const imageUris = result.assets.map((asset: any) => asset.uri);
            setSelectedImages(prevImages => [...prevImages, ...imageUris]); // Append selected images
        }
    };

    const handleSubmit = async () => {
        if (!type || !details) {
            Alert.alert("Error", "Please fill all fields.");
            return;
        }

        const donationData = {
            Type: type,
            Details: details,
            // Images: selectedImages, // Send all selected images
        };
        console.log("Donation", JSON.stringify(donationData));

        try {
            // You can upload images to S3 here or send URLs to backend after uploading
            const uploadedImageUrls = await uploadImagesToS3(selectedImages);
            console.log("uploadedImageUrls:",uploadedImageUrls)
            // donationData.Images = uploadedImageUrls; // Set the uploaded image URLs

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
                setSelectedImages([]); // Reset images after submission
                navigation.navigate("Donaciones");
            } else {
                Alert.alert("Error", "Failed to submit donation.");
            }
        } catch (error) {
            console.error("Error submitting donation:", error);
            Alert.alert("Error", "An error occurred while submitting donation.");
        }
    };

    const uploadImagesToS3 = async (images: string[]): Promise<string[]> => {
        const uploadedUrls: string[] = [];
        
        for (const imageUri of images) {
            const fileName = imageUri.split('/').pop(); // Extract the file name from the URI
    
            // Pass the filename as a query parameter
            const presignedUrlResponse = await fetch(`http://localhost:8080/generate-presigned-url?filename=${fileName}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            const presignedUrl = await presignedUrlResponse.json();
            const uploadUrl = presignedUrl.url; // This is the presigned URL
            console.log("uploadUrl:",uploadUrl )
            
            // Upload the image to S3 using the presigned URL
            const response = await fetch(uploadUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": "image/jpeg", // Adjust MIME type if necessary
                },
                body: await fetch(imageUri).then(res => res.blob()), // Fetch the image blob
            });
    
            if (response.ok) {
                const imageUrl = uploadUrl.split('?')[0]; // The public URL of the uploaded image (without the query params)
                uploadedUrls.push(imageUrl);
            } else {
                Alert.alert("Error", "Image upload failed.");
                break;
            }
        }
    
        return uploadedUrls;
    };
    

    const removeImage = (uri: string) => {
        setSelectedImages(prevImages => prevImages.filter(imageUri => imageUri !== uri));
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
            <Text style={styles.label}>Images</Text>
            <Button title="Pick Images" onPress={handleImagePick} />

            {/* Display multiple images with remove option */}
            <ScrollView horizontal contentContainerStyle={styles.imagePreviewContainer}>
                {selectedImages.map((uri, index) => (
                    <View key={index} style={styles.imageWrapper}>
                        <Image source={{ uri }} style={styles.imagePreview} />
                        <TouchableOpacity onPress={() => removeImage(uri)} style={styles.removeButton}>
                            <Text style={styles.removeText}>X</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

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
    imagePreviewContainer: {
        flexDirection: "row",
        marginVertical: 10,
    },
    imageWrapper: {
        position: 'relative',
        marginRight: 10,
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    removeButton: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
        borderRadius: 50,
        padding: 5,
    },
    removeText: {
        color: 'white',
        fontSize: 18,
    },
});

export default Donation;
