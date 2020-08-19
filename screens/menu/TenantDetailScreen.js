import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  Button,
  StyleSheet
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

const TenantDetailScreen = props => { 
  const tenantId = props.navigation.getParam('tenantId');    // get the post id for rendering the right post
  const tenantStreet = props.navigation.getParam('tenantStreet');
  const tenantName = props.navigation.getParam('tenantName');
  const tenantApartment = props.navigation.getParam('tenantApartment');
  const selectedTenants = useSelector(state =>
    state.tenant.myBuilding.find(tenant => tenant.id === tenantId) // find the wanted post
  );

  return (          // render the right post after we found him in inside available posts 
      <View style={styles.actions}>
          <Text style={styles.description}>Address: {tenantStreet}</Text>
          <Text style={styles.description}>Apartment: {tenantApartment}</Text>
          <Text style={styles.description}>Name: {tenantName}</Text>
      </View>
  );
};

TenantDetailScreen.navigationOptions = navData => {
  return {
    headerTitle: navData.navigation.getParam('tenantTitle')
  };
};

const styles = StyleSheet.create({
    image: {
      width: '100%',
      height: 300
    },
    actions: {
      marginVertical: 10,
      alignItems: 'center'
    },
    price: {
      fontSize: 20,
      color: '#888',
      textAlign: 'center',
      marginVertical: 20,
      fontFamily: 'open-sans-bold'
    },
    description: {
      fontFamily: 'open-sans',
      fontSize: 14,
      textAlign: 'center',
      marginHorizontal: 20
    }
  });

  export default TenantDetailScreen;