import React, { Component } from 'react';
import Tabs from './components/Tabs/Tabs';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import theme from './components/theme';
import Apollo from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

const client = new Apollo({
  uri: 'http://localhost:3005/graphql',
});

class App extends Component {
  render() {
    return (
        <ApolloProvider client={client}>
          <MuiThemeProvider theme={theme}>
            <Tabs />
          </MuiThemeProvider>
        </ApolloProvider>
    );
  }
}

export default App;
