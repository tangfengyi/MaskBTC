import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/Main/HomeScreen';
import MatchScreen from '../screens/Main/MatchScreen';
import DiscoveryScreen from '../screens/Main/DiscoveryScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegistrationScreen from '../screens/Auth/RegistrationScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Match" component={MatchScreen} />
                <Stack.Screen name="Discovery" component={DiscoveryScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Registration" component={RegistrationScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;

