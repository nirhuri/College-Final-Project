  
import React, {Component} from 'react';
import {
  View,
  UIManager,
  StyleSheet,
} from 'react-native';
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import {YellowBox} from 'react-native';

YellowBox.ignoreWarnings(['Warning: ...']);

UIManager.setLayoutAnimationEnabledExperimental(true);

import{ CreditCardInput } from 'react-native-credit-card-input';

export default class Payments extends Component {
  _onFocus = field => console.log('focusing', field)

  _onChange = formData => console.log(JSON.stringify(formData, null , ' '))
  render() {
    return (
      <View style={styles.container}>
        <CreditCardInput
          autoFocus
          requireName={true}
          requireCVC={true}
          requirePostalCode={true}
          validColor="black"
          invalidColor="red"
          placeholderColor="darkgray"
          labelStyle={{color: 'black', fontSize: 12}}
          inputStyle={{color: 'black', fontSize: 16}}
          onFocus={this._onFocus}
          onChange={this._onChange}
        />
      </View>
    );
  }
  
};

Payments.navigationOptions = (navData) => {
  return {
    headerTitle: "Payments",
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="check"
          iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
          onPress={() => {
            navData.navigation.navigate('Home');
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    backgroundColor: 'white',
  },
});