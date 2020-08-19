export const DELETE_CASE = 'DELETE_CASE';
export const CREATE_CASE = 'CREATE_CASE';
export const UPDATE_CASE = 'UPDATE_CASE';
export const SET_STATUS = 'SET_STATUS';
export const SET_CASE = 'SET_CASE';

import Case from '../../models/case';

export const createCase = (title, subject, description, imageUrl, imageLink) => {
    return async (dispatch, getState) => {
      // create new post in the database and update the redux state
      const token = getState().auth.token;
      const userId = getState().auth.userId;
      const response = await fetch(
        `https://finalproject-6f995.firebaseio.com/cases.json?auth=${token}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ownerId: userId,
            title,
            subject,
            description,
            imageUrl,
            imageLink,
            status: "Open"
          })
        }
      );
  
      const resData = await response.json();
  
      dispatch({        // the reducers sets this area with new post values
        type: CREATE_CASE,
        caseData: {
          id: resData.name,
          ownerId: resData.ownerId,
          title: resData.title,
          subject: resData.subject,
          description: resData.description,
          imageUrl: resData.imageUrl,
          imageLink: resData.imageLink,
          status: resData.status
        }
      });
    };
  };


  export const fetchCases = () => {
    return async (dispatch, getState) => {
      const userId = getState().auth.userId;
  
      try {
        const response = await fetch(   // get all the tenants from firebase
          'https://finalproject-6f995.firebaseio.com/cases.json'
        );
  
        if (!response.ok) {     // cant get the tenants from firebase
          throw new Error('Something went wrong!');
        }
   
        const myCases = [];     // create the loaded posts
        const resData = await response.json();

        for (const key in resData) {
          myCases.push(     // push the loaded posts from firebase to loadedpost array
            new Case(
              key,
              resData[key].ownerId,
              resData[key].title,
              resData[key].subject,
              resData[key].description,
              resData[key].imageUrl,
              resData[key].imageLink,
              resData[key].status
            )
          );
        }
            dispatch({      // this dispatch sends the array to reducers->posts to set the loaded post
              type: SET_CASE,
              caseData: {
                cases: myCases.filter(c => c.ownerId === userId)
              }
            });
          }
        catch (err) {
          throw err;
      }
    };
  };