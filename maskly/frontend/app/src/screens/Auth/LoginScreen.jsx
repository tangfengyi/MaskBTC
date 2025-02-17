import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

const validateInputs = () => {
    const isValidUsername = /^[a-zA-Z0-9_\-\.]+$/.test(username);
    if (username.length < 1 || username.length > 64 || !isValidUsername) {
        alert('Username must be 1-64 characters and only contain letters, numbers, underscores, hyphens, or dots.');
        return false;
    }
    if (password.length < 8 || password.length > 64) {
        alert('Password must be 8-64 characters.');
        return false;
    }
    return true;
};

const handleLogin = () => {
    if (!validateInputs()) return;
    
    // Simulate API call for authentication
    fetch('https://api.example.com/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Login failed');
            }
        })
        .then((data) => {
            console.log('Login successful:', data);
            navigation.navigate('Home');
        })
        .catch((error) => {
            console.error('Error during login:', error.message);
            alert('Login failed. Please check your credentials.');
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
                <Text style={styles.link}>Don't have an account? Register here</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5', // Added background color
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333', // Improved text color
    },
    input: {
        width: '80%',
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 25,
        backgroundColor: '#fff', // Added background color
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1, // Added letter spacing
    },
    link: {
        marginTop: 25,
        color: '#007bff',
        textDecorationLine: 'underline',
        fontSize: 16, // Adjusted font size
    },
});

export default LoginScreen;

