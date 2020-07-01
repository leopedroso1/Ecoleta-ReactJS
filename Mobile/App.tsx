import React from 'react';

// StatusBar from Mobile devices
import { StatusBar } from 'react-native';
import Home from './src/pages/Home/index';

// Load Manager from expo!
import {AppLoading} from 'expo';

// Google Fonts + Expo
import {Roboto_400Regular, Roboto_500Medium} from '@expo-google-fonts/roboto';
import {Ubuntu_700Bold, useFonts} from '@expo-google-fonts/ubuntu';

// Routing
import Routes from './src/routes';

// React Native: Istead HTML we will use the tags from React Native
// Example: Instead of <div> <footer> <header> etc. we wil use <View> </View>

// App.tsx file: In this file we will make all the load of our components and create like an ochestration!

// Fragment: In React Native our components must be contained into a <View>. In React web, into a <div> right?. Fragment is a EMPTY DIV! \o/ so we don't need to get concerned with styles
// Fragment >>   <> your components here </>
export default function App() {

  // Load our Fonts
  const [fontsLoaded] = useFonts({
    
      Roboto_400Regular, 
      Roboto_500Medium, 
      Ubuntu_700Bold
    
    }); 

    if (!fontsLoaded) {
      return <AppLoading />
    }

  return (
    <> 
    <StatusBar barStyle='dark-content' backgroundColor='transparent' translucent />
    <Routes />
    </>
  );
}


// Styles x React Native
// By default the display is set to Flex (CSS 3 >>> display:flex)
// Here don't have cascades like in React. You need to apply each style by itself
/*
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
*/