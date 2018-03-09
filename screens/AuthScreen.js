import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import LoginForm from '../components/LoginForm';


class AuthScreen extends Component {
  static navigationOptions = {
    header: null,
    backgroundColor: 'white',
    title: ' ',
    tabBarIcon: ({ tintColor }) => {
      return <Icon name='sign-in' type='font-awesome' size={30} color={tintColor} />
    }
  };

  render() {
    return <LoginForm navigation={this.props.navigation} />;
  }
}

export default AuthScreen;
