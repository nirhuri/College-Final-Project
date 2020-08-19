import React from 'react';
import { View, StyleSheet } from 'react-native';

/*
This class holds the UI of the cards we use in the app. 
mostly in the login page and to posts.
*/


const Card = props => {
  // return the card with the data inside the props.
  // when you call this component you send the color and style to create the card as you want
  return <View style={{...styles.card, ...props.style}}>{props.children}</View>;
};

const styles = StyleSheet.create({
  card: {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: 'white'
  }
});

export default Card;
