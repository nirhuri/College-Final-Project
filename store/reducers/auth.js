import { AUTHENTICATE, LOGOUT } from '../actions/auth';

const initialState = {
  token: null,  // this token if for the user signed in options, when null the app will logout the user automaticly
  userId: null,
  userEmail: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        token: action.token,
        userId: action.userId,
        userEmail: action.email
      };
    case LOGOUT:
      return initialState;
    // case SIGNUP:
    //   return {
    //     token: action.token,
    //     userId: action.userId
    //   };
    default:
      return state;
  }
};
