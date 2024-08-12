// Import libraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, Pressable, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Helper functions for dimension calculations
const calculateHeightPercentage = percentage => (windowHeight * percentage) / 100;
const calculateWidthPercentage = percentage => (windowWidth * percentage) / 100;
const calculateFontSizePercentage = percentage => {
    const baseDimension = Math.min(windowWidth, windowHeight);
    return (baseDimension * percentage) / 100;
};

// Create a component
const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isSecureEntry, setIsSecureEntry] = useState(true);


    const isValidEmail = email => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
    const isValidPassword = password => password.length >= 6;

    const handleLogin = async () => {
        setEmailError('');
        setPasswordError('');
      
        // Validate email
        if (!email.trim()) {
          setEmailError('Please enter your Email.');
          return;
        }
      
        if (!isValidEmail(email.trim())) {
          setEmailError('Please enter a valid email.');
          return;
        }
      
        // Validate password
        if (!password.trim()) {
          setPasswordError('Please enter your Password.');
          return;
        }
      
        if (!isValidPassword(password.trim())) {
          setPasswordError('Password must be at least 6 characters long.');
          return;
        }
      
        try {
          const data = await AsyncStorage.getItem('UserData');
          const userData = JSON.parse(data);
      
          if (userData) {
            // Check if email matches
            if (userData.email !== email.trim()) {
              Alert.alert("Login Error", 'Invalid email.');
              return;
            }
      
            // Check if password matches
            if (userData.password !== password.trim()) {
              Alert.alert("Login Error", 'Invalid password.');
              return;
            }
            // Successful login
            Alert.alert("Login Successful!", 'You have logged in successfully.');
            setTimeout(() => {
              navigation.navigate('List');
            }, 2000);
          } else {
            // No user data found
            Alert.alert("Login Error", 'No user data found.');
          }
        } catch (error) {
          console.error(error);
          Alert.alert("An error occurred. Please try again.");
        }
      };
    
    

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.FirstView}>
                <Text style={styles.title}>Sign in to your account</Text>
                <TextInput
                    style={[styles.input, { borderColor: emailError ? 'red' : '#F8CE58' }]}
                    placeholderTextColor="gray"
                    placeholder="Enter your Email"
                    onChangeText={text => setEmail(text)}
                    onFocus={() => setEmailError('')}
                    value={email}
                    keyboardType='email-address'
                />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                <View style={[styles.input, { borderColor: passwordError ? 'red' : '#F8CE58' }]}>
                    <TextInput
                        placeholderTextColor="gray"
                        placeholder="Enter your Password"
                        onChangeText={text => setPassword(text)}
                        onFocus={() => setPasswordError('')}
                        value={password}
                        secureTextEntry={isSecureEntry}
                    />
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setIsSecureEntry(!isSecureEntry)}
                    >
                        <Icon name={isSecureEntry ? 'eye-off' : 'eye'} size={23} color='black' />
                    </TouchableOpacity>
                </View>
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                <TouchableOpacity
                    style={styles.registerButton}
                    onPress={handleLogin}
                >
                    <Text style={styles.registerText}>Login</Text>
                </TouchableOpacity>

                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Don't have an Account?</Text>
                    <Pressable
                        onPress={() => navigation.navigate("Register")}
                    >
                        <Text style={styles.signupLink}>Sign Up here</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
};

// Define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#011D45',
    },
    FirstView: {
        alignItems: 'center',
        height: calculateHeightPercentage(45),
        width: calculateWidthPercentage(85),
        borderRadius: calculateFontSizePercentage(3),
        backgroundColor: 'white',
        padding: calculateWidthPercentage(5),
    },
    title: {
        color: 'black',
        paddingVertical: calculateHeightPercentage(3),
        fontSize: calculateFontSizePercentage(5),
        fontWeight: '600',
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: calculateWidthPercentage(5),
        height: calculateHeightPercentage(6),
        width: "100%",
        borderRadius: calculateFontSizePercentage(1.5),
        backgroundColor: "white",
        borderWidth: 1,
        elevation: 2,
        marginBottom: calculateHeightPercentage(3),
    },
    registerButton: {
        height: calculateHeightPercentage(5),
        width: "100%",
        borderRadius: calculateFontSizePercentage(2),
        backgroundColor: '#001533',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: calculateHeightPercentage(2),
    },
    registerText: {
        textAlign: 'center',
        color: 'white',
        fontSize: calculateFontSizePercentage(5),
        fontWeight: '700',
    },
    errorText: {
        color: 'red',
        marginTop: calculateHeightPercentage(-2.8),
        alignSelf:'flex-start',
        marginBottom: calculateHeightPercentage(1.5),
    },
    signupContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    signupText: {
        color: 'black',
    },
    signupLink: {
        color: 'blue',
        marginLeft: calculateWidthPercentage(1),
    },
    eyeIcon: {
        position: 'absolute',
        right: calculateWidthPercentage(3),
        top: calculateHeightPercentage(1.5),
    },
});

// Make this component available to the app
export default Login;
