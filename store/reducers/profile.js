import {
    CREATE_PROFILE,
    UPDATE_TITLE,
    UPDATE_ABOUT,
    SET_PROFILE,
    DELETE_PROFILE
} from '../actions/profile';
import Profile from '../../models/profile';

const initialState = {
    profileArr: [],
    userProfile: []
}

export default (state = initialState, action) => {
    switch(action.type) {
        case SET_PROFILE:
            return {
                profileArr: action.profiles,
                userProfile: action.userProfile,
                userKey: action.userProfile.key
              };

        case UPDATE_TITLE:
            const index = state.profileArr.findIndex(
                profile => profile.userId = action.uid
            );
            state.profileArr[index].title = action.title;
            return {
                ...state,
                profileArr: state.profileArr
            };
        
        case UPDATE_ABOUT:
            const index2 = state.profileArr.findIndex(
                profile => profile.userId = action.uid
            );
            state.profileArr[index2].about = action.about;
            return {
                ...state,
                profileArr: state.profileArr
            };

         case CREATE_PROFILE:
            const newProfile = new Profile(
                action.profileData.userId,
                action.profileData.userName,
                action.profileData.pic,
                action.profileData.title,
                action.profileData.about
            );
             return {
                ...state,
                profileArr: state.profileArr.concat(newProfile)
             };
        case DELETE_PROFILE:
             return {
                 ...state
             }
    };
    return state;
}