const Query = {
  users (parent, args, ctx, info) {
    const { db } = ctx
    return args.query ? db.users.filter(u => u.name.toLowerCase().includes(args.query.toLowerCase())) : db.users
  },
  posts (parent, args, ctx, info) {
    const { db } = ctx
    return args.query ? db.posts.filter(p => p.tittle.toLowerCase().includes(args.query.toLowerCase())) : db.posts
  },
  comments (parent, args, ctx, info) {
    const { db } = ctx
    return db.comments
  }
}

module.exports = Query
