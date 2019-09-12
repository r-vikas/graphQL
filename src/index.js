import { GraphQLServer } from "graphql-yoga";

const users = [
  {
    id: "1",
    name: "Andrew",
    email: "andrew@example.com",
    age: 27
  },
  {
    id: "2",
    name: "Sarah",
    email: "sarah@example.com"
  },
  {
    id: "3",
    name: "Mike",
    email: "mike@example.com"
  }
];

const posts = [
  {
    id: "10",
    title: "GraphQL 101",
    body: "This is how to use GraphQL...",
    published: true,
    author: "1"
  },
  {
    id: "11",
    title: "GraphQL 201",
    body: "This is an advanced GraphQL post...",
    published: false,
    author: "1"
  },
  {
    id: "12",
    title: "Programming Music",
    body: "",
    published: false,
    author: "2"
  }
];

const comments = [
  {
    id: "1c",
    text: "i commented 1",
    author: "2",
    post: "10"
  },
  {
    id: "2c",
    text: "i commented trgrtg 2",
    author: "2",
    post: "10"
  },
  {
    id: "3c",
    text: "i commrfrtgented 3",
    author: "1",
    post: "12"
  },
  {
    id: "4c",
    text: "i wdwedcommented 4",
    author: "3",
    post: "11"
  }
];

const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me: User!        
        posts(query: String): [Post!]!        
        comments: [Comment!]!
      }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    
    type Comment {
      id: ID!
      text: String!
      author: User!
      post: Post!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }
`;

const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      } else {
        return users.filter(user =>
          user.name.toLowerCase().includes(args.query.toLowerCase())
        );
      }
    },
    me() {
      return {
        id: "123098",
        name: "Mike",
        email: "mike@example.com"
      };
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      } else {
        return posts.filter(post => {
          const titleMatch = post.title
            .toLowerCase()
            .includes(args.query.toLowerCase());
          const bodyMatch = post.body
            .toLowerCase()
            .includes(args.query.toLowerCase());
          return titleMatch || bodyMatch;
        });
      }
    },
    comments(parent, args, ctx, info) {
      return comments;
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    comments(parent,args,ctx,info){
      return comments.filter(comment=>{
        return comment.post===parent.id
      })
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => {
        return comment.author === parent.id;
      });
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user=>{
        return user.id===parent.author
      })
    },
    post(parent, args, ctx, info){
      return posts.find(post=>{
        return post.id===parent.post
      })
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log("The server is up!");
});
