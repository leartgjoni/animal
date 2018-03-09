import {
    LOGIN_USER_SUCCESS,
    LOGOUT_USER
} from '../actions/types';

const INITIAL_STATE = {
    _id: null,
    token: null,
    logged: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOGIN_USER_SUCCESS:
            return { _id: action.payload._id, token: action.payload.token, logged: true };
        case LOGOUT_USER:
            return INITIAL_STATE;
        default:
            return state;
    }
};