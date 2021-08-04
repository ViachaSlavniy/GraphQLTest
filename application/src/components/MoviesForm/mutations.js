import { gql } from 'apollo-boost';

export const addMovieMutation = gql`
    mutation addMovie($name: String!, $genre: String!, $watched: Boolean!, $directorId: ID, $rate: Int) {
        addMovie(name: $name, genre: $genre, watched: $watched, directorId: $directorId, rate: $rate) {
            name
        }
    }
`