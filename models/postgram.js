const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
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
  commentsCount: {
    type: Number,
    default: 0
  },
  comments: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comment: String,
  },
  commentBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
}],
  shares: {
    type: Number,
    default: 0
  },
  sharedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  sharedTo: [{  
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  }]
});

const Post = mongoose.model('Post', postSchema);

module.exports = { Post };
