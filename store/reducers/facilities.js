import {
    CREATE_CLASS,
    SET_CLASS
  } from '../actions/facilities';
import Class from '../../models/facilities';


  const initialState = {
    myClasses: []
  };

  export default (state = initialState, action) => {
      switch (action.type) {
          case SET_CLASS:
              return {
                  ...state,
                  myClasses: action.classData.classes
              }

          case CREATE_CLASS:
              const newClass = new Class (
                  action.classData.ownerId,
                  action.classData.date,
                  action.classData.time,
                  action.classData.desc
              );
              console.log(newClass)
              return {
                  myClasses: state.myClasses.concat(newClass)
              };
      }
      return state;
  }