const axios = require('axios')
const { GraphQLBoolean, GraphQLString, GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLList, GraphQLNonNull  } = require('graphql')
const massive = require('massive')
require('dotenv').config();

var db;
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

const AssessmentType = new GraphQLObjectType({
    name: "Assessment",
    fields: () => {
        return {
            assessment_name: {type: GraphQLString },
            passed: {type: GraphQLBoolean },
            notes: {type: GraphQLString}
        }
    }
})

const StudentType = new GraphQLObjectType({
    name: "Student",
    fields: () => {
        return {
            id: { type: GraphQLInt },
            name: {type: GraphQLString },
            email: {type: GraphQLString },
            favoritePokemon: {
                type: GraphQLString,
                resolve: (student) => {
                    return axios.get(`https://pokeapi.co/api/v2/pokemon/${student.id}`).then(response => response.data.forms[0].name)
                }
            },
            cohort: {type: GraphQLString },
            assessment: {
                type: GraphQLList(AssessmentType),
                args: {assessId: {type: GraphQLInt }} ,
                resolve: (student, assessId) => {
                    console.log(student.id, assessId.assessId)
                    return db.get_student_scores([student.id, assessId.assessId]).then(response => {
                        return response
                    })
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