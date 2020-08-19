class Post {
  constructor(id, title, imageUrl, description) {
    this.id = id;
    this.imageUrl = imageUrl;
    this.title = title;
    this.description = description;
  }
}

export default Post;


// this class holds the Post data. 
// every time we create new post in the app we create new Post class with the data
// specified in the code:
// id - post id for each post
// imageUrl - can add pics to posts
// title - the post title
// description - the post text