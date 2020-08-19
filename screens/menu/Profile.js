import React, {Component, useState, useEffect, useFocusEffect, useCallback} from 'react';
import { View, StyleSheet, Text, Platform, SafeAreaView, Image, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import { TouchableOpacity } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import * as UserAction from '../../store/actions/users';
import * as ProfileAction from '../../store/actions/profile';
import * as firebase from 'firebase';
import { Card, 
  CardTitle, 
  CardContent, 
  CardAction, 
  CardButton, 
  CardImage } 
  from 'react-native-material-cards'

const Profile = props => {

  const [profPic, setProfPic] = useState();
  const [userName, setUserName] = useState();
  const [userTitle, setUserTitle] = useState();
  const [userDes, setUserDes] = useState();

  dispatch = useDispatch();
  const userId = useSelector(state => state.auth.userId);
  const users = useSelector(state => state.profile.userProfile);

  const setPicture = async () =>  {
    const ref = firebase.storage().refFromURL(`gs://finalproject-6f995.appspot.com/images/profile_pictures/${userId}`);
    const profilePicUrl = await ref.getDownloadURL();
    setProfPic(profilePicUrl)
}

const setPictures = useCallback (async () =>  {
  try {
    const ref = firebase.storage().refFromURL(`gs://finalproject-6f995.appspot.com/images/profile_pictures/${userId}`);
    const profilePicUrl = await ref.getDownloadURL();
    setProfPic(profilePicUrl)
  } catch(err) {
    setProfPic(null);
  }
})
   useEffect(() => {
    setPicture(); 
   }, [])

   const fetchProfiles = useCallback (async () => {
     try {
       setUserName(users[0].userName);
       setUserTitle(users[0].title);
       setUserDes(users[0].about);
     } catch(err) {
       console.log(err);
     }
   })
   useEffect(() => {
     fetchProfiles();
   }, [])

   useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      'willFocus',
      setPictures
    );

    return () => {
      willFocusSub.remove();
    };
  }, [setPictures]);

  return (
    <View style={styles.container}>
          <View style={styles.header}></View>
          <Image style={styles.avatar} source={{uri: profPic}}/>
          <View style={styles.body}>
            <View style={styles.bodyContent}>
              <Text style={styles.name}>{userName}</Text>
              <Text style={styles.info}>{userTitle}</Text>
              <Text style={styles.description}>{userDes}</Text>
               
              {/* <TouchableOpacity style={styles.buttonContainer}>
                <Text>Option 1</Text>  
              </TouchableOpacity>              
              <TouchableOpacity style={styles.buttonContainer}>
                <Text>Option 2</Text> 
              </TouchableOpacity> */}
            </View>
        </View>
      </View>
  )
}


Profile.navigationOptions = navData => {
  return {
    headerTitle: 'Profile',
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
          title="Settings"
          iconName={Platform.OS === 'android' ? 'md-settings' : 'ios-settings'}
          onPress={() => {
            navData.navigation.navigate('EditProfile');
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  header:{
    backgroundColor: "#00BFFF",
    height:120,
  },
  avatar: {
    width: 200,
    height: 200,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    position: 'absolute',
    marginTop:50
  },
  name:{
    fontSize:22,
    color:"#FFFFFF",
    fontWeight:'600'
  },
  body:{
    marginTop:120,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding:30,
  },
  name:{
    fontSize:28,
    color: "#696969",
    fontWeight: "600"
  },
  info:{
    fontSize:16,
    color: "#00BFFF",
    marginTop:10
  },
  description:{
    fontSize:16,
    color: "#696969",
    marginTop:10,
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
    backgroundColor: "#00BFFF",
  },
});


export default Profile;