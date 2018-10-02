const axios = require('axios')
const { GraphQLBoolean, GraphQLString, GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLList, GraphQLNonNull  } = require('graphql')
const massive = require('massive')
require('dotenv').config();

let db;
massive(process.env.CONNECTION_STRING).then((database)=>{
    console.log('connected to database')
    db = database
}).catch(err=> console.log(err))

const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => {
        return{
            id: { type: GraphQLInt },
            name: { type: GraphQLString },
            position: { type: GraphQLString }
        }
    }
})

const StudentType = new GraphQLObjectType({
    name: "Student",
    fields: () => {
        return {
            id: { type: GraphQLInt },
            name: {type: GraphQLString },
            cohort: {type: GraphQLString },
            fun: {
                type: GraphQLString, 
                resolve: ()=>{
                    return 'hello world'
                }    
            },
            cool: {
                type: GraphQLInt,
                resolve: () => {
                    return 3
                }
            }
        }
    }
})

const Query = new GraphQLObjectType({
    name: "Query",
    fields: function() {
        return {
            users: {
                type: new GraphQLList(UserType),
                resolve: () => {
                    console.log('hit')
                    return db.query('SELECT * FROM users')
                }
            },
            students: {
                type: new GraphQLList(StudentType),
                resolve: () => {
                    console.log('hit')
                    return db.query('SELECT * FROM students')
                }
            },
            student: {
                type: new GraphQLList(StudentType),
                args: {id: {type: GraphQLNonNull(GraphQLInt)}},
                resolve: (parentVal, args)=> {
                    console.log(args.id)
                    return db.query('SELECT * FROM students WHERE id = ${id}', {id: args.id})
                }
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query:Query,
    // mutation: Mutation
})