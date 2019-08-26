const Query = {
  users (parent, args, ctx, info) {
    const { db } = ctx
    return args.query ? db.default.users.filter(u => u.name.toLowerCase().includes(args.query.toLowerCase())) : db.default.users
  },
  posts (parent, args, ctx, info) {
    const { db } = ctx
    return args.query ? db.default.posts.filter(p => p.tittle.toLowerCase().includes(args.query.toLowerCase())) : db.default.posts
  },
  comments (parent, args, ctx, info) {
    const { db } = ctx
    return db.default.comments
  }
}

module.exports = Query
