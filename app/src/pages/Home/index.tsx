import React, { useState, useEffect } from 'react';
import { View, ImageBackground, Image, StyleSheet, Text, KeyboardAvoidingView } from 'react-native';
import { AppLoading } from 'expo';
import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';
import { Ubuntu_700Bold, useFonts } from '@expo-google-fonts/ubuntu';
import { RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';


interface IBGEResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string
}

interface Itens {
    label: string,
    value: string

}

const Home = () => {
    const navigation = useNavigation();

    let [ufs, setUfs] = useState<Itens[]>([]);
    let [cities, setCities] = useState<Itens[]>([]);
    let [selectedUf, setSelectedUf] = useState<string>('');
    let [selectedCity, setSelectedCity] = useState<string>('');



    useEffect(() => {
        getEstados();
    }, [])

    const getEstados = async () => {
        const results = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados/');
        const initials: IBGEResponse[] = results.data;
        const filtered = initials.map(i => {
            return { label: i.sigla, value: i.sigla }
        })
        setUfs(filtered);
    }

    const getMunicipios = async (uf: string) => {
        console.log(uf);
        setSelectedUf(uf);
        const resuts = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
        const initials: IBGECityResponse[] = resuts.data;
        console.table(initials);
        const filtered = initials.map(c => {
            return { label: c.nome, value: c.nome }
        });
        setCities(filtered);
    }

    const handleNavigate = () => {
        navigation.navigate('Points', {
            selectedUf,
            selectedCity
        });
    }

    const [fontLoading] = useFonts({
        Roboto_400Regular, Roboto_500Medium, Ubuntu_700Bold
    });
    if (!fontLoading) {
        return <AppLoading />
    }
    return (
        <KeyboardAvoidingView style={{ flex: 1 }}>
            <ImageBackground source={require('../../assets/home-background.png')} style={styles.container} imageStyle={{ width: 274, height: 368 }}>
                <View style={styles.main}>
                    <Image
                        source={require('../../assets/logo.png')}
                    />
                    <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>
                    <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
                </View>

                <View style={styles.pickers}>
                    {ufs.length > 0 && (
                        <RNPickerSelect placeholder={'Selecione a cidade'}
                            onValueChange={(value) => getMunicipios(value)}
                            items={ufs}
                        />
                    )}

                    {cities.length > 0 && (
                        <RNPickerSelect placeholder={'Selecione a cidade'}
                            onValueChange={(value) => setSelectedCity(value)}
                            items={cities}
                        />
                    )}
                </View>

                <View style={styles.footer}>
                    <RectButton style={styles.button} onPress={handleNavigate}>
                        <View style={styles.buttonIcon}>
                            <Text ><Feather name='arrow-right' color='white' size={20} /></Text>
                        </View>
                        <Text style={styles.buttonText}>Entrar</Text>
                    </RectButton>
                </View>

            </ImageBackground>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32
    },

    main: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },

    pickers: {
        marginTop: 5
    },

    footer: {},

    select: {},

    input: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },

    button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
    },

    buttonIcon: {
        height: 60,
        width: 60,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    }
});

export default Home;