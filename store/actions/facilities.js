export const CREATE_CLASS = 'CREATE_CLASS';
export const SET_CLASS = 'SET_CLASS';

import Class from '../../models/facilities';

export const fetchClasses = () => {
    return async (dispatch, getState) => {
      const userId = getState().auth.userId;
  
      try {
        const response = await fetch(   // get all the tenants from firebase
          'https://finalproject-6f995.firebaseio.com/classes.json'
        );
  
        if (!response.ok) {     // cant get the tenants from firebase
          throw new Error('Something went wrong!');
        }
   
        const myClasses = [];     // create the loaded posts
        const resData = await response.json();

        for (const key in resData) {
          myClasses.push(     // push the loaded posts from firebase to loadedpost array
            new Class(
              resData[key].ownerId,
              resData[key].date,
              resData[key].time,
              resData[key].desc
            )
          );
        }
            dispatch({      // this dispatch sends the array to reducers->posts to set the loaded post
              type: SET_CLASS,
              classData: {
                classes: myClasses.filter(c => c.ownerId === userId)
              }
            });
          }
        catch (err) {
          throw err;
      }
    };
  };

export const createClass = (classObj) => {
    return async (dispatch, getState) => {
        //console.log(classObj)
      // create new post in the database and update the redux state
      const token = getState().auth.token;
      const userId = getState().auth.userId;
      const response = await fetch(
        `https://finalproject-6f995.firebaseio.com/classes.json?auth=${token}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ownerId: userId,
            date: classObj.date,
            time: classObj.time,
            desc: classObj.desc
          })
        }
      );
  
      const resData = await response.json();
  
      dispatch({        // the reducers sets this area with new post values
        type: CREATE_CLASS,
        classData: {
            ownerId: resData.ownerId,
            date: resData.date,
            time: resData.time,
            desc: resData.desc
        }
      });
    };
  };