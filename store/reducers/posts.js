
import {
  DELETE_POST,
  CREATE_POST,
  UPDATE_POST,
  SET_POSTS
} from '../actions/posts';
import Post from '../../models/post';

const initialState = {
  availablePosts: [],
  userPosts: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_POSTS:
      return {
        availablePosts: action.posts,
        userPosts: action.userPosts
      };
    case CREATE_POST:
      const newPost = new Post(   // create new post with the Posts component
        action.postData.id,
        action.postData.title,
        action.postData.imageUrl,
        action.postData.description,
      );
      return {
        ...state,     // return the updated posts after the redux changes
        availablePosts: state.availablePosts.concat(newPost),
        userPosts: state.userPosts.concat(newPost)
      };
    case UPDATE_POST:   // the action sends here the request to update a post
      const postIndex = state.userPosts.findIndex(
        post => post.id === action.pid
      );
      const updatedPost = new Post(
        action.pid,     // create new one and replace it with the old post
        action.postData.title,
        action.postData.imageUrl,
        action.postData.description,
      );
      const updatedUserPosts = [...state.userPosts];
      updatedUserPosts[postIndex] = updatedPost; // replace the old post with the new edited one
      const availablePostIndex = state.availablePosts.findIndex(
        post => post.id === action.pid
      );
      const updatedAvailablePosts = [...state.availablePosts];
      updatedAvailablePosts[availablePostIndex] = updatedPost; // update the posts list
      return {
        ...state,
        availablePosts: updatedAvailablePosts,    // return the updated post after editing
        userPosts: updatedUserPosts
      };
    case DELETE_POST:
      return {  // delete the post after we delete him from data base
        ...state,
        userPosts: state.userPosts.filter(
          post => post.id !== action.pid
        ),
        availablePosts: state.availablePosts.filter(
          post => post.id !== action.pid
        )
      };
  }
  return state;
};
