//import liraries
import React, { Component, useEffect } from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';
import Register from './src/Auth/RegisterScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/Auth/Login';
import Splash from './src/Auth/Splash';
import List from './src/Main/List';
import CartScreen from './src/Main/Cart';
import { Provider } from 'react-redux';
import store from './src/Redux/Store';


const Stack = createNativeStackNavigator();

// create a component
const App = () => {

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register}
            options={{
              headerShown: true
            }}
          />
          <Stack.Screen name="List" component={List}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen name="Cart" component={CartScreen}
            options={{
              headerShown: false
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default App;
