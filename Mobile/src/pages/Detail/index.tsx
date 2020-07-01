import React, { useEffect, useState } from 'react';
// SafeArea View: Generates the padding automatically for a safe area without headers or sliders
// Linking: Bound external / internal links for example we can use whatsapp!!
import { StyleSheet, ImageBackground, TouchableOpacity, Text, View, Image, SafeAreaView, Linking } from 'react-native';
import { Feather as Icon, FontAwesome} from '@expo/vector-icons';
// useRoute >> check the parameters that came from other screen
import { useNavigation, useRoute } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import api from '../../services/api';
import * as MailComposer from 'expo-mail-composer';


// This interface will be used to collect the data from useRoute
interface Params {

  point_id: number;

}

interface Data {

  point: {
    image: string;
    image_url: string;
    name: string;
    email: string;
    whatsapp: number;
    city: string;
    uf: string;
  },
  items: {
    title: string
  }[];

}

const Detail = () => {

    // Navigation variable
    const navigation = useNavigation();
    
    // Get detailed information from API 
    const [data, setData] = useState<Data>({} as Data); // Force the default data from {} initialize with Data

    // Get info from other screen
    const route = useRoute();
    const routeParams = route.params as Params; // Force Typescript to understand that the route.Params has the same type from interface. Now we can use the inner information

    // Backend Connection
    // Get all detailed information from API
    useEffect(()=>{

      // GET route with query params
      api.get(`points/${routeParams.point_id}`).then(response => {

        setData(response.data);

      }); 

    },[]);

    // If our data is not loaded yet, null!
    if(!data.point){
      return null; // we could also input a loading screen here
    }

    // Navigation and onPress handlers functions!
    function handleNavigateBack(){

        navigation.goBack();

    }

    function handleWhatsapp(){

      Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}&text={Hi! I have interest about waste collection}`);

    }

    function handleComposeMail(){

      MailComposer.composeAsync({
        subject: 'Interest in waste collection',
        recipients: [data.point.email],
      });

    }

    return (
        <SafeAreaView style={{ flex: 1}}>
            <View style={styles.container}>

                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name="arrow-left" size={20} color="#34cb79" />
                </TouchableOpacity>

                <Image style={styles.pointImage} source={{ uri: data.point.image_url }}></Image>

                <Text style={styles.pointName}>{data.point.name}</Text>            
                <Text style={styles.pointItems}>{data.items.map(item => item.title).join(',')}</Text>            

                <View style={styles.address}>
                    <Text style={styles.addressTitle}>Endereço</Text>
                    <Text style={styles.addressContent}>{data.point.city}, {data.point.uf}</Text>
                </View>

            </View>

            <View style={styles.footer}>

                <RectButton style={styles.button} onPress={handleWhatsapp}>
                    <FontAwesome name="whatsapp" size={20} color={'#fff'} />
                    <Text style={styles.buttonText}>Whatsapp</Text>
                </RectButton>

                <RectButton style={styles.button} onPress={handleComposeMail}>
                    <Icon name="mail" size={20} color={'#fff'} />
                    <Text style={styles.buttonText}>E-mail</Text>
                </RectButton>

            </View>
        </SafeAreaView>
    );

};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
      paddingTop: 20,
    },
  
    pointImage: {
      width: '100%',
      height: 120,
      resizeMode: 'cover',
      borderRadius: 10,
      marginTop: 32,
    },
  
    pointName: {
      color: '#322153',
      fontSize: 28,
      fontFamily: 'Ubuntu_700Bold',
      marginTop: 24,
    },
  
    pointItems: {
      fontFamily: 'Roboto_400Regular',
      fontSize: 16,
      lineHeight: 24,
      marginTop: 8,
      color: '#6C6C80'
    },
  
    address: {
      marginTop: 32,
    },
    
    addressTitle: {
      color: '#322153',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    },
  
    addressContent: {
      fontFamily: 'Roboto_400Regular',
      lineHeight: 24,
      marginTop: 8,
      color: '#6C6C80'
    },
  
    footer: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: '#999',
      paddingVertical: 20,
      paddingHorizontal: 32,
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    
    button: {
      width: '48%',
      backgroundColor: '#34CB79',
      borderRadius: 10,
      height: 50,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      marginLeft: 8,
      color: '#FFF',
      fontSize: 16,
      fontFamily: 'Roboto_500Medium',
    },
  });

export default Detail;