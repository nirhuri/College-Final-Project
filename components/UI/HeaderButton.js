import React from 'react';
import { Platform } from 'react-native';
import { HeaderButton } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../../constants/Colors';

/*
this class design the header buttons on top of the page.
ths class creates the button.
the component gets the type of button and color and here we set the size.
the button design created by the Ionicons library.
*/

const CustomHeaderButton = props => {
  return (
    <HeaderButton
      {...props}   // we get all the design elemnt and implement it with Ionicons
      IconComponent={Ionicons}
      iconSize={23}
      color={Platform.OS === 'android' ? 'white' : Colors.primary}
    />
  );
};

export default CustomHeaderButton;
