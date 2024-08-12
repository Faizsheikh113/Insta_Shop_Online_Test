import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-elements';
import { data } from '../Config/DummyData';
import Icon from 'react-native-vector-icons/Ionicons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../Redux/CartSlice';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Helper functions for dimension calculations
const calculateHeightPercentage = percentage => (windowHeight * percentage) / 100;
const calculateWidthPercentage = percentage => (windowWidth * percentage) / 100;
const calculateFontSizePercentage = percentage => {
    const baseDimension = Math.min(windowWidth, windowHeight);
    return (baseDimension * percentage) / 100;
};

const List = ({ navigation }) => {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart);
    const [isLoading, setIsLoading] = useState(true);
    const [data1, setData] = useState([]);

    const Header = () => {
        const cartQuantity = cartItems.length;
        return (
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Icon name={'arrow-back-outline'} size={23} color={'black'} style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Products</Text>
                <TouchableOpacity style={styles.shoppingCart} onPress={() => { navigation.navigate("Cart") }}>
                    <Icon name="cart" size={24} color="black" />
                    {cartQuantity > 0 &&
                        <View style={styles.itemCountContainer}>
                            <Text style={styles.itemCount}>{cartQuantity}</Text>
                        </View>
                    }
                </TouchableOpacity>
            </View>
        );
    };

    useEffect(() => {
        setTimeout(() => {
            setData(data?.products);
            setIsLoading(false);
        }, 500);
    }, []);
    const handleAddToCart = useCallback((item) => {
        dispatch(addToCart(item));
      }, [dispatch]);

    return (
        <GestureHandlerRootView style={styles.container}>
            <Header navigation={navigation} />
            {isLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            ) :
                <FlatList
                    data={data1}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <Card containerStyle={styles.cardContainer}>
                            <View style={styles.cardContent}>
                                <Image
                                    source={{ uri: item.thumbnail }}
                                    style={styles.image}
                                    resizeMode='cover'
                                />
                                <View style={styles.textContainer}>
                                    <Text style={styles.title}>{item.title}</Text>
                                    <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
                                    <View style={styles.ratingContainer}>
                                        <Icon name='star' size={13} color='#EAA132' />
                                        <Text style={styles.ratingText}>{item.rating}</Text>
                                    </View>
                                    <View style={styles.priceContainer}>
                                        <Text style={styles.price}>
                                            {/* ${item.price} */}
                                            {item.discountPercentage > 0 && (
                                                <Text style={{
                                                    textDecorationLine: 'line-through',
                                                    textDecorationColor: 'white',
                                                    fontSize: calculateFontSizePercentage(3.5)
                                                }}
                                                >
                                                    ${item.price}
                                                </Text>
                                            )}
                                            {item.discountPercentage > 0 && (
                                                <>
                                                    <Text style={{ fontSize: calculateFontSizePercentage(2.8), color: 'white' }}>
                                                        -{item.discountPercentage}%
                                                    </Text>
                                                    <Text style={{ fontSize: calculateFontSizePercentage(3.5), color: 'white' }}>
                                                        {'\n'}${((item.price / 100) * (100 - item.discountPercentage)).toFixed(2)}
                                                    </Text>
                                                </>
                                            )}
                                        </Text>
                                        <TouchableOpacity
                                            style={styles.addButton}
                                            onPress={() => handleAddToCart(item)}
                                        >
                                            <Text style={styles.addButtonText}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Card>
                    )}
                    style={{ padding: calculateHeightPercentage(2) }}
                    contentContainerStyle={styles.listContainer}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    numColumns={2}
                />
            }
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#484A59',
    },
    header: {
        height: calculateHeightPercentage(7),
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: calculateWidthPercentage(5),
        borderBottomWidth: calculateWidthPercentage(0.06),
        elevation: 3
    },
    backIcon: {
        paddingRight: calculateWidthPercentage(5),
    },
    headerTitle: {
        fontSize: calculateFontSizePercentage(5.5),
        color: 'black',
    },
    shoppingCart: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto'
    },
    itemCountContainer: {
        backgroundColor: 'red',
        borderRadius: calculateFontSizePercentage(10),
        paddingVertical: calculateHeightPercentage(0.2),
        paddingHorizontal: calculateWidthPercentage(1),
        marginLeft: -10,
        marginTop: calculateHeightPercentage(-3)
    },
    itemCount: {
        color: 'white',
        fontSize: calculateFontSizePercentage(3),
    },
    listContainer: {
        justifyContent: 'space-between',
        paddingBottom:calculateHeightPercentage(4)
    },
    cardContainer: {
        backgroundColor: '#001533',
        borderRadius: 15,
        borderColor: 'orange',
        margin: calculateWidthPercentage(0.5),
        height: calculateHeightPercentage(28),
        width: calculateWidthPercentage(44),
        justifyContent: 'center',
        alignSelf: 'center',
        elevation: 5,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginBottom: calculateHeightPercentage(2)
    },
    cardContent: {
        alignItems: 'center',
    },
    image: {
        width: '90%',
        height: calculateHeightPercentage(10),
        borderRadius: 10,
    },
    textContainer: {
        marginLeft: calculateWidthPercentage(2)
    },
    title: {
        color: 'white',
        fontSize: calculateFontSizePercentage(3.2),
    },
    description: {
        color: '#e0e0e0',
        fontSize: calculateFontSizePercentage(2.8),
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        color: 'white',
        marginLeft: calculateWidthPercentage(1)
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    price: {
        fontSize: calculateFontSizePercentage(4),
        color: '#e74c3c',
        fontWeight: 'bold'
    },
    addButton: {
        backgroundColor: '#EAA132',
        borderRadius: 50,
        width: calculateWidthPercentage(8),
        height: calculateHeightPercentage(4),
        marginLeft: calculateWidthPercentage(5),
        justifyContent: 'center',
        alignItems: 'center'
    },
    addButtonText: {
        color: 'black',
        fontWeight: 'bold',
    },
    footer: {
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        alignItems: 'center',
    }
});

export default List;
