import React, { Component, getState, useEffect, useState } from "react";
import { StyleSheet, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  ListItem,
  Text,
  Left,
  Right,
  Body,
  Separator
} from "native-base";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as firebase from 'firebase';
import * as UserAction from '../../store/actions/users';
import * as ProfileAction from '../../store/actions/profile';
import * as AuthAction from '../../store/actions/auth';

const ProfileSettings = (props) => {
  const userId = useSelector(state => state.auth.userId);
  const users = useSelector(state => state.profile.userProfile);
  const dispatch = useDispatch();

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


  uploadToFirebase = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    try {
      var ref = firebase.storage().ref().child('images/' + 'profile_pictures/' + userId);
      return ref.put(blob);
    } catch (error) {
      console.log(error);
    }
  }

  const deletePicture = async () => {
    try {
      const ref = firebase.storage().ref().child('images/profile_pictures/' + userId);
      await ref.delete();
    } catch (error) {
      console.log(error);
    }
    return;
  }

  const takeImageHandler = async () => {

    const hasPermission = await verifyCameraPer();
    if(!hasPermission) {
      return;
    }

    const image = await ImagePicker.launchCameraAsync({
      quality: 0.5
    });

    if(!image.cancelled) {
      this.uploadToFirebase(image.uri).then(() => {
        //Alert.alert("Image has changed!");
      }).catch((error) => {
        console.log(error);
        //Alert.alert(error);
      });
    }
  }

  const phoneLibraryHandler = async () => {

    const hasPermission = await verifyCameraPer();
    if(!hasPermission) {
      return;
    }
    const image = await ImagePicker.launchImageLibraryAsync();
    this.uploadToFirebase(image.uri).then(() => {
      console.log("success");
    }).catch((error) => {
      console.log(error);
    })

    uploadToFirebase(image.uri);
  }

  const aboutHandler = () => {
    props.navigation.navigate('EditTitle');
  }

  const titleHandler = () => {
    props.navigation.navigate('EditAbout');
  }

  const deleteAccount = async () => {

    dispatch(AuthAction.logout());
    dispatch(AuthAction.deleteAccount(users[0].key));
      try {
        const userId = users[0].key;
        await dispatch(ProfileAction.deleteProfile(userId));
        await dispatch(UserAction.deleteUser(userId));
      } catch(err) {
        console.log(err);
      }
  }

  const deleteUser = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: deleteAccount,
        }
      ],
      {
        cancelable: false
      }
    )
  }

    return (
      <Container style={styles.container}>
        <Content>
          <Separator bordered>
          <Text>PROFILE PICTURE</Text>
          </Separator>
          <ListItem>
            <Text onPress={phoneLibraryHandler}>Choose From Library</Text>
          </ListItem>
          <ListItem>
            <Text onPress={takeImageHandler}>Open Camera</Text>
          </ListItem>
          <ListItem last>
            <Text onPress={deletePicture}>Delete Picture</Text>
          </ListItem>

          <Separator bordered>
            <Text>ABOUT YOURSELF</Text>
          </Separator>
          <ListItem>
            <Text onPress={aboutHandler}>Edit Title</Text>
          </ListItem>
          <ListItem last>
            <Text onPress={titleHandler}>Edit About</Text>
          </ListItem>

          <Separator bordered>
            <Text>SECURITY</Text>
          </Separator>
          <ListItem>
            <Text>Change Password</Text>
          </ListItem>
          <ListItem last>
            <Text onPress={deleteUser}>Delete Account</Text>
          </ListItem>
        </Content>
      </Container>
    );
  }

ProfileSettings.navigationOptions = navData => {
  return {
    headerTitle: 'Settings'
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF"
  },
});

export default ProfileSettings;