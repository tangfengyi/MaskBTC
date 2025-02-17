import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WalletDashboard = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Wallet Dashboard</Text>
            <Text style={styles.subtitle}>Manage your assets and transactions</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginTop: 10,
    },
});

export default WalletDashboard;

