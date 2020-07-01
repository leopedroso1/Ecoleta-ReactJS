import React, {useState, useEffect} from 'react';
import MapView, { Marker } from 'react-native-maps';
import  Constants  from 'expo-constants';
// ScrollView: create a scroll from our components
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert} from 'react-native';
import { Feather as Icon} from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import {SvgUri} from 'react-native-svg';
import api from '../../services/api';
import * as Location from 'expo-location'; // Geolocation!!

interface Item {
  id: number,
  title: string,
  image_url: string
}

interface Point {

  id: number,
  image: string,
  image_url: string,
  name: string,
  latitude: number,
  longitude: number,
/*  items:{
    title: string
  }[]; // <<< This is the format to declare an array and its content
*/
}

interface Params {
    
    uf: string,
    city: string

}

const Points = () => {

  // Get our items from the API
  const [items, setItems] = useState<Item[]>([]);
  // Get our items selected from the API
  const [selectedItems, setSelectedItems] = useState<Number[]>([]);
  // State to control our GPS positions
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0]);
  // State to save our points pre signed
  const [points, setPoints] = useState<Point[]>([]);

  // App Navigation!
  const navigation = useNavigation();
  // Get data from the previous screen
  const route = useRoute();
  const routeParams = route.params as Params; // Force TS to use this data type


  // Backend connection
  // Load items from backend
  useEffect(() => {
    
    api.get('items').then(response => {

      setItems(response.data);

    });

  }, []);

    // Load GPS positions
  useEffect(() => {

    // Async mobile function to get user's GPS position
    async function loadPosition(){

      // Ask for user permissions
      const { status } = await Location.requestPermissionsAsync();

      if(status !== 'granted'){
        
        Alert.alert("Ooops...something bad happened..=(","We need your permission to get your current location");
        return; // exit because the permission was not granted
      }

      const location = await Location.getCurrentPositionAsync();

      const { latitude, longitude } = location.coords;
  
      setInitialPosition([latitude, longitude]);
    }

    // Trigger the function immediately!
    loadPosition();

  },[]);

  // Get all places
  useEffect(()=>{

    // params == Query Params!
    api.get('points', {
      params: {
        city: routeParams.city,
        uf: routeParams.uf,
        items: selectedItems
      }
    }).then(response => {

      setPoints(response.data);

    });

  },[selectedItems]);



  // Functions for onPress triggers! 
    function handleNavigateBack(){

        navigation.goBack();

    }

  // App Navigation!
  function handleNavigateToDetail(id: number){

      navigation.navigate('Detail', {point_id: id}); // To pass information to another screen just use an JS object!

    }

        // Get the items to be recycled whose are selected. You can also remove your choose!!! =) 
  function handleSelectItem(id: number){

    const alreadySelected = selectedItems.findIndex(item => item === id); // returns the index of the item found otherwise -1
  
      if(alreadySelected >= 0){
  
        const filteredItems = selectedItems.filter(item => item != id);
  
        setSelectedItems(filteredItems);
  
      } else {
        
        setSelectedItems([...selectedItems, id]);
      
        }
  }
  
    // Style tip: borderRadius on react native only works inside a view 
    // SVG Image from Backend >> You MUST replace the localhost to expo IP shown when expo start. 
    // ScrollView attributes: 
    /*  horizontal >> Horizontal Scroll 
        showsHorizontalScrollIndicator={false} >> Remove the indicator
        contentContainerStyle={{ paddingHorizontal: 20}} >> Apply the padding to entire component as a full content causing fluidity
    */
    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleNavigateBack}>
                    <Icon name="arrow-left" size={20} color="#34cb79" />
                </TouchableOpacity>

                <Text style={styles.title}> Bem vindo!</Text>
                <Text style={styles.description}>Encontre no mapa um ponto de coleta</Text>

                <View style={styles.mapContainer}>
                  { 
                  // Conditional rendering! If our position is loaded then load the map!!!!
                  // If we need to insert a JS / TS code in our jsx we use {}. To insert JSX code in our JS / TS use ()
                  initialPosition[0] !== 0 && (
                      <MapView 
                      style={styles.map} 
                      // loadingEnabled={initialPosition[0]===0}  loading bar!! While the initial position = 0, keeps loading signal!
                      initialRegion={{
                          latitude: initialPosition[0], // Test Lat: 38.7436057
                          longitude: initialPosition[1], // Test: Lon: -9.2302432
                          latitudeDelta: 0.014,
                          longitudeDelta: 0.014,
                      }}>

                    {points.map(point => (
                      <Marker 
                          key={String(point.id)}
                          style={styles.mapMarker}
                          coordinate={{latitude:point.latitude,longitude:point.longitude,}}
                          onPress={() => handleNavigateToDetail(point.id)}
                      >
                        <View style={styles.mapMarkerContainer}>
                            <Image style={styles.mapMarkerImage} source={{ uri: point.image_url }} />
                            <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                        </View>
                        </Marker>
                    ))}
                  </MapView>

                  )}



                </View>
            </View>

            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20}}
            > 
              {items.map(item => (
                <View style={styles.itemsContainer}>
                    <TouchableOpacity key={String(item.id)} 
                                      style={[styles.item, 
                                              selectedItems.includes(item.id) ? styles.selectedItem : {} ]} 
                                      onPress={() => handleSelectItem(item.id)} 
                                      activeOpacity={0.6}
                    >
                    
                        <SvgUri width={42} height={42} uri={item.image_url}/>    
                        <Text style={styles.itemTitle}>{item.title}</Text>
                    
                    </TouchableOpacity>
                </View>
              ))}    
            </ScrollView>
        </>
    );


};


// Styles Tip: If you need to apply more than one style use []
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