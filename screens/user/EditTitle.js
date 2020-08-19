
import React, { useState, useEffect, useCallback, useReducer } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
  TextInput,
  Text,
  Button

} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import HeaderButton from '../../components/UI/HeaderButton';
import * as ProfileActions from '../../store/actions/profile';
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';

const EditTitleScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState('');
    const dispatch = useDispatch();

    const user = useSelector(state => state.profile.userProfile);

    // useEffect(() => {
    //   props.navigation.setParams({ submit: submitHandler });
    // }, [submitHandler]);

    const getTitle = () => {
      return title;
    }

    const submitHandler = () => {
      try {
        const titleData = getTitle();
        dispatch(ProfileActions.updateTitle(titleData, user[0].key));
        props.navigation.goBack();
      } catch(error) {
          console.log(error)
      }
    }

      const inputChangeHandler = (inputValue) => {  
        setTitle(inputValue);
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

              <View style={styles.formControl}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                style={styles.input}
                  onChangeText={inputChangeHandler}
                />
                <Button 
                style={styles.button}
                title="Save Changes"
                color={Colors.accent}
                onPress={submitHandler}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      );

    };


const styles = StyleSheet.create({
    form: {
      margin: 20
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
      formControl: {
        width: '100%'
      },
      label: {
        fontFamily: 'open-sans-bold',
        marginVertical: 8
      },
      input: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginBottom: 10
      },
      errorContainer: {
        marginVertical: 5
      },
      errorText: {
        fontFamily: 'open-sans',
        color: 'red',
        fontSize: 13
      },
      button: {
        paddingTop: 20
      }
  });
  
  export default EditTitleScreen;
