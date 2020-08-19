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

import Colors from '../../constants/Colors';

const CaseDetailScreen = props => { 
  const caseId = props.navigation.getParam('caseId');    // get the post id for rendering the right post
  const selectedCase = useSelector(state =>
    state.case.myCases.find(c => c.id === caseId) // find the wanted post
  );
  const dispatch = useDispatch();

  return (          // render the right post after we found him in inside available posts
    <ScrollView>  
      <Text style={styles.description}>Name: {selectedCase.title}</Text>
      <Text style={styles.description}>Adress: {selectedCase.subject}</Text>
      <Text style={styles.description}>Apartment: {selectedCase.description}</Text>
      <View style={styles.actions}>
      </View>
    </ScrollView>
  );
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

  export default CaseDetailScreen;