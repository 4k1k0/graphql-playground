const User = {
  posts (parent, args, { db }, info) {
    return db.default.posts.filter(post => post.author === parent.id)
  },
  comments (parent, args, { db }, info) {
    return db.default.comments.filter(comment => comment.author === parent.id)
  }
}

module.exports = User
