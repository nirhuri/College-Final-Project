import React, { useState, useEffect ,useCallback, getState } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  Platform,
  ActivityIndicator,
  StyleSheet
} from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import * as tenantsActions from '../../store/actions/BuildingMap';
import Colors from '../../constants/Colors';
import PostItem from '../../components/Home/HomaCard';

var mast = false;

const BuildingMap = props => {
  const [isLoading, setIsLoading] = useState(false); // is loading state
  const [isRefreshing, setIsRefreshing] = useState(false);    // is refreshing state
  const [error, setError] = useState();   // error state
  const [master, setMaster] = useState(false);
  const tenants = useSelector(state => state.tenant.myBuilding);
  const userId = useSelector(state => state.auth.userId);
  const dispatch = useDispatch();
  
  const loadTenants = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);

    try {
      await dispatch(tenantsActions.resetData());
      await dispatch(tenantsActions.fetchTenants());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, dispatch, setIsLoading, setError]);

  if(!master) {
    for(const key in tenants) {
      if(tenants[key].name === userId){
        setMaster(true);
        mast = true;
      }
    }
  }

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      'willFocus',
      loadTenants
    );

    return () => {
      willFocusSub.remove();
    };
  }, [loadTenants]);

  useEffect(() => {
    setIsLoading(true);
    loadTenants().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadTenants]);

  const selectItemHandler = (id, title, street, userName, apartment) => {
    props.navigation.navigate('TenantDetail', {
      tenantId: id,
      tenantTitle: title,
      tenantName: userName,
      tenantStreet: street,
      tenantApartment: apartment
    });
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button
          title="Try again"
          onPress={loadTenants}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && tenants.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No apartments found.</Text>
      </View>
    );
  }

  if(master) {
    return (
      <FlatList
        onRefresh={loadTenants}
        refreshing={isRefreshing}
        data={tenants}
        keyExtractor={item => item.id}
        renderItem={itemData => (
          <PostItem
            title={itemData.item.apartmentNum}
            onSelect={() => {
              selectItemHandler(itemData.item.id, itemData.item.title, itemData.item.street, itemData.item.userName, itemData.item.apartmentNum);
            }}
          >
            <Button
              color={Colors.primary}
              title="Select"
              onPress={() => {
                selectItemHandler(itemData.item.id, itemData.item.title, itemData.item.street, itemData.item.userName, itemData.item.apartmentNum);
              }}
            />
      
          <Button 
            color={Colors.primary}
            title="Delete"
            onPress={() => {
              dispatch(tenantsActions.deleteTenant(itemData.item.id));
              dispatch(tenantsActions.resetData());
              dispatch(tenantsActions.fetchTenants());
              //dispatch(tenantsActions.fetchTenants());
            }}/>
          </PostItem>
        )}
      />
    );
  } else {
    return (
      <FlatList
        onRefresh={loadTenants}
        refreshing={isRefreshing}
        data={tenants}
        keyExtractor={item => item.id}
        renderItem={itemData => (
          <PostItem
            title={itemData.item.apartmentNum}
            onSelect={() => {
              selectItemHandler(itemData.item.id, itemData.item.title, itemData.item.street, itemData.item.userName, itemData.item.apartmentNum);
            }}
          >
            <Button
              color={Colors.primary}
              title="Select"
              onPress={() => {
                selectItemHandler(itemData.item.id, itemData.item.title, itemData.item.street, itemData.item.userName, itemData.item.apartmentNum);
              }}
            />
          </PostItem>
        )}
      />
    );
  }
};

// this is the navigation options for building map pageat the top of the page
BuildingMap.navigationOptions = navData => {
    return {
      headerTitle: 'Building Map',
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
      ),
      headerRight: (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="plus"
            iconName={Platform.OS === 'android' ? 'md-add' : 'ios-add'}
            onPress={() => {
              navData.navigation.navigate('AddApartment');
            }}
          />
        </HeaderButtons>
      )
    }
  };


  // styles section
const styles = StyleSheet.create({
  card: {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: 'white'
  },
  centered: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }
});

export default BuildingMap;