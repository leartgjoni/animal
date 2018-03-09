import React, { Component } from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import ReportList from '../components/ReportList';

class RescuedScreen extends Component {
  static navigationOptions = {
    header: null,
    title: ' ',
    tabBarIcon: ({ tintColor }) => {
      return <Icon name='favorite' size={30} color={tintColor} />
    }
  };

  render() {
    return (
      <View style={{backgroundColor: 'white'}}>
          <ReportList screen='rescued' apiUrl='report/rescued' imgPath='rescues' navigation={this.props.navigation}/>
      </View>
    );
  }
}

export default RescuedScreen;
