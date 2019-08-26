const uuidv4 = require('uuid/v4')

const Mutation = {
  createUser (parent, args, { db }, info) {
    const { data } = args
    const { name, email, age } = data
    const emailTaken = db.default.users.some(user => user.email === email)
    if (emailTaken) throw new Error('Email taken :(')
    const user = {
      id: uuidv4(),
      name,
      email,
      age
    }
    db.default.users.push(user)
    return user
  },
  deleteUser (parent, args, { db }, info) {
    const userIndex = db.default.users.findIndex(u => u.id === args.id)
    if (userIndex === -1) throw new Error('User does not exists :(')
    const deletedUsers = db.default.users.splice(userIndex, 1)
    db.default.posts = db.default.posts.filter(post => {
      const match = post.autho === args.id
      if (match) {
        db.default.comments = db.default.comments.filter(comment => comment.post !== post.id)
      }
      return !match
    })

    db.default.comments = db.default.comments.filter(comments => comments.author !== args.id)
    return deletedUsers[0]
  },
  updateUser (parent, args, { db }, info) {
    const { id, data } = args
    const user = db.default.users.find(user => user.id === id)
    if (!user) throw new Error('User not found')
    if (typeof data.email === 'string') {
      const emailTaken = db.default.users.some(u => u.email === data.email)
      if (emailTaken) throw new Error('Email taken')
      user.email = data.email
    }
    if (typeof data.name === 'string') {
      user.name = data.name
    }
    if (typeof data.age !== 'undefined') {
      user.age = data.age
    }
    return user
  },
  createPost (parent, args, { db }, info) {
    const { data } = args
    const { tittle, body, published, author } = data
    const userExists = db.default.users.some(user => user.id === author)
    if (!userExists) throw new Error('User does not exists :(')
    const post = {
      id: uuidv4(),
      tittle,
      body,
      published,
      author
    }
    db.default.posts.push(post)
    return post
  },
  deletePost (parent, args, { db }, info) {
    const postIndex = db.default.posts.findIndex(p => p.id === args.id)
    if (postIndex === -1) throw new Error('Post does not exists :(')
    const deletedPosts = db.default.posts.splice(postIndex, 1)
    db.default.comments = db.default.comments.filter(c => c.post !== args.id)
    return deletedPosts[0]
  },
  updatePost (parent, args, { db }, info) {
    const { data } = args
    const post = db.default.posts.find(p => p.id === args.id)
    if (!post) throw new Error('Post does not exists :(')
    if (typeof data.tittle === 'string') {
      post.tittle = data.tittle
    }
    if (typeof data.body === 'string') {
      post.body = data.body
    }
    if (typeof data.published === 'boolean') {
      post.published = data.published
    }
    return post
  },
  createComment (parent, args, { db }, info) {
    const { data } = args
    const { text, author, post } = data
    const userExists = db.default.users.some(user => user.id === author)
    const postExists = db.default.posts.some(p => p.id === post && p.published)
    if (!userExists || !postExists) throw new Error('User or post does not exists :(')
    const comment = {
      id: uuidv4(),
      text,
      author,
      post
    }
    db.default.comments.push(comment)
    return comment
  },
  deleteComment (parent, args, { db }, info) {
    const commentIndex = db.default.comments.findIndex(c => c.id === args.id)
    if (commentIndex === -1) throw new Error('Comment does not exists :(')
    const deletedComments = db.default.comments.splice(commentIndex, 1)
    return deletedComments[0]
  }
}

module.exports = Mutation
