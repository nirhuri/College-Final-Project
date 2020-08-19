import {
    DELETE_CASE,
    CREATE_CASE,
    UPDATE_CASE,
    SET_STATUS,
    SET_CASE
  } from '../actions/cases';
  import Case from '../../models/case';


  const initialState = {
    myCases: []
  };

  export default (state = initialState, action) => {
      switch (action.type) {
          case SET_CASE:
              return {
                  ...state,
                  myCases: action.caseData.cases
              }

          case CREATE_CASE:
              const newCase = new Case (
                  action.caseData.id,
                  action.caseData.ownerId,
                  action.caseData.title,
                  action.caseData.subject,
                  action.caseData.description,
                  action.caseData.imageUrl,
                  action.caseData.imageLink,
                  action.caseData.status
              );
              return {
                  myCases: state.myCases.concat(newCase)
              };
      }
      return state;
  }