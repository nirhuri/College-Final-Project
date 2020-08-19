import Post from '../../models/post';

export const DELETE_POST = 'DELETE_POST';
export const CREATE_POST = 'CREATE_POST';
export const UPDATE_POST = 'UPDATE_POST';
export const SET_POSTS = 'SET_POSTS';

export const fetchPosts = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    
    try {
      const response = await fetch(   // get all the posts from firebase
        'https://finalproject-6f995.firebaseio.com/posts.json'
      );

      if (!response.ok) {     // cant get the posts from firebase
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();
      const loadedPosts = [];     // create the loaded posts

      for (const key in resData) {
        loadedPosts.push(     // push the loaded posts from firebase to loadedpost array
          new Post(
            key,
            resData[key].title,
            resData[key].imageUrl,
            resData[key].description,
          )
        );
      }

      dispatch({      // this dispatch sends the array to reducers->posts to set the loaded post
        type: SET_POSTS,
        posts: loadedPosts,
        userPosts: loadedPosts.filter(prod => prod.ownerId === userId)
      });
    } catch (err) {
      throw err;
    }
  };
};

export const deletePost = postId => {   // delete post from the database and update the state
  return async (dispatch, getState) => {

    const token = getState().auth.token;
    const response = await fetch(
      `https://finalproject-6f995.firebaseio.com/posts/${postId}.json?auth=${token}`,
      {
        method: 'DELETE'      // delete the wanted post from the database in firebase
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }
    dispatch({ type: DELETE_POST, pid: postId }); // sends to reducers->posts the delete action to delete from state
  };
};

export const createPost = (title, description, imageUrl) => {
  return async (dispatch, getState) => {
    // create new post in the database and update the redux state
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await fetch(
      `https://finalproject-6f995.firebaseio.com/posts.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          ownerId: userId
        })
      }
    );

    const resData = await response.json();

    dispatch({        // the reducers sets this area with new post values
      type: CREATE_POST,
      postData: {
        id: resData.name,
        title,
        imageUrl,
        description
      }
    });
  }; 
};

export const updatePost = (id, title, description, imageUrl) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(     // recieve the post we want to update
      `https://finalproject-6f995.firebaseio.com/posts/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl
        })
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    dispatch({    // sends to reducer->posts the data for post editing
      type: UPDATE_POST,
      pid: id,
      postData: {
        title,
        description,
        imageUrl
      }
    });
  };
};
