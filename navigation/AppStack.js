import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DonationPoolScreen from '../screens/DonationPoolScreen';

const Stack = createStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
      {/* <Stack.Screen name="Create Profile" component={ProfileScreen} /> */}
      <Stack.Screen name="Donation Pool" component={DonationPoolScreen} />
    </Stack.Navigator>
  );
}

export default AppStack;