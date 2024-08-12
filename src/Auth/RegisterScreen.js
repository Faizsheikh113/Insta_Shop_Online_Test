import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CheckBox from 'react-native-check-box';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper functions for dimension calculations
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const calculateHeightPercentage = percentage => (windowHeight * percentage) / 100;
const calculateWidthPercentage = percentage => (windowWidth * percentage) / 100;
const calculateFontSizePercentage = percentage => {
    const baseDimension = Math.min(windowWidth, windowHeight);
    return (baseDimension * percentage) / 100;
};

// Create a component
const Register = ({ navigation }) => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSecureEntry, setIsSecureEntry] = useState(true);
    const [isSecureEntry1, setIsSecureEntry1] = useState(true);
    const [isChecked, setIsChecked] = useState(false);
    const [errors, setErrors] = useState({});

    const handleCheckBoxClick = () => {
        setIsChecked(!isChecked);
    };

    const validateForm = () => {
        let valid = true;
        let errors = {};

        if (!userName.trim()) {
            errors.userName = 'Username is required.';
            valid = false;
        }
        if (!email.trim()) {
            errors.email = 'Email is required.';
            valid = false;
        } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())) {
            errors.email = 'Please enter a valid email.';
            valid = false;
        }
        if (!password.trim()) {
            errors.password = 'Password is required.';
            valid = false;
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters long.';
            valid = false;
        }
        if (!confirmPassword.trim()) {
            errors.confirmPassword = 'Please confirm your password.';
            valid = false;
        } else if (confirmPassword.length < 6) {
            errors.confirmPassword = 'Password must be at least 6 characters long.';
            valid = false;
        }
        if (password !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match.';
            valid = false;
        }

        setErrors(errors);
        return valid;
    };

    const handleRegister = async () => {
        if (validateForm()) {
            const data = {
                email,
                password,
                userName,
            };
            console.log(data);
            await AsyncStorage.setItem("UserData", JSON.stringify(data));
            navigation.navigate("Login");
        }
    };

    const handleFocus = (field) => {
        setErrors(prevErrors => ({ ...prevErrors, [field]: '' }));
    };

    return (
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
            <SafeAreaView >
                {/* Body */}
                <View style={styles.FirstView}>
                    <Text style={styles.title}>SigUp your account here!!!</Text>
                    {/* UserName */}
                    <TextInput
                        style={[styles.input, { borderColor: errors.userName ? 'red' : '#F8CE58' }]}
                        placeholderTextColor="gray"
                        placeholder="UserName"
                        onChangeText={text => setUserName(text)}
                        value={userName}
                        onFocus={() => handleFocus('userName')}
                    />
                    {errors.userName ? <Text style={styles.errorText}>{errors.userName}</Text> : null}

                    {/* Email */}
                    <TextInput
                        style={[styles.input, { borderColor: errors.email ? 'red' : '#F8CE58' }]}
                        placeholderTextColor="gray"
                        placeholder="Email"
                        onChangeText={text => setEmail(text)}
                        value={email}
                        keyboardType='email-address'
                        onFocus={() => handleFocus('email')}
                    />
                    {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

                    {/* Password */}
                    <View style={[styles.input, { borderColor: errors.password ? 'red' : '#F8CE58' }]}>
                        <TextInput
                            // style={[styles.input, { borderColor: errors.password ? 'red' : '#F8CE58' }]}
                            placeholderTextColor="gray"
                            placeholder="Password"
                            onChangeText={text => setPassword(text)}
                            value={password}
                            secureTextEntry={isSecureEntry}
                            onFocus={() => handleFocus('password')}
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setIsSecureEntry(!isSecureEntry)}
                        >
                            <Icon name={isSecureEntry ? 'eye-off' : 'eye'} size={23} color='black' />
                        </TouchableOpacity>
                    </View>
                    {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

                    {/* Confirm Password */}
                    <View style={[styles.input, { borderColor: errors.confirmPassword ? 'red' : '#F8CE58' }]}>
                        <TextInput
                            placeholderTextColor="gray"
                            placeholder="Confirm Password"
                            onChangeText={text => setConfirmPassword(text)}
                            value={confirmPassword}
                            secureTextEntry={isSecureEntry1}
                            onFocus={() => handleFocus('confirmPassword')}
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setIsSecureEntry1(!isSecureEntry1)}
                        >
                            <Icon name={isSecureEntry1 ? 'eye-off' : 'eye'} size={23} color='black' />
                        </TouchableOpacity>
                    </View>
                    {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

                    {/* Terms and Conditions */}
                    <View style={styles.checkboxContainer}>
                        <CheckBox
                            isChecked={isChecked}
                            onClick={handleCheckBoxClick}
                            checkBoxColor="#007bff"
                        />
                        <Text style={styles.label}>I agree to the terms and conditions</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={handleRegister}
                    >
                        <Text style={styles.registerText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

// Define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // flexWrap: 'nowrap',
        alignItems: 'center',
        backgroundColor: '#011D45',
        justifyContent: 'center'
    },
    title: {
        color: 'black',
        marginTop: calculateHeightPercentage(1),
        marginBottom: calculateHeightPercentage(3),
        fontSize: calculateFontSizePercentage(5),
        fontWeight: '600',
    },
    FirstView: {
        alignItems: 'center',
        height: calculateHeightPercentage(65),
        width: calculateWidthPercentage(85),
        borderRadius: calculateFontSizePercentage(3),
        backgroundColor: 'white',
        padding: calculateWidthPercentage(5),
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
    eyeIcon: {
        position: 'absolute',
        right: calculateWidthPercentage(3),
        top: calculateHeightPercentage(1.5),
    },
    registerButton: {
        justifyContent: 'center',
        alignItems: 'center',
        height: calculateHeightPercentage(6),
        width: "100%",
        borderRadius: calculateFontSizePercentage(0.5),
        backgroundColor: '#001533',
        borderWidth: 1,
        elevation: 5,
        paddingHorizontal: calculateWidthPercentage(3),
        marginTop: calculateHeightPercentage(3)
    },
    registerText: {
        textAlign: 'center',
        color: 'white',
        fontSize: calculateFontSizePercentage(5),
        fontWeight: '700'
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        marginLeft: 8,
        color: 'black'
    },
    errorText: {
        color: 'red',
        marginTop: calculateHeightPercentage(-2.7),
        alignSelf: 'flex-start',
        marginLeft: calculateWidthPercentage(1),
        marginBottom: calculateHeightPercentage(1)
    },
});

export default Register;
