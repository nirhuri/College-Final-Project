import React, { useState, useEffect, useCallback, useReducer } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
  TextInput
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import HeaderButton from '../../components/UI/HeaderButton';
import * as tenantActions from '../../store/actions/BuildingMap';
import * as userActions from '../../store/actions/users';
import * as authActions from '../../store/actions/auth';
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';

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


const EditApartmentScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const tenId = props.navigation.getParam('tenantId'); 
    const editedTenant = useSelector(state =>
      state.tenant.myBuilding.find(tenan => tenan.id === tenId)
    );
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
          street: editedTenant ? editedTenant.street : '',
          apartmentNum: editedTenant ? editedTenant.apartmentNum : '',
          tenantEmail: editedTenant ? editedTenant.tenantEmail : '',
          name: editedTenant ? editedTenant.name : ''
        },
        inputValidities: {
          street: editedTenant ? true : false,
          apartmentNum: editedTenant ? true : false,
          tenantEmail: editedTenant ? true : false,
          name: editedTenant ? true : false
        },
        //formIsValid: editedTenant ? true : false
        formIsValid: true
      });

    useEffect(() => {
        if (error) {
          Alert.alert('An error occurred!', error, [{ text: 'OK' }]);
        }
    }, [error]);

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
          if(editedTenant) {
            await dispatch(
                tenantActions.updateTenant(
                  tenantId,
                  formState.inputValues.apartmentNum,
                  formState.inputValues.street,
                  formState.inputValues.tenantEmail,
                )
            );
          }
        else { 
            await dispatch(
            tenantActions.createTenant(
              formState.inputValues.name,
              formState.inputValues.apartmentNum,
              formState.inputValues.street,
              formState.inputValues.tenantEmail,
            )
          );

        props.navigation.goBack();
        }
     } catch (err) {
        setError(err.message);
      }
      setIsLoading(false);
    
    }, [dispatch, formState]);

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
                id="name"
                label="Tenant Name"
                errorText="Please enter a valid input!"
                keyboardType="default"
                autoCapitalize="sentences"
                autoCorrect
                returnKeyType="next"
                onInputChange={inputChangeHandler}
                initialValue={editedTenant ? editedTenant.name : ''}
                initiallyValid={!!editedTenant}
                required
              />
    
            <Input
                id="tenantEmail"
                label="Enter tenant's Email"
                errorText="Please enter a valid Email!"
                keyboardType="default"
                onInputChange={inputChangeHandler}
                initialValue={editedTenant ? editedTenant.tenantEmail : ''}
                initiallyValid={!!editedTenant}
              />

                <Input
                id="street"
                label="Enter Street Name"
                errorText="Please enter a valid Street!"
                keyboardType="default"
                autoCorrect
                multiline
                numberOfLines={1}
                onInputChange={inputChangeHandler}
                initialValue={editedTenant ? editedTenant.street : ''}
                initiallyValid={!!editedTenant}
                required
                minLength={1}
              />

              <Input
                id="apartmentNum"
                label="Enter apartment number"
                errorText="Please enter a valid Number!"
                keyboardType="number-pad"
                autoCorrect
                multiline
                numberOfLines={1}
                onInputChange={inputChangeHandler}
                initialValue={editedTenant ? editedTenant.apartmentNum : ''}
                initiallyValid={!!editedTenant}
                required
                minLength={1}
              />

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      );

    };

    EditApartmentScreen.navigationOptions = navData => {
        const submitFn = navData.navigation.getParam('submit');
        return {
          headerTitle: navData.navigation.getParam('tenantId')
            ? 'Edit Tenant'
            : 'Add Tenant',
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
  
  export default EditApartmentScreen;