import React from 'react';
import {
  createStackNavigator,
  createDrawerNavigator,
  createSwitchNavigator,
  createAppContainer,
  DrawerItems,
  createBottomTabNavigator
} from 'react-navigation';
import { Platform, SafeAreaView, Button, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { createAppContatiner } from 'react-navigation';


import PostsOverviewScreen from '../screens/menu/PostsOverviewScreen';
import PostDetailScreen from '../screens/menu/PostDetailScreen';
import EditPostScreen from '../screens/user/EditPostScreen';
import AuthScreen from '../screens/user/AuthScreen';
import StartupScreen from '../screens/StartupScreen';
import Profile from '../screens/menu/Profile';
import MapScreen from '../screens/menu/BuildingMap';
import EditApartment from '../screens/user/EditApartmentScreen';
import Cases from '../screens/menu/Cases';
import MyCasesScreen from '../components/cases/myCases';
import Home from '../screens/menu/Home';
import Facilities from '../screens/menu/Facilities';
import Payments from '../screens/menu/PaymentsAndReciepts';
import TenantDetailScreen from '../screens/menu/TenantDetailScreen';
import EditProfileScreen from '../screens/user/ProfileSettings';
import EditTitleScreen from '../screens/user/EditTitle';
import EditAboutScreen from '../screens/user/EditAbout';
import CaseDetailScreen from '../components/cases/CaseDetailScreen';
import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
  },
  headerTitleStyle: {
    fontFamily: 'open-sans-bold'
  },
  headerBackTitleStyle: {
    fontFamily: 'open-sans'
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
};


// ths stack navigator creates the option to navigate in the app.
// when you navigate in the app, you navigate inside a stack of pages
// this stack created here in the stack navigator

const PostsNavigator = createStackNavigator(
  {
    // her we add the pages we want to navigate in this specific stack.
    // each stack holds the pages we want to navigate between
    PostsOverview: PostsOverviewScreen,
    PostDetail: PostDetailScreen,
    EditPost: EditPostScreen
  },
  {
    defaultNavigationOptions: defaultNavOptions
  }
);

const CaseNavigator = createStackNavigator(
  {
    Cases: Cases,
    MyCases: MyCasesScreen,
    CaseDetail: CaseDetailScreen
  },
  {
    defaultNavigationOptions: defaultNavOptions
  }
)

const HomeNavigator = createStackNavigator(
  {
    Home: Home
  },
  {
    defaultNavigationOptions: defaultNavOptions
  }
)

const ProfileNavigator = createStackNavigator(
  {
    Profile: Profile,
    EditProfile: EditProfileScreen,
    EditTitle: EditTitleScreen,
    EditAbout: EditAboutScreen
  },
  {
    defaultNavigationOptions: defaultNavOptions
  }
)

const MapNavigator = createStackNavigator(
  {
    MapScreen: MapScreen,
    TenantDetail: TenantDetailScreen,
    AddApartment: EditApartment
  },
  {
    defaultNavigationOptions: defaultNavOptions
  }
)

const PaymentsNavigator = createStackNavigator(
  {
    Payments: Payments
  },
  {
    defaultNavigationOptions: defaultNavOptions
  }
)

const FacilitiesNavigator = createStackNavigator(
  {
    Facilities: Facilities
  },
  {
    defaultNavigationOptions: defaultNavOptions
  }
)

const Tabs = createBottomTabNavigator({
  Home: HomeNavigator,
  Profile: ProfileNavigator,
  Settings: EditProfileScreen
},
{
  navigationOptions: ({ navigation }) => {
    const { routeName } = navigation.state.routes[navigation.state.index];
    return {
      header: null,
      headerTitle: routeName
    };
  }
}
)

const TabNavigator = createStackNavigator({
TabNavigator: Tabs
},
{
  defaultNavigationOptions: ({ navigation }) => {
    return {
      headerLeft: (
        <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.openDrawer()} name="md-menu" size={30} />
      )
    };
  }
}
)

const TabsDrawer = createDrawerNavigator({
  Tab: TabNavigator
})

// the DrawerNavigator create the slide menu navigation.
// her we can add all the component we want to be able to navigate to with the 
// slide menu to the left of the app
const AppNavigator = createDrawerNavigator(
  {
    Home: HomeNavigator,
    Posts: PostsNavigator, //here we can add screens we want to navigate from the menu toggle
    Profile: ProfileNavigator,
    Cases: CaseNavigator,
    Map: MapNavigator,
    Payments: PaymentsNavigator,
    Facilities: FacilitiesNavigator,
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary
    },
    contentComponent: props => {
      const dispatch = useDispatch();
      return (       // her we create the logout button inside the menu 
        <View style={{ flex: 1, paddingTop: 20 }}>
          <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
            <DrawerItems {...props} />
            <Button
              title="Logout"
              color={Colors.primary}
              onPress={() => {
                dispatch(authActions.logout());
                // props.navigation.navigate('Auth');
              }}
            />
          </SafeAreaView>
        </View>
      );
    }
  }
);


// creating the stack navigator for the authentication.
// this navigator lets us go from the login/signup page to the app
const AuthNavigator = createStackNavigator(
  {
    Auth: AuthScreen
  },
  {
    defaultNavigationOptions: defaultNavOptions
  }
);

// the MainNavigator create the stack navigation for all the navigation component
// we created in this page.
const MainNavigator = createSwitchNavigator({
  Startup: StartupScreen,
  Auth: AuthNavigator,
  App: AppNavigator,
  Tab: TabsDrawer
});

export default createAppContainer(MainNavigator);
