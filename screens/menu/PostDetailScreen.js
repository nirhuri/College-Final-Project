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
 
// this component render the post when the user tap on,
// the post opened in new screen wher you can read the post and add a comment

const PostDetailScreen = props => {
  const postId = props.navigation.getParam('postId');    // get the post id for rendering the right post
  const selectedPost = useSelector(state =>
    state.posts.availablePosts.find(prod => prod.id === postId) // find the wanted post
  );
  const dispatch = useDispatch();

  return (          // render the right post after we found him in inside available posts
    <ScrollView>  
      <Text style={styles.description}>{selectedPost.description}</Text>
      <View style={styles.actions}>
      </View>
    </ScrollView>
  );
};

// menu for this screen, we can only go back to posts overview screen
PostDetailScreen.navigationOptions = navData => {
  return {
    headerTitle: navData.navigation.getParam('postTitle')
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

export default PostDetailScreen;
