const mongoose = require('mongoose');
const User = require('./users');


const postSchema = new mongoose.Schema({

    // The user who created the post
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
   
    content: {
      type: String,
      required: true
    },
    
    createdAt: {
      type: Date,
      default: Date.now
    },
  
    updatedAt: {
      type: Date,
      default: Date.now
    },
   
    likes: {
      type: Number,
      default: 0
    },
    
    dislikes: {
      type: Number,
      default: 0
    },
   
    likedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    
    dislikedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }],
    
    shares: {
      type: Number,
      default: 0
    },
  
    sharedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  });
  
  const Post = mongoose.model('Post', postSchema);
  
  module.exports = Post;
  

