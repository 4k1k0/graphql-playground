'use strict'

const Subscription = {
  comment: {
    subscribe (parent, args, { db, pubsub }, info) {
      const { postId } = args
      const post = db.posts.find(p => p.id === postId && p.published)
      if (!post) throw new Error('Post not found')
      return pubsub.asyncIterator(`comment ${postId}`)
    }
  },
  post: {
    subscribe (parent, args, { pubsub }, info) {
      return pubsub.asyncIterator('posts')
    }
  }
}

module.exports = Subscription
