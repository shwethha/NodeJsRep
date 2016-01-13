let mongoose = require('mongoose')

let CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // upvotes: {
  //   type: Number,
  //   default: 0
  // },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  created: {
    type: Date,
    default: Date.now
  }
})

// CommentSchema.methods.upvote = async function() {
//   this.upvotes += 1
//   return this.save()
// }

module.exports = mongoose.model('Comment', CommentSchema)
