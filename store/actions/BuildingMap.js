import Apartment from '../../models/apartment';
import { useState } from 'react';

export const DELETE_TENANT = 'DELETE_TENANT';
export const CREATE_TENANT = 'CREATE_TENANT';
export const UPDATE_TENANT = 'UPDATE_TENANT';
export const SET_TENANT = 'SET_TENANT';

export const resetData = () => {
return async (dispatch, getState) => {
  dispatch({
    type: SET_TENANT,
    tenants: [],
    myBuilding: []
  })
  }
}

export const fetchTenants = () => {
  return async (dispatch, getState) => {
    
    const userEmail = getState().auth.userEmail;
    const userId = getState().auth.userId;

    try {
      const response = await fetch(   // get all the tenants from firebase
        'https://finalproject-6f995.firebaseio.com/tenants.json'
      );

      if (!response.ok) {     // cant get the tenants from firebase
        throw new Error('Something went wrong!');
      }
 
      const buildingTenants = [];     // create the loaded posts
      const resData = await response.json();
      
      for (const key in resData) {
        buildingTenants.push(     // push the loaded posts from firebase to loadedpost array
          new Apartment(
            key,
            resData[key].name,
            resData[key].street,
            resData[key].apartmentNum,
            resData[key].tenantEmail,
            resData[key].ownerId
          )
        );
      }

      console.log(userEmail)
      let admin;
      for(const key in buildingTenants) {
        if (buildingTenants[key].tenantEmail === userEmail || buildingTenants[key].name === userId) {
          admin = buildingTenants[key].name;
          break;
        }
      }
          dispatch({      // this dispatch sends the array to reducers->posts to set the loaded post
            type: SET_TENANT,
            tenants: buildingTenants,
            myBuilding: buildingTenants.filter(tenan => tenan.name === admin)
          });
    } catch (err) {
      throw err;
    }
  };
};


export const deleteTenant = tenantId => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    
    const response = await fetch(
      `https://finalproject-6f995.firebaseio.com/tenants/${tenantId}.json?auth=${token}`,
      {
        method: 'DELETE'      // delete the wanted post from the database in firebase
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }
    dispatch({ type: DELETE_TENANT, pid: tenantId });
  };
};


export const createTenant = (name, apartmentNum, street, tenantEmail) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const response = await fetch(
          `https://finalproject-6f995.firebaseio.com/tenants.json?auth=${token}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name,
              apartmentNum,
              street,
              tenantEmail,
              ownerId: userId
            })
          }
        );
    
        const resData = await response.json();
    
        dispatch({        // the reducers sets this area with new tenant values
          type: CREATE_TENANT,
          tenantData: {
            id: resData.name,
            userName: name,
            street,
            tenantEmail,
            apartmentNum,
            userId
          }
        });
      };
};