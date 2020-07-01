import React from 'react';
// NavigationContainer >> Routing our screens! (Components)
import { NavigationContainer } from '@react-navigation/native';

// CreateStackNavigator >> Navigation by stack, in other words we can save our screens at memory stack. If we need to return we can take an excellent performance
// We can also make: Tab Navigation, Drawer Navigation (That menu on the upper side of the screen)
import { createStackNavigator } from '@react-navigation/stack';

import Home from './pages/Home/index';
import Points from './pages/Points/index';
import Detail from './pages/Detail/index';

const AppStack = createStackNavigator();

const Routes = () => {

    return (

        // NavigationContainer: Works like the BrowserContainer from React
        // AppStack.Navigator => the headerMode excludes the automatic header provided
        // AppStack.Navigator => the screenOptions will provide options for all screens. In this case will apply the style for all screens!
        <NavigationContainer>
            <AppStack.Navigator headerMode="none" 
                                screenOptions={{
                                        cardStyle: {backgroundColor:'#f0f0f5'}
                                }}> 
                <AppStack.Screen name="Home" component={Home}/>
                <AppStack.Screen name="Points" component={Points}/>
                <AppStack.Screen name="Detail" component={Detail}/>
            </AppStack.Navigator>
        </NavigationContainer>
        
    );

};

export default Routes;