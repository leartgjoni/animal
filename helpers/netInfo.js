import { NetInfo, Alert } from 'react-native';
import _ from 'lodash';

export const netInfo = _this => {
    NetInfo.isConnected.fetch().then().done(isConnected => {
        if(!isConnected)
            _this.setState({ netStatus: false });

        NetInfo.isConnected.addEventListener('change', isConnected => {
            if(!isConnected)
                _this.setState({ netStatus: false });
            else
                _this.setState({ netStatus: true });
        });
    });
};

export const requestError = data => {
        Alert.alert('error', data.error);
};