import React, { Component, useEffect } from "react";
import { StyleSheet, Platform, Image, Dimensions  } from "react-native";

import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import * as ProfileAction from "../../store/actions/profile";
import AppIntroSlider from "react-native-app-intro-slider";

import {
  Container,
  Header,
  View,
  DeckSwiper,
  Card,
  CardItem,
  Thumbnail,
  Text,
  Left,
  Body,
  Icon,
  Content,
  H1,
  H2,
  H3,
} from "native-base";

import { Calendar, CalendarList, Agenda } from "react-native-calendars";

const Home = (props) => {
  const dispatch = useDispatch();

  const profiles = async () => {
    try {
      await dispatch(ProfileAction.fetchProfiles());
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    profiles();
  }, []);

  const openSlides = [
    {
      id: '1',
      image: require("../../assets/pics/openSlide1.jpeg"),
    },
    {
      id: '2',
      image: require("../../assets/pics/openSlide2.jpeg"),
    },
    {
      id: '3',
      image: require("../../assets/pics/openSlide3.jpeg"),
    },
    {
      id: '4',
      image: require("../../assets/pics/openSlide4.jpeg"),

    },
  ];

  const screenWidth = Math.round(Dimensions.get('window').width);
  const screenHeight = Math.round(Dimensions.get('window').height);

  _renderItem = ({ item }) => {
    return (
      <View>
        <Text>{item.title}</Text>
          <Image  style={{width: screenWidth, height: screenHeight-250}} source={item.image} keyExtractor={(openSlides, index) => index.toString()}/>
        <Text>{item.text}</Text>
      </View>
    );
  };

  return (
    <Container>
      <View>
        <View style={styles.title}>
          <H1>Welcome To BuildIn</H1>
          <H3>Your Building Manager!</H3>
        </View>
      </View>
      <Content>
        <View>
          <AppIntroSlider
            data={openSlides}
            renderItem={_renderItem}
            onDone={() => {console.log("Hi")}}
            showSkipButton={false}
            onSkip={() => {}}
            dotStyle={style ={backgroundColor: 'rgba(25, 117, 255, .3)'}}
            prevLabel = {"Back"}
            showPrevButton={false}
          />
        </View>
      </Content>
    </Container>
  );
};

Home.navigationOptions = (navData) => {
  return {
    headerTitle: "Home",
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  card: {
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
  },
  title: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "column",
    padding: 50,
    alignItems: "center",
  },
});

export default Home;
