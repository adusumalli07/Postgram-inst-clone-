const express = require('express');
const Post = require('../models/postgram');
const User = require('../models/users');

const verifyToken = require('../middlewares/verifytoken');

const router = express.Router();

// Getting a Post
router.get('/all',verifyToken, async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json({statusCode:"200",message:"fetch successfull",payload:posts});
  } catch (err) {
  res.status(500).json({ StatusCode: "500",message: err.message });
  }
});


// Post/:id
router.get('/:id', verifyToken, async (req, res) => { 
try {
const post = await Post.find({_id:req.params.id});
res.status(200).json({ StatusCode: "200", message : "Post fetched successfully ",payload:post });

} catch (err) {
res.status(500).json({ statusCode:"500",message: err.message });
}
});

// Creating a Post
router.post('/',verifyToken, async (req, res) => {
  try {

  // Check if the user exists
  const user = await User.findById(req.userId);

  if (!user) {
    return res.status(400).json({ StatusCode: "400",error: 'User not found' });
  }

  // Create a new post
  const newPost = new Post({
    user:req.userId,
    content:req.body.content

    });

  // Save the post to the database
  await newPost.save();

  res.status(200).json({ StatusCode: "200", message: "Post Created Successfully",payload:newPost});
  } catch (error) {
  console.error(error);
  res.status(500).json({ StatusCode: "500",error: 'Internal Server Error' });
  }
});

// Update a Post
router.patch('/update/:id', verifyToken, async (req, res) => {

const post = await Post.findById(req.params.id);

if(!post){
  return res.status(404).json({StatusCode: "404",message:`post:${req.params.id} not found`})
}

if(post.user!=req.userId){
  return res.status(401).json({StatusCode: "401",message:"Unauthorized access to the post"})
}

try {
    const updateFields={};
  if (req.body.content) {
    updateFields.content = req.body.content;
  }  
updateFields.updatedAt = new Date();

const response =  await Post.updateOne({_id:req.params.id},{
    ...updateFields
})
  
  res.status(200).json({ StatusCode: "200", message: " Post updated successfully ",payload:{...post,response} });
} catch (err) {
  res.status(400).json({ StatusCode: "400", message: err.message });
}
});


// Delete a Post
router.delete('/delete/:id',verifyToken, async (req, res) => {
try {
  const post = await Post.findById(req.params.id);
  
  await res.post.deleteOne();
  updateFields.updatedAt = new Date();
    res.status(200).json({ StatusCode: "200", message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ StatusCode: "500", message: err.message });
  }
});

//Delete all posts
router.delete('/delete/all',verifyToken, async (req, res) => { 
try {
  const post = await Post.findById(req.params._id);
  await Post.deleteMany({})
  res.status(200).json({ StatusCode: "200", message: 'Posts deleted successfully' });
} catch (err) {
  res.status(500).json({ StatusCode: "500",message: err.message });
}
});

// Likes and LikedBy
router.post('/like', async (req, res) => {
  try {
    // get the post id and user id from the request body
    const { postId, userId } = req.body;
    // find the post by id and update its likes, likedBy fields
    const post = await Post.findByIdAndUpdate(postId, {
      $inc: { likes: 1 }, // increment the likes by 1
      $push: { likedBy: userId }, // add the user id to the likedBy array
      $pull: { dislikedBy: userId } // remove the user id from the dislikedBy array
    }, { new: true }); // return the updated post
    // send the updated post as the response
    res.status(200).json({ StatusCode: "200", message: "LikesCount and LikedBy ",post });
  } catch (error) {
    // handle any errors
    res.status(500).json({ StatusCode : "500",message: error.message });
  }
});

// DisLikes & DisLikedBy
router.post('/like', async (req, res) => {
  try {
    // get the post id and user id from the request body
    const { postId, userId } = req.body;
    // find the post by id and update its likes, likedBy fields
    const post = await Post.findByIdAndUpdate(postId, {
      $inc: { dislikes: 1 }, // increment the dislikes by 1
      $push: { dislikedBy: userId }, // add the user id to the dislikedBy array
      $pull: { likedBy: userId } // remove the user id from the likedBy array
    }, { new: true }); // return the updated post
    
    res.status(200).json({ StatusCode: "200", message: "LikesCount and LikedBy ",post });
  } catch (error) {

    res.status(500).json({ StatusCode: "500",message: error.message });
  }
});


// Comments
router.post("/comments", async (req, res) => {
  try {
    // get the post id, user id, and comment content from the request body
    const { postId, userId, content } = req.body;
    // create a new comment object with the given data
    const comment = new Comment({
      user: userId,
      post: postId,
      content: content,
    });
    // save the comment to the database
    await comment.save();
    // find the post by id and update its comments field
    const post = await Post.findByIdAndUpdate(postId, {
      $push: { comments: comment._id }, // add the comment id to the comments array
    }, { new: true }); // return the updated post
    // populate the comment with the user and post details
    await comment.populate('user').populate('post').execPopulate();
    // send the comment as the response
    res.status(201).json(comment);
  } catch (error) {
    // handle any errors
    res.status(500).json({ message: error.message });
  }
});

// Shares & SharedBy
router.post("/share", async (req, res) => {
  try {
    // get the post id and user id from the request body
    const { postId, userId } = req.body;
    // find the post by id and update its shares and sharedBy fields
    const post = await Post.findByIdAndUpdate(postId, {
      $inc: { shares: 1 }, // increment the shares by 1
      $push: { sharedBy: userId }, // add the user id to the sharedBy array
    }, { new: true }); // return the updated post
    // send the updated post as the response
    res.status(200).json(post);
  } catch (error) {
    // handle any errors
    res.status(500).json({ message: error.message });
  }
});



module.exports=router;