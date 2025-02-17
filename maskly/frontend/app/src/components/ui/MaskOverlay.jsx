import React from 'react';
import { View, StyleSheet } from 'react-native';
import ARFaceTracking from '../../native/ARFaceTracking';

const MaskOverlay = () => {
    return (
        <View style={styles.container}>
            <ARFaceTracking />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
    },
});

export default MaskOverlay;

