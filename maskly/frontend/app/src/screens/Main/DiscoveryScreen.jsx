import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DiscoveryScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Discovery Screen</Text>
            <Text style={styles.subtitle}>Explore new connections and opportunities</Text>
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

export default DiscoveryScreen;

