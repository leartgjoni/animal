import { AsyncStorage } from 'react-native';
import {
    LOGIN_USER_SUCCESS,
    LOGOUT_USER
} from './types';

export const loginUserSuccess = ({ data, navigation }) => {
    return (dispatch) => {
        AsyncStorage.setItem('auth', JSON.stringify(data));
        navigation.navigate('home');
        dispatch({
         type: LOGIN_USER_SUCCESS,
         payload: data
        });
    };
};

export const userHasSavedToken = (data) => {
    return {
        type: LOGIN_USER_SUCCESS,
        payload: data
    };
};

export const logoutUser = (navigation) => {
    return (dispatch) => {
        AsyncStorage.removeItem('auth');
        navigation.navigate('home');
        dispatch({
            type: LOGOUT_USER,
        });
    }
};