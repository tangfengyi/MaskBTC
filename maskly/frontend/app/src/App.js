import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <LoginForm />
      <RegisterForm />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
});

export default App;

