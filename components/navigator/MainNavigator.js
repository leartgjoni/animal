import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { userHasSavedToken } from '../../actions';


import SettingsScreen from '../../screens/SettingsScreen';
import ShowReportScreen from '../../screens/ShowReportScreen';
import ShowUserScreen from '../../screens/ShowUserScreen';
import SplashScreen from "../../screens/SplashScreen";
import NoConnection from '../../screens/NoConnection';

import { netInfo } from '../../helpers/netInfo';

import {
    mainLayerOptions,
    secondaryLayerOptions,
    mainStackNavigatorOptions,
    GuestTabNavigator,
    AuthTabNavigator
} from '../../config/navigator';


class MainNavigator extends Component {

    state = {
        loading: true,
        netStatus: true
    };

    componentWillMount(){
        netInfo(this);
        setTimeout( async () => {
            let auth = await AsyncStorage.getItem('auth');
            if(auth && auth.length)
                await this.props.userHasSavedToken(JSON.parse(auth));
            this.setState({ loading: false });
        }, 1000); //pause to display splashscreen better
    }

    returnTabs() {
        if(this.props.logged === false)
            return GuestTabNavigator;
        return AuthTabNavigator;
    }

    renderNavigator(Navigator) {
        if(this.state.loading)
            return <SplashScreen/>;
        else if(!this.state.netStatus)
            return <NoConnection />;
        return <Navigator />;
    }

    render() {
        const Navigator = StackNavigator({
            main: { screen: TabNavigator(this.returnTabs(), mainLayerOptions)},
            firstLayer: { screen: TabNavigator({
                showReport: { screen: ShowReportScreen },
                settings: { screen : SettingsScreen }
            }, secondaryLayerOptions)},
            secondLayer: { screen: TabNavigator({
                showUser: { screen: ShowUserScreen }
            }, secondaryLayerOptions)}
        }, mainStackNavigatorOptions);

        return this.renderNavigator(Navigator);
    }
}

const mapStateToProps = ({ auth }) => {
    return auth;
};

export default connect(mapStateToProps, { userHasSavedToken })(MainNavigator);