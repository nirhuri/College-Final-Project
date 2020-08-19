import React, { useState, useEffect, useCallback, useReducer } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import HeaderButton from '../../components/UI/HeaderButton';
import * as postsActions from '../../store/actions/posts';
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';
import { Button } from 'react-native-paper';
import * as firebase from 'firebase';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
  return state;
};

const EditPostScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [postId, setPostId] = useState();
  const [imageUri, setImageUri] = useState("");
  const prodId = props.navigation.getParam('postId'); //
  const editedPost = useSelector(state =>
    state.posts.userPosts.find(prod => prod.id === prodId)
  );
  const userId = useSelector(state => state.auth.userId);
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      imageUrl: editedPost ? editedPost.imageUrl : '',
      description: editedPost ? editedPost.description : '',
    },
    inputValidities: {
      title: editedPost ? true : false,
      description: editedPost ? true : false,
    },
    formIsValid: editedPost ? true : false
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred!', error, [{ text: 'OK' }]);
    }
  }, [error]);

  const uploadToFirebase = async (uri, temp) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    try {
      var ref = firebase.storage().ref().child(`images/posts/${userId}/${temp}`);
      return ref.put(blob);
    } catch (error) {
      console.log(error);
    }
  };

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert('Wrong input!', 'Please check the errors in the form.', [
        { text: 'OK' }
      ]);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      if (editedPost) {
        await dispatch(
          postsActions.updatePost(
            prodId,
            formState.inputValues.title,
            formState.inputValues.description,
            formState.inputValues.imageUrl
          )
        );
      } else {
          var ref = firebase.storage().ref().child(`images/posts/${userId}/${postId}`);
          const imgUrl = await ref.getDownloadURL();
          await dispatch(
            postsActions.createPost(
              formState.inputValues.title,
              formState.inputValues.description,
              imgUrl
            )
          );
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
    
  }, [dispatch, prodId, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
      });
    },
    [dispatchFormState]
  );

  const verifyCameraPer = async () => {
    const result = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL) //CAMERA_ROLL from gallery
    if(result.status !== 'granted') {
      Alert.alert(
        'Permission Denied!',
        'You need to grant camera permission to use the camera.',
        [{text: 'OK'}]
      )
      return false;
    }
    return true;
  }

  const galleryHandler = async () => {
    const hasPermission = await verifyCameraPer();
    if(!hasPermission) {
      return;
    }
    const image = await ImagePicker.launchImageLibraryAsync({
      quality: 0.3
    });
    setImageUri(image.uri);
    const temp = Date.now();
    setPostId(temp);
    uploadToFirebase(image.uri, temp);
  };

  const photoHandler = async () => {
    const hasPermission = await verifyCameraPer();
    if(!hasPermission) {
      return;
    }

    const image = await ImagePicker.launchCameraAsync({
      quality: 0.3
    });

    if(!image.cancelled) {
      const temp = Date.now();
      setPostId(temp);
        uploadToFirebase(image.uri, temp);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <View style={styles.form}>
          <Input
            id="title"
            label="Title"
            errorText="Please enter a valid title!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedPost ? editedPost.title : ''}
            initiallyValid={!!editedPost}
            required
          />

          <Input
            id="description"
            label="What's on your mind?"
            errorText="Please enter a valid post!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            multiline
            numberOfLines={3}
            onInputChange={inputChangeHandler}
            initialValue={editedPost ? editedPost.description : ''}
            initiallyValid={!!editedPost}
            required
            minLength={5}
          />

        <Button onPress={galleryHandler}>
          <Text>Add a Photo</Text>
        </Button>
        <Button onPress={photoHandler}>
          <Text>Take a Photo</Text>
        </Button>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditPostScreen.navigationOptions = navData => {
  const submitFn = navData.navigation.getParam('submit');
  return {
    headerTitle: navData.navigation.getParam('postId')
      ? 'Edit Post'
      : 'Add Post',
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
          }
          onPress={submitFn}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default EditPostScreen;
