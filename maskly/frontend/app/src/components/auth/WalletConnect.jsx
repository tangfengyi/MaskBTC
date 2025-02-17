import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import WalletConnectModule from '../../native/WalletConnect';

const WalletConnect = () => {
    const [walletAddress, setWalletAddress] = useState('');

    const handleConnect = async () => {
        try {
            const result = await WalletConnectModule.connect(walletAddress);
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Connect Your Wallet</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Wallet Address"
                value={walletAddress}
                onChangeText={setWalletAddress}
            />
            <TouchableOpacity style={styles.button} onPress={handleConnect}>
                <Text style={styles.buttonText}>Connect</Text>
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
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default WalletConnect;

