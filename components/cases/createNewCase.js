import React, { useState, useEffect } from "react";

import {
  Container,
  Header,
  Content,
  Input,
  Icon,
  Button,
  Text,
  Item,
  Form,
  Textarea,
  Card,
  CardItem,
  Thumbnail,
  Left,
  Right,
  Body,
  Picker,
  Tab,
  Tabs,
} from "native-base";
import { StyleSheet, Platform, View, Image, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import * as caseActions from '../../store/actions/cases';
import * as firebase from 'firebase';
import { useDispatch, useSelector } from "react-redux";

const createNewCase = (props) => {
  
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [caseId, setCaseId] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [imageLink, setImageLink] = useState();
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const userId = useSelector(state => state.auth.userId);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsSubmitDisabled(body === "" || title === "");
  }, [body, title]);

  const onSubmit = async () => {
    try {
      var ref = firebase.storage().ref().child(`images/cases/${userId}/${caseId}`);
      const imgUrl = await ref.getDownloadURL();
      setImageLink(imgUrl);
      await dispatch(caseActions.createCase(title, subject, body, caseId, imgUrl));
    } catch (err) {
      console.log(err);
    }
    alert("Case Submited!");
  };

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

  const uploadToFirebase = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    try {
      const temp = Date.now();
      setCaseId(temp);
      var ref = firebase.storage().ref().child(`images/cases/${userId}/${temp}`);
      return ref.put(blob);
    } catch (error) {
      console.log(error);
    }
  }

  const galleryHandler = async () => {
    const hasPermission = await verifyCameraPer();
    if(!hasPermission) {
      return;
    }
    const image = await ImagePicker.launchImageLibraryAsync({
      quality: 0.3
    });
    uploadToFirebase(image.uri);
  }

  const photoHandler = async () => {
    const hasPermission = await verifyCameraPer();
    if(!hasPermission) {
      return;
    }

    const image = await ImagePicker.launchCameraAsync({
      quality: 0.3
    });

    if(!image.cancelled) {
      uploadToFirebase(image.uri);
    }
  };

  const msg1 = <Text style={{color: 'red'}}>*</Text>;
  const msg2 = <Text> </Text>;

  return (
    <Content style={styles.pad}>
      <Form>
        <Item>
          <Input
            placeholder="Title"
            onChangeText={(text) => setTitle(text.trim())}
          />
        </Item>
        <Item picker>
          <Picker
            mode="dropdown"
            iosIcon={<Icon name="arrow-down" />}
            placeholder="Select Subject"
            placeholderStyle={{ color: "#bfc6ea" }}
            placeholderIconColor="#007aff"
            selectedValue={subject}
            onValueChange={(value) => setSubject(value)}
          >
            <Picker.Item label="Loby" value="Loby" />
            <Picker.Item label="Garden" value="Garden" />
            <Picker.Item label="Stairs" value="Stairs" />
            <Picker.Item label="Electric" value="Electric" />
            <Picker.Item label="Water" value="Water" />
            <Picker.Item label="Gas" value="Gas" />
            <Picker.Item label="Leak" value="Leak" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </Item>
        <Item style={styles.col}>
          <Text style={{ color: "red" }}>{ Textarea.value === '' ? msg2 : msg1 }</Text>
          <Textarea
            rowSpan={5}
            placeholder={"Description"}
            //placeholderTextColor="#ff0000"
            onChangeText={(text) => setBody(text)}
          />
        </Item>
      </Form>
      <View style={styles.rowButtons}>
        <Button onPress={galleryHandler}>
          <Text>Add a Photo</Text>
        </Button>
        <Button onPress={photoHandler}>
          <Text>Take a Photo</Text>
        </Button>
      </View>
      <View style={styles.container}>
        <Button block onPress={onSubmit} disabled={isSubmitDisabled}>
          <Text>Submit</Text>
        </Button>
      </View>
    </Content>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  pad: {
    padding: 10,
  },
  rowButtons: {
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 10,
  },
  col: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});

export default createNewCase;
