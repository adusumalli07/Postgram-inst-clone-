const express = require('express');
const  { Post } = require('../models/postgram');
const User = require('../models/users');
const verifyToken = require('../middlewares/verifytoken');
const postCreateType = require('../validations/postSchema');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();


//My Posts
router.get('/myposts',verifyToken, async (req, res) => {
try {
  const post = await Post.find({user:req.userId});
  res.status(200).json({statusCode:"200",payload:post});
} catch (error) {
  res.status(500).json({ StatusCode: "500",message: err.message });
}
});

// Getting a Post
router.get('/all',verifyToken, async (req, res) => {
  try {
    const page = req.query.page * 1 ||1;
    const limit = req.query.limit * 1 || 1;
  
    const startIndex = (page-1) * limit;
    const posts = await Post.find().skip(startIndex).limit(limit);

  // Count total number of Posts
  const totalPosts = await Post.countDocuments();

  // Calculate total pages
  const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({ 
      StatusCode: "200",
      message: "All Users", 
      currentPage: page,
      totalPages: totalPages,
      totalUsers: totalPosts,
      payload: posts 
  });
  } catch (err) {
  res.status(500).json({ StatusCode: "500",message: err.message });
  }
});


// Post/:id
router.get('/:id', verifyToken, async (req, res) => { 
try {
const post = await Post.findOne({_id:req.params.id});
res.status(200).json({ StatusCode: "200", message : "Post fetched successfully ",payload:post });

} catch (err) {
res.status(500).json({ statusCode:"500",message: err.message });
}
});

// Creating a Post
router.post('/create',verifyToken, async (req, res) => {
  try {

  const { error } = await postCreateType.validate(req.body);

  
  if (error) {
    return res.status(400).json({ StatusCode: "400",error: error.details[0].message });
  }
  
  // Check if the user exists
  const user = await User.findById(req.userId);

  if (!user) {
    return res.status(400).json({ StatusCode: "400",error: 'User not found' });
  }

  // Create a new post
  const newPost = new Post({
    user:req.userId,
    username:user.username,
    content:req.body.content
  });

  // Save the post to the database
  await newPost.save();

  res.status(200).json({ StatusCode: "200", message: "Post Created Successfully",payload:{ newPost, username: user.username }});
  } catch (error) {
  res.status(500).json({ StatusCode: "500",error: 'Internal Server Error' });
  }
});

// Update a Post
router.patch('/update/:id', verifyToken, async (req, res) => {


  const { error } = await postCreateType.validate(req.body);

  
  if (error) {
    return res.status(400).json({ StatusCode: "400",error: error.details[0].message });
  }
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
router.delete('/delete/:id', verifyToken, async (req, res) => {
  try {
    const postId = req.params.id;

    const result = await Post.deleteOne({ _id: postId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ StatusCode: "404", message: 'Post not found' });
    }

    res.status(200).json({ StatusCode: "200", payload: result, message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ StatusCode: "500", message: err.message });
  }
});


//Delete all posts
router.delete('/deleteall',[verifyToken,isAdmin], async (req, res) => { 
try {
  
  await Post.deleteMany({})
  res.status(200).json({ StatusCode: "200", message: 'Posts deleted successfully' });
} catch (err) {
  res.status(500).json({ StatusCode: "500",message: err.message });
}
});


module.exports=router;