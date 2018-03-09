import React, { Component } from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import ReportList from '../components/ReportList';

class HomeScreen extends Component {
  static navigationOptions = {
      header: null,
      backgroundColor: 'white',
      title: ' ',
      tabBarIcon: ({ tintColor }) => {
        return <Icon name='view-list' size={30} color={tintColor} />
      }
  };

  render() {
    return ( 
      <View style={{backgroundColor: 'white'}}>
        <ReportList screen='home' apiUrl='report' imgPath='reports' navigation={this.props.navigation} />
      </View>
    );
  }
}

export default HomeScreen;
