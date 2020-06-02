const uuidv4 = require('uuid')

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
  createPost (parent, args, { db, pubsub }, info) {
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
    if (post.published) {
      pubsub.publish('posts', {
        post: {
          mutation: 'CREATED',
          data: post
        }
      })
    }
    return post
  },
  deletePost (parent, args, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex(p => p.id === args.id)
    if (postIndex === -1) throw new Error('Post does not exists :(')
    const [post] = db.posts.splice(postIndex, 1)
    db.comments = db.comments.filter(c => c.post !== args.id)
    if (post.published) {
      pubsub.publish('posts', {
        post: {
          mutation: 'DELETED',
          data: post
        }
      })
    }
    return post
  },
  updatePost (parent, args, { db, pubsub }, info) {
    const { data } = args
    const post = db.posts.find(p => p.id === args.id)
    const originalPost = {...post}
    if (!post) throw new Error('Post does not exists :(')
    if (typeof data.tittle === 'string') {
      post.tittle = data.tittle
    }
    if (typeof data.body === 'string') {
      post.body = data.body
    }
    if (typeof data.published === 'boolean') {
      post.published = data.published
      if (originalPost.published && !post.published) {
        // deleted
        pubsub.publish('posts', {
          post: {
            mutation: 'DELETED',
            data: originalPost
          }
        })
      } else if (!originalPost.published && post.published) {
        // created
        pubsub.publish('posts', {
          post: {
            mutation: 'CREATED',
            data: post
          }
        })
      }
    } else if (post.published) {
      // updated
      pubsub.publish('posts', {
        post: {
          mutation: 'UPDATED',
          data: post
        }
      })
    }
    return post
  },
  createComment (parent, args, { db, pubsub }, info) {
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
    pubsub.publish(`comment ${data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment
      }
    })
    return comment
  },
  deleteComment (parent, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex(c => c.id === args.id)
    if (commentIndex === -1) throw new Error('Comment does not exists :(')
    const [deletedComment] = db.comments.splice(commentIndex, 1)
    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: deletedComment
      }
    })
    return deletedComment
  },
  updateComment (parent, args, { db, pubsub }, info) {
    const { data } = args
    const comment = db.comments.find(c => c.id === args.id)
    if (!comment) throw new Error('Comment does not exists :(')
    if (typeof data.text === 'string') {
      comment.text = data.text
    }
    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment
      }
    })
    return comment
  }
}

module.exports = Mutation
