import { Donation } from '@/helpers/types';
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Button } from 'react-native';

const DonationDetailView = ({ route, navigation }: { route: any; navigation: any }) => {
    const { donation }: { donation: Donation } = route.params;

    type DonationType = 'Medicine' | 'Food' | 'Clothes';
    type DonationStatus = 'BeingModified' | 'Completed' | 'Pending';

    const traductions: Record<DonationType | DonationStatus, string> = {
        Medicine: 'Medicina',
        Food: 'Comida',
        Clothes: 'Ropa',
        BeingModified: 'Siendo Modificada',
        Completed: 'Completada',
        Pending: 'Pendiente',
    };

    return (
        <ScrollView style={styles.container}>
            {/* Title */}
            <Text style={styles.title}>Detalles de la Donación</Text>

            {/* Donation Information */}
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Tipo:</Text>
                <Text style={styles.value}>
                    {traductions[donation.type as keyof typeof traductions] || donation.type}
                </Text>

                <Text style={styles.label}>Detalles:</Text>
                <Text style={styles.value}>{donation.details}</Text>

                <Text style={styles.label}>Estado:</Text>
                <Text style={styles.value}>
                    {traductions[donation.status as keyof typeof traductions] || donation.status}
                </Text>

                <Text style={styles.label}>Creado el:</Text>
                <Text style={styles.value}>{formatDate(donation.CreatedAt)}</Text>

                <Text style={styles.label}>Actualizado el:</Text>
                <Text style={styles.value}>{formatDate(donation.UpdatedAt)}</Text>
            </View>

            {/* Images */}
            {donation.images.length > 0 ? (
                <View style={styles.imageContainer}>
                    <Text style={styles.label}>Imágenes:</Text>
                    {donation.images.map((image, index) => (
                        <Image
                            key={index}
                            source={{ uri: image }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    ))}
                </View>
            ) : (
                <Text style={styles.noImagesText}>No hay imágenes disponibles.</Text>
            )}

            {/* Back Button */}
            <View style={styles.buttonContainer}>
                <Button title="Regresar" onPress={() => navigation.goBack()} color="#457B9D" />
            </View>
        </ScrollView>
    );
};

const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('es-ES', options); // Force Spanish localization
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1D3557',
        marginBottom: 16,
    },
    infoContainer: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#F1FAEE',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E9ECEF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#457B9D',
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        color: '#1D3557',
        marginBottom: 12,
    },
    imageContainer: {
        marginBottom: 16,
    },
    image: {
        width: '100%',
        height: 200,
        marginVertical: 8,
        borderRadius: 8,
    },
    noImagesText: {
        fontSize: 16,
        color: '#6C757D',
        textAlign: 'center',
        marginVertical: 16,
    },
    buttonContainer: {
        marginTop: 16,
    },
});

export default DonationDetailView;
