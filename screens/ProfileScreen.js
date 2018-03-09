import React, { Component } from 'react';
import { Icon, Button } from 'react-native-elements';
import MyProfile from '../components/MyProfile';



class ProfileScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: ' ',
    tabBarIcon: ({ tintColor }) => {
      return <Icon name='user-circle' type='font-awesome' size={30} color={tintColor} />
    },
    headerRight: (
      <Button
          title='Settings'
          onPress={() => navigation.navigate('settings')}
          backgroundColor='rgba(0,0,0,0)'
          color='rgba(0, 122, 255, 1)'
      />
    )
  });

  render() {
    return <MyProfile navigation={this.props.navigation} />;
  }
}

export default ProfileScreen;
