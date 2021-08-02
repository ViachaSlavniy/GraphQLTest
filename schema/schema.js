const graphql = require('graphql');

const { GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const Movies = require('./../models/movie');
const Directors = require('./../models/director');

// // All IDs set automatically by mLab
// // Don't forget to update after creation
// const directorsJson = [
//   { "name": "Quentin Tarantino", "age": 55 }, // 60fea9d8e8c3a8572635afad
//   { "name": "Michael Radford", "age": 72 }, // 60feac51e8c3a8572635afae
//   { "name": "James McTeigue", "age": 51 }, // 60feacc8e8c3a8572635afaf
//   { "name": "Guy Ritchie", "age": 50 }, // 60feacede8c3a8572635afb0
// ];
// // directorId - it is ID from the directors collection
// const moviesJson = [
//   { "name": "Pulp Fiction", "genre": "Crime", "directorId": "60fea9d8e8c3a8572635afad" },
//   { "name": "1984", "genre": "Sci-Fi", "directorId": "60feac51e8c3a8572635afae" },
//   { "name": "V for vendetta", "genre": "Sci-Fi-Triller", "directorId": "60feacc8e8c3a8572635afaf" },
//   { "name": "Snatch", "genre": "Crime-Comedy", "directorId": "60feacede8c3a8572635afb0" },
//   { "name": "Reservoir Dogs", "genre": "Crime", "directorId": "60fea9d8e8c3a8572635afad" },
//   { "name": "The Hateful Eight", "genre": "Crime", "directorId": "60fea9d8e8c3a8572635afad" },
//   { "name": "Inglourious Basterds", "genre": "Crime", "directorId": "60fea9d8e8c3a8572635afad" },
//   { "name": "Lock, Stock and Two Smoking Barrels", "genre": "Crime-Comedy", "directorId": "60feacede8c3a8572635afb0" },
// ];

const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: new GraphQLNonNull(GraphQLString) },
        genre: {type: new GraphQLNonNull(GraphQLString) },
        director: {
            type: DirectorType,
            resolve(parent, args) {
                // return directors.find(director => director.id == parent.directorId)
                return Directors.findById(parent.directorId)
            }
        }
    })
})

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: new GraphQLNonNull(GraphQLString) },
        age: {type: new GraphQLNonNull(GraphQLInt) },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                // return movies.filter(movie => movie.directorId == parent.id)
                return Movies.find(parent.directorId)
            }
        }
    })
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addDirector: {
            type: DirectorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parent, args) {
                const director = new Directors({
                    name: args.name,
                    age: args.age,
                })
                return director.save()
            }
        },
        addMovie: {
            type: MovieType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                directorId: { type: GraphQLID },
            },
            resolve(parent, args) {
                const movie = new Movies({
                    name: args.name,
                    genre: args.genre,
                    directorId: args.directorId
                })
                return movie.save()
            }
        },
        deleteDirector: {
            type: DirectorType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                return Directors.findByIdAndRemove(args.id)
            }
        },
        deleteMovie: {
            type: MovieType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                return Movies.findByIdAndRemove(args.id)
            }
        },
        updateDirector: {
            type: DirectorType,
            args: {
                id: { type: GraphQLID },
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
            },
            resolve(parent, args) {
                return Directors.findByIdAndUpdate(
                    args.id,
                    {$set: {name: args.name, age: args.age } },
                    {new: true}
                )
            }
        },
        updateMovie: {
            type: MovieType,
            args: {
                id: { type: GraphQLID },
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                directorId: { type: GraphQLID },
            },
            resolve(parent, args) {
                return Movies.findByIdAndUpdate(
                    args.id,
                    {$set: {name: args.name, genre: args.genre, directorId: args.directorId } },
                    {new: true}
                )
            }
        }
    }
})

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        movie: {
            type: MovieType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return movies.find(movie => movie.id == args.id)
                return Movies.findById(args.id)
            }
        },
        director: {
            type: DirectorType,
            args: {id: {type: GraphQLID } },
            resolve(parent, args) {
                // return directors.find(director => director.id == args.id)
                return Directors.findById(args.id)
            }
        },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                // return movies
                return Movies.find({})
            }
        },
        directors: {
            type: new GraphQLList(DirectorType),
            resolve(parent, args) {
                // return directors
                return Directors.find({})
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
})