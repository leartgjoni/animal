import {
    RELOAD_SCREEN
} from '../actions/types';

const INITIAL_STATE = {
    screen: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case RELOAD_SCREEN:
            return { screen: action.payload };
        default:
            return state;
    }
};