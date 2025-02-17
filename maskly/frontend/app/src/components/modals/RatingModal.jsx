import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const RatingModal = ({ visible, onClose, onSubmit }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>请评价本次通话</Text>
                    
                    <TouchableOpacity 
                        style={[styles.button, styles.satisfiedButton]}
                        onPress={() => onSubmit('satisfied')}
                    >
                        <Text style={styles.buttonText}>满意 😊</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.button, styles.unsatisfiedButton]}
                        onPress={() => onSubmit('unsatisfied')}
                    >
                        <Text style={styles.buttonText}>不满�?😞</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Text style={styles.closeButtonText}>关闭</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    button: {
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 30,
        marginVertical: 5,
        minWidth: 200,
        alignItems: 'center',
    },
    satisfiedButton: {
        backgroundColor: '#4CAF50',
    },
    unsatisfiedButton: {
        backgroundColor: '#FF5722',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    closeButton: {
        marginTop: 15,
        padding: 10,
    },
    closeButtonText: {
        color: '#666',
        fontSize: 14,
    },
});

export default RatingModal;

