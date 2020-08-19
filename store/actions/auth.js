import { AsyncStorage } from 'react-native';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;

export const authenticate = (userId, token, email, expiryTime) => {
  return dispatch => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, userId: userId, token: token, email: email});
  };
};


export const signup = (email, password) => {    // sign up new user and send the data to firebase
  return async dispatch => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDj0saheYuRh6f3W-tqKh0pQacEn_hveu0',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {       // if there a sign up error
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = 'Something went wrong!';  // if the error is not username or password problems
      if (errorId === 'EMAIL_EXISTS') {     // trying to sign up with already existing email adress
        message = 'This email exists already!';
      }
      throw new Error(message);
    }

    const resData = await response.json();
    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        resData.email,
        parseInt(resData.expiresIn) * 1000
      )
    );

    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(resData.idToken, resData.localId, resData.email, expirationDate);
  };
};

export const deleteAccount = userId => {
  return async dispatch => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:delete?key=AIzaSyDj0saheYuRh6f3W-tqKh0pQacEn_hveu0',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idToken: userId
        })
      }
    )
  }  
}

export const login = (email, password) => {       // sign in autentication with firebase user manager
  return async dispatch => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDj0saheYuRh6f3W-tqKh0pQacEn_hveu0',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {       // if the user sign in is not valid
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = 'Something went wrong!';    // put the general error message
      if (errorId === 'EMAIL_NOT_FOUND') {     // if there is no user registered with this email
        message = 'This email could not be found!';
      } else if (errorId === 'INVALID_PASSWORD') {    // if the password is incorrect
        message = 'This password is not valid!';
      }
      throw new Error(message);
    }

    const resData = await response.json();

    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        resData.email,
        parseInt(resData.expiresIn) * 1000
      )
    );

    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(resData.idToken, resData.localId, resData.email, expirationDate);
  };
};

export const logout = () => {   // user wish to logout from the correcnt logged in username
  clearLogoutTimer();
  AsyncStorage.removeItem('userData');
  return { type: LOGOUT };
};

const clearLogoutTimer = () => {    // timer for being logged in to app
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = expirationTime => {    // set the timer for being logged in to app
  return dispatch => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

const saveDataToStorage = (token, userId, email, expirationDate) => {
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      token: token,
      userId: userId,
      userEmail: email,
      expiryDate: expirationDate.toISOString()
    })
  );
};
