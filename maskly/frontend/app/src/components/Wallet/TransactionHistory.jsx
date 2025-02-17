import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const TransactionHistory = () => {
    const transactions = [
        { id: '1', type: 'Send', amount: '5 MASK', date: '2023-10-01' },
        { id: '2', type: 'Receive', amount: '10 MASK', date: '2023-10-02' },
        { id: '3', type: 'Swap', amount: '3 ETH -> 5 MASK', date: '2023-10-03' },
    ];

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.type}>{item.type}</Text>
            <Text style={styles.amount}>{item.amount}</Text>
            <Text style={styles.date}>{item.date}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Transaction History</Text>
            <FlatList
                data={transactions}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    item: {
        padding: 15,
        marginVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    type: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    amount: {
        fontSize: 16,
        color: '#333',
    },
    date: {
        fontSize: 14,
        color: '#666',
    },
});

export default TransactionHistory;

