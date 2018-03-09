import {
    RELOAD_SCREEN
} from './types';
export const reloadScreen = (screen) => {
    return {
        type: RELOAD_SCREEN,
        payload: screen
    }
};