import {
  CREATE_USER,
  UPDATE_USER_PROF,
  SET_USER,
  GET_USER_DATA,
  GET_USER,
  UPDATE_USER,
  DELETE_USER
} from '../actions/users';
import User from './../../models/users';

const initialState = {
  usersArr: [],
  usid: [],
  userProfPic: ""
};

export default (state = initialState, action) => {
  switch(action.type) {
      case SET_USER:
          return {
              ...state,
              usersArr: action.users
          };

      case GET_USER_DATA:
        return {
          usid: state.usersArr.filter(index => index.ownerId === action.userId)
        };

        case UPDATE_USER:
          const userIndex = state.usersArr.findIndex(
              user => user.userId === action.uid
            );
            const updatedUser = new User(
              state.usersArr[userIndex].userName,
              state.usersArr[userIndex].email,
              state.usersArr[userIndex].role,
              "true",
              usersArr[userIndex].userId
            )
            state.usersArr[userIndex] = updatedUser;
          return {
              ...state,
              users: state.usersArr
          }

      case UPDATE_USER_PROF:
          const userIndex2 = state.usersArr.findIndex(
              user => user.userId === action.uid
            );
            const updatedUser2 = new User(
              state.usersArr[userIndex2].userName,
              state.usersArr[userIndex2].email,
              state.usersArr[userIndex2].profession,
              "true",
              state.usersArr[userIndex2].userId
            )
            state.usersArr[userIndex2] = updatedUser2;
          return {
              ...state,
              users: state.usersArr
          };

          case GET_USER:
            return {
                ...state,
                users
            }

      case CREATE_USER:
          const newUser = new User(
              action.userData.userName,
              action.userData.email,
              action.userData.profession,
              action.userData.admin,
              action.userData.userId
          );
          return {
              ...state,
              users: state.usersArr.concat(newUser)
          };
          
      case DELETE_USER:
            return {
                ...state
            }
  };
  return state;
};