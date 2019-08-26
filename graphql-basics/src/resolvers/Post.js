const Post = {
  author (parent, args, { db }, info) {
    return db.default.users.find(user => user.id === parent.author)
  },
  comments (parent, args, { db }, info) {
    return db.default.comments.filter(comment => comment.post === parent.id)
  }
}

module.exports = Post
