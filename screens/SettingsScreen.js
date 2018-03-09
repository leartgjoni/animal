import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import SettingsForm from '../components/SettingsForm';

class SettingsScreen extends Component {
    static navigationOptions = {
        title: ' ',
        tabBarIcon: ({ tintColor }) => {
            return <Icon name='user-circle' type='font-awesome' size={30} color={tintColor} />
        }
    };

    render() {
        return <SettingsForm navigation={this.props.navigation} />;
    }
}

export default SettingsScreen;
