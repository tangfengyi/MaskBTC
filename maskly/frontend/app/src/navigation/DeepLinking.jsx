import React from 'react';
import { Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

const DeepLinking = () => {
    const handleDeepLink = (event) => {
        const data = Linking.parse(event.url);
        console.log('Deep link data:', data);
        // Handle deep link logic here
    };

    React.useEffect(() => {
        Linking.addEventListener('url', handleDeepLink);

        return () => {
            Linking.removeEventListener('url', handleDeepLink);
        };
    }, []);

    return null;
};

export default DeepLinking;

