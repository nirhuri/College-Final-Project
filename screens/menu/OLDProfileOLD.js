import React from 'react';
import { View, StyleSheet, Text, Platform, SafeAreaView, Image, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';

const Profile = props => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={{alignSelf: "center"}}>
          <View style={styles.profileImage}>
            <Image source={require("../../assets/profile-pic.jpg")} style={styles.image} resizeMode="center"></Image>
          </View>
          <View style={styles.dm}>
          <MaterialIcons name="chat" size={18} color="#DFD8C8"></MaterialIcons>
          </View>

        </View>
        <View style={styles.infoContainer}>
          <Text style={[styles.text, {fontWeight: "200", fontSize: 36}]}>Nir Huri</Text>
        </View>

        <View style={styles.statusContainer}>
          <View style={styles.statsBox}>
            <Text style={[styles.text, { fontSize: 24 }]}>13</Text>
            <Text style={[styles.text, styles.subText]}>Building</Text>
          </View>
          <View style={[styles.statsBox, {borderColor: "#DFD8C8", borderLeftWidth: 1, borderRightWidth: 1}]}>
            <Text style={[styles.text, { fontSize: 24 }]}>6</Text>
            <Text style={[styles.text, styles.subText]}>Appartment</Text>
          </View>
          <View style={styles.statsBox}>
            <Text style={[styles.text, { fontSize: 24 }]}>39</Text>
            <Text style={[styles.text, styles.subText]}>Posts</Text>
          </View>
        </View>

        <View style={{marginTop: 32}}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>

          </ScrollView>
          <View style={styles.postCount}>
              <Text style={[styles.text, { fontSize: 24, color: "#DFD8C8", fontWeight: "360" }]}>10</Text>
              <Text style={[styles.text, { fontSize: 12, color: "#DFD8C8", textTransform: "uppercase"}]}>Posts</Text>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
};

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
    )
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  text: {
    //fontFamily: "HelveticaNeue",
    color: "#52575D"
  },
  subText: {
    fontSize: 12,
    color: "#AEB5BC",
    textTransform: "uppercase",
    fontWeight: "500" 
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginHorizontal: 16
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden"
  },
  dm: {
    backgroundColor: "#41444B",
    position: "absolute",
    top: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  active: {
    backgroundColor: "#34FFB9",
    position: "absolute",
    bottom: 28,
    left: 10,
    padding: 4,
    height: 28,
    width: 20,
    borderRadius: 10
  },
  infoContainer: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: 16
  },
  statusContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 32
  },
  statsBox: {
    alignItems: "center",
    flex: 1
  },
  postsContainer: {
    width: 180,
    height: 280,
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 10
  },
  postCount: {
    backgroundColor: "#41444B",
    position: "absolute",
    top: "50%",
    marginTop: -50,
    marginLeft: 30,
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    shadowColor: "rgba(0, 0, 0, 0.28)",
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    shadowOpacity: 1
  }
});

export default Profile;