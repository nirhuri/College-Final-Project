import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
  Picker
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';

import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';
import * as userActions from '../../store/actions/users';
import * as profileActions from '../../store/actions/profile';

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

const AuthScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isSignup, setIsSignup] = useState(false);
  const [userType, setUserType] = useState("Tenant");
  const [username, setName] = useState();
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    
    inputValues: {
      email: '',
      password: ''
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An Error Occurred!', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  const authHandler = async () => {
    let action;
    let user;
    let profile;
    if (isSignup) {
      action = authActions.signup(
        formState.inputValues.email,
        formState.inputValues.password
      );
      profile = profileActions.createProfile(username);
      try {
        await dispatch(action);
        await dispatch(profile);
        props.navigation.navigate('App');
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }

    } else {
      action = authActions.login(
        formState.inputValues.email,
        formState.inputValues.password
      );
      try {
        await dispatch(action);
        props.navigation.navigate('App');
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    }
    setError(null);
    setIsLoading(true);
  };

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

  const nameChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      setName(inputValue);
    }
  )

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <LinearGradient colors={['#0066ff', '#fff']} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <ScrollView>
            {isSignup ?            
            <Input
              id="full name"
              label="Full Name"
              required
              autoCapitalize="none"
              errorText="Please enter your full name."
              onInputChange={nameChangeHandler}
              initialValue=""
            /> : null}
            <Input
              id="email"
              label="E-Mail"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorText="Please enter a valid email address."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="password"
              label="Password"
              keyboardType="default"
              secureTextEntry
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a valid password."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <View style={styles.buttonContainer}>
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (

                <View>
                {isSignup ? (
                  <Picker 
                    style={styles.picker}
                    selectedValue={userType}
                    onValueChange={(itemValue) => setUserType(itemValue)}
                  >
                    <Picker.Item label="Tenant" value="Tenant"/>
                    <Picker.Item label="Admin" value="Admin"/>
                  </Picker>
                ) : (
                null
                )}
                </View>
              )}
              <View style={styles.buttonContainer}>
              <Button
                title={isSignup ? 'Sign Up' : 'Login'}
                color={Colors.primary}
                onPress={authHandler}
              />
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title={`Switch to ${isSignup ? 'Login' : 'Sign Up'}`}
                color={Colors.accent}
                onPress={() => {
                  setIsSignup(prevState => !prevState);
                }}
              />
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

AuthScreen.navigationOptions = {
  headerTitle: 'Login to BuildIn'
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    maxHeight: 400,
    padding: 20
  },
  buttonContainer: {
    marginTop: 10
  }
});

export default AuthScreen;
