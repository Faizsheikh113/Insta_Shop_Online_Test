import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart, updateQuantity } from '../Redux/CartSlice'
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

const CartScreen = ({ navigation }) => {
    const cart = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const [isModalVisible, setModalVisible] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [quantity, setQuantity] = useState({});

    const calculateTotalPrice = () => {
        let totalPrice = 0;
        cart.forEach((item) => {
            let price = item.discountPercentage > 0 ? (item.price / 100) * (100 - item.discountPercentage) : item.price;
            let quantity = isNaN(item.quantity) || item.quantity <= 0 ? 1 : item.quantity;
            totalPrice += price * quantity;
        });
        setTotalPrice(totalPrice.toFixed(2));
    };

    const handleProceedToCheckout = () => {
        calculateTotalPrice();
        setModalVisible(true);
    };

    const handleQuantityChange = (itemId, quantity) => {
        if (quantity > 0 && quantity <= cart.find(item => item.id === itemId).stock) {
            setQuantity({ ...quantity, [itemId]: quantity });
            dispatch(updateQuantity({ itemId, quantity }));
        } else {
            alert('Invalid quantity. Please select a quantity between 1 and ' + cart.find(item => item.id === itemId).stock);
        }
    };

    const handleIncrement = (itemId) => {
        const currentQuantity = quantity[itemId] || 1;
        handleQuantityChange(itemId, currentQuantity + 1);
    };

    const handleDecrement = (itemId) => {
        const currentQuantity = quantity[itemId] || 1;
        if (currentQuantity > 1) {
            handleQuantityChange(itemId, currentQuantity - 1);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.price}>
                    {item.discountPercentage > 0 && (
                        <Text style={{ textDecorationLine: 'line-through', fontSize: calculateFontSizePercentage(3.5) }}>
                            ${item.price}
                        </Text>
                    )}
                    {item.discountPercentage > 0 && (
                        <Text style={{ fontSize: calculateFontSizePercentage(3), color: 'green' }}>
                            -{item.discountPercentage}% {'\n'}${((item.price / 100) * (100 - item.discountPercentage)).toFixed(2)}
                        </Text>
                    )}
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center',marginVertical:calculateHeightPercentage(-2) }}>
                    <Text style={{ fontSize: calculateFontSizePercentage(3.5), color: '#333' }}>Quantity:</Text>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <TouchableOpacity onPress={() => handleDecrement(item.id)}>
                            <Icon name='remove-circle-outline' size={20} color={'#e74c3c'} />
                        </TouchableOpacity>
                        <TextInput
                            style={{paddingHorizontal:calculateWidthPercentage(2),color:'black',marginRight:calculateWidthPercentage(-3)}}
                            value={quantity[item.id] ? quantity[item.id].toString() : '1'}
                            onChangeText={(text) => handleQuantityChange(item.id, parseInt(text))}
                            keyboardType="numeric"
                        />
                        <TouchableOpacity onPress={() => handleIncrement(item.id)}>
                            <Icon name='add-circle-outline' size={20} color={'#2ecc71'} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <TouchableOpacity onPress={() => dispatch(removeFromCart(item.id))} style={styles.removeButton}>
                <Icon name='trash-outline' size={20} color={'#e74c3c'} />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='arrow-back-outline' size={23} color={'black'} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cart</Text>
            </View>
            {cart.length === 0 ? (
                <Text style={styles.emptyMessage}>Your cart is empty</Text>
            ) : (
                <FlatList
                    data={cart}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                />
            )}
            {cart.length > 0 && (
                <View style={styles.footer}>
                    <TouchableOpacity onPress={() => dispatch(clearCart())}
                        style={{ backgroundColor: '#e74c3c', height: calculateHeightPercentage(5.4), justifyContent: 'center', alignItems: 'center', borderRadius: calculateFontSizePercentage(3), width: calculateWidthPercentage(30) }}
                    >
                        <Text style={{ padding: calculateFontSizePercentage(2), color: 'white' }}>Clear ALL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { handleProceedToCheckout() }}
                        style={{ backgroundColor: '#2ecc71', height: calculateHeightPercentage(5.5), justifyContent: 'center', alignItems: 'center', borderRadius: calculateFontSizePercentage(3), width: calculateWidthPercentage(50) }}
                    >
                        <Text style={{ padding: calculateFontSizePercentage(2), color: 'white' }}>Proceed to Checkout</Text>
                    </TouchableOpacity>
                    {/* <Button title="Proceed to Checkout" onPress={() => alert('Proceed to Checkout')} color={'#2ecc71'} /> */}
                </View>
            )}
            <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{
                        backgroundColor: 'white',
                        padding: 20,
                        borderRadius: 10,
                        width: calculateWidthPercentage(80),
                        maxHeight: calculateHeightPercentage(50),
                    }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Order Summary</Text>
                        <Text style={{ fontSize: 18, marginBottom: 16 }}>Total Price: ${totalPrice}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ backgroundColor: '#e74c3c', padding: 16, borderRadius: 8 }}>
                                <Text style={{ color: 'white', fontSize: 18 }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                dispatch(clearCart());
                                setModalVisible(false);
                            }} style={{ backgroundColor: '#2ecc71', padding: 16, borderRadius: 8 }}>
                                <Text style={{ color: 'white', fontSize: 18 }}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#484A59',
    },
    price: {
        fontSize: calculateFontSizePercentage(4),
        color: '#e74c3c',
        fontWeight: 'bold'
    },
    header: {
        height: calculateHeightPercentage(7),
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: calculateWidthPercentage(5),
        borderBottomWidth: calculateWidthPercentage(0.06),
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
    },
    headerTitle: {
        fontSize: calculateFontSizePercentage(5.5),
        color: 'black',
        marginLeft: calculateWidthPercentage(5),
        fontWeight: 'bold',
    },
    emptyMessage: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 50,
        color: 'white',
    },
    listContainer: {
        flexGrow: 1,
        padding: calculateFontSizePercentage(2),
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: 'white',
        marginBottom: 8,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
    },
    itemInfo: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        color: '#333',
    },
    itemPrice: {
        fontSize: 16,
        color: '#e74c3c',
        fontWeight: 'bold',
    },
    removeButton: {
        alignSelf: 'center',
        paddingHorizontal: 16,
    },
    footer: {
        marginTop: calculateHeightPercentage(1),
        marginBottom: calculateHeightPercentage(2),
        paddingHorizontal: calculateWidthPercentage(5),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default CartScreen;