import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import Constants from 'expo-constants';
import { Feather } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { MapEvent, Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';

import api from '../../services/api';

interface Item {
    id: number,
    image: string,
    title: string
}

interface Point {
    id: number,
    image: string,
    name: string,
    latitude: number,
    longitude: number,
}

interface Filter {
    selectedUf: string,
    selectedCity: string
}

const Points = () => {

    const route = useRoute()
    const navigation = useNavigation();
    const [itens, setItens] = useState<Item[]>([]);
    const [points, setPoints] = useState<Point[]>([]);
    const [initialPosition, setInitialPosition] = useState<number[]>([0, 0]);
    let [selectedItens, setSelectedItens] = useState<number[]>([]);

    const paramsRoute = route.params as Filter;

    useEffect(() => {
        getItens();

    }, [])

    useEffect(() => {
        loadPosition();
        getPoints();
    }, [selectedItens])

    const loadPosition = async () => {
        const { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Ops....', 'Sem permissão para prosseguir!');
            return;
        }

        const location = await Location.getCurrentPositionAsync();
        const { latitude, longitude } = location.coords;
        setInitialPosition([
            latitude, longitude
        ]);

        console.log(initialPosition);


    }

    const getItens = () => {
        api.get('itens').then(res => {
            setItens(res.data);
        });
    }

    const getPoints = async () => {
        if (selectedItens.length > 0) {

            api.get<Point[]>('points', {
                params: {
                    city: paramsRoute.selectedCity,
                    uf: paramsRoute.selectedUf,
                    itens: selectedItens
                }
            }).then(res => {
                setPoints(res.data);
                if (res.data[0]) {
                    setInitialPosition([res.data[0].latitude, res.data[0].longitude]);
                }
            });
        } else {
            setPoints([]);
        }

    }

    const handleBack = () => {
        navigation.goBack();
    }

    const handleNavigationToDetail = (id: number) => {
        navigation.navigate('Details', { point_id: id });
    }


    const handleSelectedItens = (id: number) => {
        if (selectedItens.includes(id)) {
            const filteredItem = selectedItens.filter(i => i !== id);
            setSelectedItens(filteredItem)
        } else {
            setSelectedItens([...selectedItens, id]);
        }
    }


    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleBack}>
                    <Feather name='arrow-left' color='#34cb79' size={20} />
                </TouchableOpacity>
                <Text style={styles.title}>Bem Vindo.</Text>
                <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>
                <View style={styles.mapContainer}>
                    {initialPosition[0] !== 0 && (
                        <MapView style={styles.map}
                            loadingEnabled={initialPosition[0] == 0}
                            initialRegion={{
                                latitude: initialPosition[0],
                                longitude: initialPosition[1],

                                latitudeDelta: 0.010,
                                longitudeDelta: 0.010
                            }}>
                            {points.map((p, i) => (
                                <Marker key={i}
                                    onPress={() => handleNavigationToDetail(p.id)}
                                    style={styles.mapMarker}
                                    coordinate={{
                                        latitude: p.latitude,
                                        longitude: p.longitude
                                    }}>
                                    <View style={styles.mapMarkerContainer}>
                                        <Image style={styles.mapMarkerImage} source={{ uri: p.image }} />
                                        <Text style={styles.mapMarkerTitle}>{p.name}</Text>
                                    </View>
                                </Marker>
                            ))}

                        </MapView>
                    )
                    }

                </View>
            </View>

            <View style={styles.itemsContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 30 }}>
                    {itens.map((i, index) => (
                        <TouchableOpacity
                            style={
                                [
                                    styles.item,
                                    selectedItens.includes(i.id) ? styles.selectedItem : {}
                                ]
                            }
                            onPress={() => { handleSelectedItens(i.id) }}
                            key={String(index)}>
                            <SvgUri width={42} height={42} uri={i.image} />
                            <Text style={styles.itemTitle}>{i.title}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 32,
        paddingTop: 20 + Constants.statusBarHeight,
    },

    title: {
        fontSize: 20,
        fontFamily: 'Ubuntu_700Bold',
        marginTop: 24,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 4,
        fontFamily: 'Roboto_400Regular',
    },

    mapContainer: {
        flex: 1,
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 16,
    },

    map: {
        width: '100%',
        height: '100%',
    },

    mapMarker: {
        width: 90,
        height: 80,
    },

    mapMarkerContainer: {
        width: 90,
        height: 70,
        backgroundColor: '#34CB79',
        flexDirection: 'column',
        borderRadius: 8,
        overflow: 'hidden',
        alignItems: 'center'
    },

    mapMarkerImage: {
        width: 90,
        height: 45,
        resizeMode: 'cover',
    },

    mapMarkerTitle: {
        flex: 1,
        fontFamily: 'Roboto_400Regular',
        color: '#FFF',
        fontSize: 13,
        lineHeight: 23,
    },

    itemsContainer: {
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 32,
    },

    item: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#eee',
        height: 120,
        width: 120,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'space-between',

        textAlign: 'center',
    },

    selectedItem: {
        borderColor: '#34CB79',
        borderWidth: 2,
    },

    itemTitle: {
        fontFamily: 'Roboto_400Regular',
        textAlign: 'center',
        fontSize: 13,
    },
});


export default Points;
