import React, { useState } from "react";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import ReduxThunk from "redux-thunk";

import postsReducer from "./store/reducers/posts";
import authReducer from "./store/reducers/auth";
import tenantReducer from "./store/reducers/BuildingMap";
import usersReducer from "./store/reducers/users";
import profileReducer from "./store/reducers/profile";
import caseReducer from './store/reducers/cases';
import classReducer from './store/reducers/facilities';
import NavigationContainer from "./navigation/NavigationContainer";
import { Ionicons } from '@expo/vector-icons';
import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AAAAkEN62aQ:APA91bGuwlUL659Eog9D_RPfSidAMQB4kKjHElJZjkmmN8HYlyvoqnpPDrXoldQl-Iaoj0KWgxZMOq_QVkw_fk8J8MpCDWXcWBuXjwiXKJhtYuA7T2WfCRYaQAswamGnNgX5Qxt777vO',
  authDomain: 'finalproject-6f995.firebaseapp.com',
  databaseURL: 'https://finalproject-6f995.firebaseio.com/',
  storageBucket: 'gs://finalproject-6f995.appspot.com'
}
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const rootReducer = combineReducers({
  // combine the redux reducers before put it in the redux store
  posts: postsReducer,
  auth: authReducer,
  tenant: tenantReducer,
  users: usersReducer,
  profile: profileReducer,
  case: caseReducer,
  clas: classReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk)); // create the store with the combined reducers

const fetchFonts = () => {
  return Font.loadAsync({
    // set the fonts from the assets folder, can be added more here
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
    Roboto: require("native-base/Fonts/Roboto.ttf"),
    Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
    ...Ionicons.font,
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false); // fonts stats

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts} // set the fonts before the app starts
        onFinish={() => {
          setFontLoaded(true);
        }}
      />
    );
  }
  return (
    // provider lets us use the redux states all over the app
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}
