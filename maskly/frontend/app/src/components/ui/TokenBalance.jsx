import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TokenBalance = ({ balance }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Token Balance:</Text>
            <Text style={styles.balance}>{balance} MASK</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    balance: {
        fontSize: 20,
        color: '#333',
    },
});

export default TokenBalance;

