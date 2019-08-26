const Query = {
  users (parent, args, { db }, info) {
    return args.query ? db.users.filter(u => u.name.toLowerCase().includes(args.query.toLowerCase())) : db.users
  },
  posts (parent, args, { db }, info) {
    return args.query ? db.posts.filter(p => p.tittle.toLowerCase().includes(args.query.toLowerCase())) : db.posts
  },
  comments (parent, args, { db }, info) {
    return db.comments
  }
}

export { Query as default }
