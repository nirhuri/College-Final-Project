import React, { useState, useEffect, useCallback } from "react";

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
  Title,
  List,
  ListItem,
  Separator
} from "native-base";
import { StyleSheet, Platform, View, Image, ScrollView, FlatList } from "react-native";
import { HeaderButtons } from 'react-navigation-header-buttons';
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { useDispatch, useSelector } from "react-redux";
import * as caseActions from '../../store/actions/cases';
import CaseItem from '../../components/cases/CaseItem';
import PostItem from '../posts/PostItem'

const myCases = props => {
  const [isLoading, setIsLoading] = useState(false); // is loading state
  const [isRefreshing, setIsRefreshing] = useState(false);    // is refreshing state
  const [error, setError] = useState();   // error state
  const dispatch = useDispatch();
  const cases = useSelector(state => state.case.myCases);

  const loadCases = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      //await dispatch(caseActions.resetData());
      await dispatch(caseActions.fetchCases());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, dispatch, setIsLoading, setError]);

  useEffect(() => {
    setIsLoading(true);
    loadCases().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadCases]);

  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (result !== "granted") {
      alert("You dont have permission to the gallery");
      return false;
    }
    return true;
  };

  const galleryHandler = async () => {
    const hasPermission = verifyPermissions();
    if (!hasPermission) {
      return;
    }
    ImagePicker.launchImageLibraryAsync();
  };

  const selectItemHandler = (id, title, subject) => {
    props.navigation.navigate('CaseDetail', {
      caseId: id,
      caseTitle: title,
      subject: subject
    });
  };


  return (
        <FlatList
        onRefresh={loadCases}
        refreshing={isRefreshing}
        data={cases}
        keyExtractor={item => item.id}
        renderItem={itemData => (
          <CaseItem
            title={itemData.item.title}
            subject={itemData.item.subject}
            status={itemData.item.status}
            image={itemData.item.imageLink}
          >
          </CaseItem>
        )}
      />
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
});

export default myCases;
