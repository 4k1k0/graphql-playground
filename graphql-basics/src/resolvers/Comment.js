const Comment = {
  author (parent, args, { db }, info) {
    return db.default.users.find(user => user.id === parent.author)
  },
  post (parent, args, { db }, info) {
    return db.default.posts.find(post => post.id === parent.post)
  }
}

module.exports = Comment
