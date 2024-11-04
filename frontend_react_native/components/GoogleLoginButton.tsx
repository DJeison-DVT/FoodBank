import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { Image, Pressable, StyleSheet, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { TokenResponse } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export const GoogleLoginButton = () => {
    const [authentication, setAuthentication] = useState<TokenResponse>();
    const [userInfo, setUserInfo] = useState();

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    });

    useEffect(() => {
        console.log('response', response);
        if (response?.type === 'success' && response.authentication) {
            setAuthentication(response.authentication);
        }
    }, [response]);

    const registerAccessToken = async () => {
        try {
            if (!authentication) {
                console.error('No authentication data');
                return;
            }

            if (!authentication.expiresIn) {
                console.error('No expiration time');
                return;
            }

            const formBody = new URLSearchParams({
                access_token: authentication.accessToken,
                expires_in: authentication.expiresIn.toString(),
                issued_at: authentication.issuedAt.toString(),
                token_type: authentication.tokenType,
            }).toString();

            const res = await fetch("http://localhost:8080/register-token", {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formBody,
            });

            const data = await res.json();
            console.log('User info:', data);
            setUserInfo(data);
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };


    return (
        <>
            <Pressable style={styles.pressable} onPress={() => promptAsync()}>
                <Image source={require('../assets/images/google.png')} style={styles.icon} />
                <Text style={styles.buttonText}>Continuar con Google</Text>
            </Pressable>
        </>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#457B9D",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    title: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    pressable: {
        backgroundColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
        width: '100%',
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    buttonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: '500',
    },
    orText: {
        color: 'white',
        marginVertical: 20,
        fontSize: 16,
        fontWeight: 'bold',
    },
    textInput: {
        backgroundColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginVertical: 8,
        width: '100%',
        fontSize: 16,
        color: '#333',
    }
});
