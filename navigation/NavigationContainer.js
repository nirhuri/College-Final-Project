import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import AppNavigator from './AppNavigator';

// this component is used to logout the user after x amount of time
// when the app timer runs out and the user should automaticly logged out from the system
// we need to send hom back to the login/signup page and this component is the reason we
// can navigate him automaticly to the wanted screen.
// this action happend when the token value in reducers -> auth is NULL

const NavigationContainer = props => {
  const navRef = useRef();    // used for navigation options in AppNavigation
  const isAuth = useSelector(state => !!state.auth.token); // if we have a tokon or dont, the double !! is force it to give back a boolean value

  useEffect(() => {
    if (!isAuth) {    // if we are not auth we want to navigate to auth screen
      navRef.current.dispatch(
        NavigationActions.navigate({ routeName: 'Auth' }) // navigate to auth screen if not authenticate
      );
    }
  }, [isAuth]); // 

  return <AppNavigator ref={navRef} />; // the ref lets us to use the navigation functionality in the AppNavigator
};

export default NavigationContainer;
