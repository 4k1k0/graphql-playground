const users = [
  {
    id: '1',
    name: 'Wako',
    email: 'wako@gmail.com',
    age: 26
  },
  {
    id: '2',
    name: 'Akko',
    email: 'akko@gmail.com'
  },
  {
    id: '3',
    name: 'Akiko',
    email: 'akiko@gmail.com',
    age: 22
  },
  {
    id: '4',
    name: 'Kagome',
    email: 'kagome@gmail.com',
    age: 16
  }
]

const posts = [
  {
    id: '1',
    tittle: 'Hello World!',
    body: 'Lorem Ipsum',
    published: true,
    author: '1'
  },
  {
    id: '2',
    tittle: 'Hello from Graphql!',
    body: 'Lorem QL',
    published: true,
    author: '3'
  },
  {
    id: '3',
    tittle: 'Hello from Node.js!',
    body: 'Lorem Node',
    published: false,
    author: '1'
  }
]

const comments = [
  {
    id: '1',
    text: 'First comment!',
    author: '1',
    post: '2'
  },
  {
    id: '2',
    text: 'Second comment',
    author: '2',
    post: '2'
  },
  {
    id: '3',
    text: 'Third comment',
    author: '1',
    post: '2'
  },
  {
    id: '4',
    text: 'Fourth comment',
    author: '3',
    post: '1'
  }
]

const db = {
  users,
  posts,
  comments
}

export { db as default }