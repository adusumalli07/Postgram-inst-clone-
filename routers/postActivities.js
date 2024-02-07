const express = require('express');
const { Post } = require('../models/postgram');
const postComments  = require('../validations/postActivities');
const verifyToken = require('../middlewares/verifytoken');
const User = require('../models/users');



const router = express.Router();


// Likes and LikedBy
router.post('/like/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findOne({ _id: userId });
    
    if (!user) {
      return res.status(404).json({ StatusCode: "404", message: 'User not found' });
  }
  const postId = req.params.id;
  const post = await Post.findOne({ _id: postId });
  
    if (post.likedBy.includes(userId)) {
        return res.status(400).json({ StatusCode: "400", message: "User already liked the post" });
    } else {
        const update = {
            $pull: { dislikedBy: userId },
            $push: { likedBy: userId },
            $inc: { likes: 1 }
        };

        if (post.dislikedBy.includes(userId)) {
            update.$inc.dislikes = -1;
        }

        const updatedPost = await Post.findByIdAndUpdate(postId, update, { new: true }).populate('user', 'username');
        return res.status(200).json({ StatusCode: "200", message: "LikesCount and LikedBy", payload: updatedPost });
    }
  } catch (error) {
      return res.status(500).json({ StatusCode: "500", message: error.message });
  }
});

router.post('/dislike/:id', verifyToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findOne({ _id: postId });
    
    if (!post) {
      return res.status(404).json({ StatusCode: "404", message: "Post not found" });
}
  const userId = req.userId;
  const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ StatusCode: "404", message: 'User not found' });
    }

    if (post.dislikedBy.includes(userId)) {
        return res.status(400).json({ StatusCode: "400", message: "User already disliked the post" });
    } else {
        const update = {
            $pull: { likedBy: userId },
            $push: { dislikedBy: userId },
            $inc: { dislikes: 1 }
        };

        if (post.likedBy.includes(userId)) {
            update.$inc.likes = -1;
        }

        const updatedPost = await Post.findByIdAndUpdate(postId, update, { new: true }).populate('user', 'username');
        return res.status(200).json({ StatusCode: "200", message: "DislikesCount and DislikedBy", payload: updatedPost });
    }
  } catch (error) {
      return res.status(500).json({ StatusCode: "500", message: error.message });
  }
});

  // Comments
router.post("/comments/:id", verifyToken, async (req, res) => {
  try {
    const { error } = await postComments.validate(req.body);
    if (error) {
        return res.status(400).json({ StatusCode: "400", error: error.details[0].message });
      }
  const { comment }= req.body; 
  const userId = req.userId;
  await User.findOne({ _id: userId });

  const postId = req.params.id;
    
  const post = await Post.findByIdAndUpdate({_id:postId}, {
      $push: { commentBy: userId, comments: comment },
      $inc: { commentsCount: 1 },
  }, { new: true });

      res.status(201).json({ StatusCode: "201", payload: post });
  } catch (error) {
      res.status(500).json({ StatusCode:500, message: error.message });
  }
});

  
  // Shares & SharedBy
router.post("/share/:id", verifyToken, async (req, res) => {
try {
  const postId = req.params.id;
const post = await Post.findOne({ _id: postId });

if (!post) {
  return res.status(404).json({ StatusCode: "404", message: "Post not found" });
}
const userId = req.userId;
const user = await User.findOne({ _id: userId });

  if (!user) {
    return res.status(404).json({ StatusCode: "404", message: 'User not found' });
  }
  const { target } = req.body;

if (post.sharedTo.includes(target) && post.sharedBy.includes(userId)) {
  return res.status(400).json({ StatusCode: "400", message: `User already shared the post` });
} else {
 
const post = await Post.findByIdAndUpdate({_id:postId}, {
    $push: { sharedBy: userId, sharedTo: target},
    $inc: { shares: 1 },
}, { new: true });

const updatedPost = await post.save();

res.status(200).json({ StatusCode: "200", payload: updatedPost });
}
} catch (error) {
  res.status(500).json({ StatusCode: "500", message: error.message });
}
});
module.exports=router;



  