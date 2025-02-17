import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BiometricAuthModule from '../../native/BiometricAuth';

const BiometricAuth = () => {
const [authStatus, setAuthStatus] = useState(null);

const handleAuthenticate = async () => {
    try {
        const result = await BiometricAuthModule.authenticate();
        if (result.success) {
            setAuthStatus('Authentication successful!');
        } else {
            setAuthStatus('Authentication failed. Please try again.');
        }
    } catch (error) {
        setAuthStatus('An error occurred during authentication.');
        console.error(error);
    }
};

    return (
<View style={styles.container}>
    <Text style={styles.title}>Biometric Authentication</Text>
    <TouchableOpacity style={styles.button} onPress={handleAuthenticate}>
        <Text style={styles.buttonText}>Authenticate</Text>
    </TouchableOpacity>
    {authStatus && (
        <Text style={styles.statusText}>
            {authStatus}
        </Text>
    )}
</View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    statusText: {
        marginTop: 20,
        fontSize: 16,
        color: '#555',
    },
});

export default BiometricAuth;

