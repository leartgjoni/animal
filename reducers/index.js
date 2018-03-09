import { combineReducers } from 'redux';
import auth from './auth_reducer';
import reloadScreen from './reload_reducer';

export default combineReducers({
    auth, reloadScreen
});