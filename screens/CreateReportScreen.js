import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import ReportForm from '../components/ReportForm';

class CreateReportScreen extends Component {
  static navigationOptions = {
    header: null,
    title: ' ',
    tabBarIcon: ({ tintColor }) => {
      return <Icon name='plus-circle' type='font-awesome' size={30} color={tintColor} />
    }
  };

  render() {
    return <ReportForm navigation={this.props.navigation} />;
  }
}

export default CreateReportScreen;
