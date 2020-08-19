export const CREATE_PROFILE = 'CREATE_PROFILE';
export const UPDATE_ABOUT = 'UPDATE_ABOUT';
export const UPDATE_TITLE = 'UPDATE_TITLE';
export const SET_PROFILE = 'SET_PROFILE';
export const DELETE_PROFILE = 'DELETE_PROFILE';

import * as firebase from 'firebase';
import Profile from '../../models/profile';


export const updateAbout = (About, id) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;

        firebase.database().ref('/profiles/' + id).update({
          about: About
        });

        dispatch({
            type: UPDATE_ABOUT,
            about: About,
            uid: userId
        })
    }
}

export const updateTitle = (Title, id) => {
    return async (dispatch, getState) => {
      const userId = getState().auth.userId;

      firebase.database().ref('/profiles/' + id).update({
        title: Title
      });

      dispatch({
          type: UPDATE_TITLE,
          title: Title,
          uid: userId
      })
    }
}

export const createProfile = (userName) => {
    return async (dispatch, getState) => {
      // create new profile in the database and update the redux state
      const token = getState().auth.token;
      const userId = getState().auth.userId;

      const response = await fetch(
        `https://finalproject-6f995.firebaseio.com/profiles.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ownerId: userId,
            userName: userName,
            pic: 'null',
            title: 'Edit Your Title',
            about: 'Tell us about yourself...' 
          })
        }
      );
  
      const resData = await response.json();
  
      dispatch({        // the reducers sets this area with new post values
        type: CREATE_PROFILE,
        profileData: {
          userId: userId,
          userName: resData.userName,
          pic: resData.pic,
          title: resData.title,
          about: resData.about
        }
      });
    };
  };

  export const fetchProfiles = () => {
    return async (dispatch, getState) => {
      
      const userId = getState().auth.userId;
      try {
        const response = await fetch(   // get all the posts from firebase
          'https://finalproject-6f995.firebaseio.com/profiles.json'
        );
  
        if (!response.ok) {     // cant get the posts from firebase
          throw new Error('Something went wrong!');
        }
  
        const resData = await response.json();
        const loadedProfiles = [];     // create the loaded posts
  
        for (const key in resData) {
          loadedProfiles.push(     // push the loaded posts from firebase to loadedpost array
            new Profile(
              key,
              resData[key].userName,
              resData[key].ownerId,
              resData[key].pic,
              resData[key].title,
              resData[key].about,
            )
          );
        }
  
        dispatch({      // this dispatch sends the array to reducers->posts to set the loaded post
          type: SET_PROFILE,
          profiles: loadedProfiles,
          userProfile: loadedProfiles.filter(prof => prof.userId === userId),
        });
      } catch (err) {
        throw err;
      }
    };
  };

  export const deleteProfile = userId => {   // delete post from the database and update the state
    return async (dispatch, getState) => {
  
      const token = getState().auth.token;
      const response = await fetch(
        `https://finalproject-6f995.firebaseio.com/profiles/${userId}.json?auth=${token}`,
        {
          method: 'DELETE'      // delete the wanted post from the database in firebase
        }
      );
  
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      dispatch({ type: DELETE_PROFILE, uid: userId }); // sends to reducers->posts the delete action to delete from state
    };
  };