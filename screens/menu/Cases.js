import React, { useState, useEffect } from "react";
//import { View, StyleSheet, Text, Platform, ScrollView } from "react-native";
import {
  Container,
  Header,
  Content,
  Input,
  Icon,
  Button,
  Text,
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
  TabHeading,
  SafeAreaView
} from "native-base";

import { StyleSheet, Platform, View, Image, ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import HeaderButton from "../../components/UI/HeaderButton";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CreateNewCase from "../../components/cases/createNewCase";
import MyCases from "../../components/cases/myCases";

const Case = (props) => {
  // const showResults = (caseId) => {
  //   const arr = [1, 2, 3, 4, 5, 6, 4];

  //   return arr.filter((cell) => caseId === cell);
  // };

  return (
        <Tabs>
          <Tab heading={<TabHeading><Icon name= {Platform.OS === 'android'?"md-pricetag":"ios-pricetag"}/><Text>New Case</Text></TabHeading>}>
            <CreateNewCase />
          </Tab>
          <Tab heading={<TabHeading><Icon name= {Platform.OS === 'android'?"md-paper":"ios-paper"}/><Text>My Cases</Text></TabHeading>}>
            <MyCases />
          </Tab>
        </Tabs>
  );
};

Case.navigationOptions = (navData) => {
  return {
    headerTitle: "Case Manager",
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
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pad: {
    padding: 10,
  },
});

export default Case;
