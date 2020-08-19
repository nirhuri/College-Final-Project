export const CREATE_USER = 'CREATE_USER';
export const EDIT_USER = 'EDIT_USER';
export const SET_USER = 'SET_USER';
export const UPDATE_USER_PROF = 'UPDATE_USER_PROF';
export const GET_USER_DATA = 'GET_USER_ID';
export const SET_PIC = 'SET_PIC';
export const GET_PIC = 'GET_PIC';
export const UPDATE_USER = 'UPDATE_USER';
export const DELETE_USER = 'DELETE_USER';
import User from "./../../models/users";


export const setAsAdmin = () => {
  return async (dispatch, getState) => {

    try {
      const response = await fetch(   // get all the posts from firebase
        'https://finalproject-6f995.firebaseio.com/users.json'
      );

      if (!response.ok) {     // cant get the posts from firebase
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();
      
      const usersList = [];     // create the loaded posts

      for (const key in resData) {
        usersList.push(     // push the loaded posts from firebase to loadedpost array
          new User(
            resData[key].userName,
            resData[key].email,
            resData[key].role,
            resData[key].admin,
            resData[key].name,
          )
        );
      }

      let id = "";
      for (const i in resData) {
        if(resData[i].email === getState().auth.email) {
        }
      }

      dispatch({      // this dispatch sends the array to reducers->posts to set the loaded post
        type: SET_USER,
        users: usersList,
      });
    } catch (err) {
      throw err;
    }
  };
};


export const getUserData = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;

    dispatch({
      type: GET_USER_DATA,
      userId
    })
  }
}

export const updateUserProf = (id, profession) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(     // recieve the post we want to update
      `https://finalproject-6f995.firebaseio.com/users/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          profession
        })
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    dispatch({    // sends to reducer->posts the data for post editing
      type: UPDATE_USER_PROF,
      uid: id,
      postData: {
        profession: profession
      }
    });
  };
};


export const fetchUsers = () => {
  return async (dispatch, getState) => {
    
    try {
      const response = await fetch(   // get all the posts from firebase
        'https://finalproject-6f995.firebaseio.com/users.json'
      );

      if (!response.ok) {     // cant get the posts from firebase
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();
      const loadedUsers = [];     // create the loaded posts

      for (const key in resData) {
        loadedUsers.push(     // push the loaded posts from firebase to loadedpost array
          new User(
            resData[key].userName,
            resData[key].email,
            resData[key].profession,
            resData[key].admin,
            resData[key].ownerId,
          )
        );
      }

      dispatch({      // this dispatch sends the array to reducers->posts to set the loaded post
        type: SET_USER,
        users: loadedUsers
      });
    } catch (err) {
      throw err;
    }
  };
};


export const createUser = (userName, email, profession = "Plumber", admin1) => {
    return async (dispatch, getState) => {
      // create new post in the database and update the redux state
      const token = getState().auth.token;
      const userId = getState().auth.userId;

      let admin = "";
      if(admin1 === "Admin"){
        admin = "true";
      } else if (admin1 === "Tenant"){
        admin = "false";
      }

      const response = await fetch(
        `https://finalproject-6f995.firebaseio.com/users.json?auth=${token}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userName,
            email,
            profession,
            admin,
            ownerId: userId,
          })
        }
      );
  
      const resData = await response.json();
  
      dispatch({        // the reducers sets this area with new post values
        type: CREATE_USER,
        userData: {
          userName: resData.userName,
          email: resData.email,
          profession: resData.profession,
          admin: resData.admin,
          userId: userId,
        }
      });
    };
  };

  export const deleteUser = userId => {   // delete post from the database and update the state
    return async (dispatch, getState) => {
  
      const token = getState().auth.token;
      const response = await fetch(
        `https://finalproject-6f995.firebaseio.com/users/${userId}.json?auth=${token}`,
        {
          method: 'DELETE'      // delete the wanted post from the database in firebase
        }
      );
  
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      dispatch({ type: DELETE_USER, uid: userId }); // sends to reducers->posts the delete action to delete from state
    };
  };