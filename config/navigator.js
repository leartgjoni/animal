import HomeScreen from '../screens/HomeScreen';
import RescuedScreen from '../screens/RescuedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CreateReportScreen from '../screens/CreateReportScreen';
import AuthScreen from '../screens/AuthScreen';
import {Platform} from 'react-native';

export const mainLayerOptions = {
    lazy: true,
    tabBarPosition: 'bottom',
    backBehavior: 'none',
    animationEnabled: false,
    swipeEnabled: false,
    tabBarOptions: {
        activeTintColor: '#27709d',
        inactiveTintColor: '#a7adba',
        labelStyle: {fontSize: 0},
        indicatorStyle: {backgroundColor: '#27709d'},
        style: {
            backgroundColor: '#f4f8fd',
        },
        showIcon: true,
        iconStyle: {
            width: 30,
            height: 30,
        },
    }
};

const androidIconStyle = {
    width: 30,
    height: 30,

};

export const mainStackNavigatorOptions = {
    lazy: true,
    animationEnabled: false,
    backBehavior: 'none'
};

export const secondaryLayerOptions = {
    navigationOptions: {
        tabBarVisible: false
    },
    lazy: true,
    animationEnabled: false,
    swipeEnabled: false,
    backBehavior: 'none',
};

export const AuthTabNavigator = {
    home: { screen: HomeScreen },
    rescued: { screen: RescuedScreen },
    createReport: { screen: CreateReportScreen },
    profile: { screen: ProfileScreen }
};

export const GuestTabNavigator = {
    home: { screen: HomeScreen },
    rescued: { screen: RescuedScreen },
    auth: { screen: AuthScreen }
};
