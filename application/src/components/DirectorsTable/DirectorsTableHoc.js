import { withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { graphql } from "react-apollo";

import { directorsQuery } from './queries'
import {deleteDirectorMutation} from "./mutations";

import { styles } from './styles';



// const withGraphqlDelete = graphql(deleteDirectorMutation, {
//     props: ({ mutate }) => ({
//         deleteDirector: id => mutate({
//             variables: { id },
//             refetchQueries: [{query: directorsQuery}]
//         })
//     })
// })

const withGraphQL = compose(
    graphql(deleteDirectorMutation, {
        props: ({ mutate }) => ({
            deleteDirector: id => mutate({
                variables: { id },
                refetchQueries: [{query: directorsQuery}]
            })
        })
    }),
    graphql(directorsQuery, {
        options: ({ name = '' }) => ({
            variables: { name },
        })
    }),
)



export default compose(withStyles(styles), withGraphQL)
