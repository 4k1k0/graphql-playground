const uuidv4 = require('uuid/v4')

const Mutation = {
  createUser (parent, args, { db }, info) {
    const { data } = args
    const { name, email, age } = data
    const emailTaken = db.users.some(user => user.email === email)
    if (emailTaken) throw new Error('Email taken :(')
    const user = {
      id: uuidv4(),
      name,
      email,
      age
    }
    db.users.push(user)
    return user
  },
  deleteUser (parent, args, { db }, info) {
    const userIndex = db.users.findIndex(u => u.id === args.id)
    if (userIndex === -1) throw new Error('User does not exists :(')
    const deletedUsers = db.users.splice(userIndex, 1)
    db.posts = db.posts.filter(post => {
      const match = post.autho === args.id
      if (match) {
        db.comments = db.comments.filter(comment => comment.post !== post.id)
      }
      return !match
    })

    db.comments = db.comments.filter(comments => comments.author !== args.id)
    return deletedUsers[0]
  },
  updateUser (parent, args, { db }, info) {
    const { id, data } = args
    const user = db.users.find(user => user.id === id)
    if (!user) throw new Error('User not found')
    if (typeof data.email === 'string') {
      const emailTaken = db.users.some(u => u.email === data.email)
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
    const userExists = db.users.some(user => user.id === author)
    if (!userExists) throw new Error('User does not exists :(')
    const post = {
      id: uuidv4(),
      tittle,
      body,
      published,
      author
    }
    db.posts.push(post)
    return post
  },
  deletePost (parent, args, { db }, info) {
    const postIndex = db.posts.findIndex(p => p.id === args.id)
    if (postIndex === -1) throw new Error('Post does not exists :(')
    const deletedPosts = db.posts.splice(postIndex, 1)
    db.comments = db.comments.filter(c => c.post !== args.id)
    return deletedPosts[0]
  },
  createComment (parent, args, { db }, info) {
    const { data } = args
    const { text, author, post } = data
    const userExists = db.users.some(user => user.id === author)
    const postExists = db.posts.some(p => p.id === post && p.published)
    if (!userExists || !postExists) throw new Error('User or post does not exists :(')
    const comment = {
      id: uuidv4(),
      text,
      author,
      post
    }
    db.comments.push(comment)
    return comment
  },
  deleteComment (parent, args, { db }, info) {
    const commentIndex = db.comments.findIndex(c => c.id === args.id)
    if (commentIndex === -1) throw new Error('Comment does not exists :(')
    const deletedComments = db.comments.splice(commentIndex, 1)
    return deletedComments[0]
  }
}

export { Mutation as default }
