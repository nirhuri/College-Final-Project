import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  Platform,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import EditScreen from '../../store/actions/posts';
import * as postsActions from '../../store/actions/posts';
import * as tenantActions from '../../store/actions/BuildingMap';
import Colors from '../../constants/Colors';
import PostItem from '../../components/posts/PostItem';

const PostsOverviewScreen = props => {
  const [isLoading, setIsLoading] = useState(false); // is loading state
  const [isRefreshing, setIsRefreshing] = useState(false);    // is refreshing state
  const [error, setError] = useState();   // error state
  const posts = useSelector(state => state.posts.availablePosts);
  const dispatch = useDispatch();

  const loadPosts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(postsActions.fetchPosts());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      'willFocus',
      loadPosts
    );

    return () => {
      willFocusSub.remove();
    };
  }, [loadPosts]);

  useEffect(() => {
    setIsLoading(true);
    loadPosts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadPosts]);

  const selectItemHandler = (id, title) => {
    props.navigation.navigate('PostDetail', {
      postId: id,
      postTitle: title
    });
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button
          title="Try again"
          onPress={loadPosts}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && posts.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No posts found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={loadPosts}
      refreshing={isRefreshing}
      data={posts}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <PostItem
        title={itemData.item.title}
          image={itemData.item.imageUrl}
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
          }}
        >
          <Button
          style={styles.botton}
            color={Colors.primary}
            title="Read More..."
            onPress={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          />
          <Button
          style={styles.button}
            color={Colors.primary}
            title="Delete"
            onPress={() => {
              dispatch(postsActions.deletePost(itemData.item.id));
            }}
          />
        </PostItem>
      )}
    />
  );
};

PostsOverviewScreen.navigationOptions = navData => {
  return {
    headerTitle: 'All Posts',
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="plus"
          iconName={Platform.OS === 'android' ? 'md-add' : 'ios-add'}
          onPress={() => {
            navData.navigation.navigate('EditPost');
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  centered: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  button: {
    marginBottom: 50
  }
});

export default PostsOverviewScreen;
