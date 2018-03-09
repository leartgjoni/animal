import React, { Component } from 'react';
import {
    ScrollView,
    View,
    Text,
    Image,
    Dimensions,
    Platform,
    ActivityIndicator,
    KeyboardAvoidingView
} from 'react-native';
import { FormLabel, FormInput, Icon } from 'react-native-elements';
import { MapView } from 'expo';
import axios from 'axios';
import _ from 'lodash';
import { connect } from 'react-redux';
import { reloadScreen } from '../actions';
import { API_ROOT } from '../config/main';
import { submitButton, renderFormValidationMessage, pickImage, takeImage, addErrorToState } from '../helpers/forms';
import { requestError } from '../helpers/netInfo';
import { GOOGLE_GEOCODING_KEY } from '../config/apiKey';
import { APP_BLUE, CAMERA_TEXT, CAMERA_ICON_CONTAINER } from '../config/style';
import lang from '../config/lang/sq';

const SCREEN_WIDTH = Dimensions.get('window').width;

const no_errors = {
    description: null,
    address: null,
    image: null
};

const INITIAL_STATE = {
    sending: false,
    image: null,
    description: null,
    address: null,
    latitude: null,
    longitude: null,
    mapLoading: false,
    initialMapPoint : {
        longitude: 19.8167248,
        latitude: 41.3279672,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03
    },
    errors: no_errors
};

class ReportForm extends Component {
    state = INITIAL_STATE;

    storeReport = () => {
        this.setState({ sending: true });
        const url = `${API_ROOT}/report/`;
        let data = new FormData();
        data.append('default', true); //formdata multipart needs at least one part
        if(this.state.description)
            data.append('description', this.state.description);
        if(this.state.address)
            data.append('address', this.state.address);
        if(this.state.latitude)
            data.append('latitude', this.state.latitude);
        if(this.state.longitude)
            data.append('longitude', this.state.longitude);
        if(this.state.image){
            const uri = this.state.image.uri;
            const fileType = uri[uri.length - 1];
            data.append('image', { uri, name: `photo.${fileType}`, type: `image/${fileType}` });
        }

        axios.post(url, data , { headers: { 'Authorization': `JWT ${this.props.token}`, 'Content-Type': 'multipart/form-data'}})
            .then(res => {
                this.setState(INITIAL_STATE, async () => { await this.props.reloadScreen('profile'); this.props.reloadScreen('home'); this.props.navigation.navigate('home')});
            })
            .catch(error => {
                const { data } = error.response;
                if(_.has(data, 'error'))
                    requestError(data);
                else
                    data.errors.map((error) => { addErrorToState(this, error) });
                this.setState({ sending: false });
            })
    };

    renderMarker = () => {
        if(this.state.latitude && this.state.longitude)
            return (
                <MapView.Marker
                    coordinate={{latitude: this.state.latitude, longitude: this.state.longitude}}
                />
            );
    };

    selectPosition = async ({ latitude, longitude }) => {
        this.setState({ mapLoading: true, latitude, longitude });
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_GEOCODING_KEY}`);
        const address = response.data.results["0"].formatted_address;
        this.setState({mapLoading: false, address });
    };

    renderAddress = () => {
        if(this.state.mapLoading)
            return (
                <View style={{ paddingVertical: 20}}>
                    <ActivityIndicator animating />
                </View>
            );
        return (
            <View style={{ flexDirection: 'row', marginTop: 1, marginBottom: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>{this.state.address}</Text>
            </View>
        );
    };

    render() {

        return (

            <KeyboardAvoidingView style={{ flex: 1 }}
                                  behavior="padding"
            >
            <ScrollView style={{ backgroundColor: 'white', paddingTop: (Platform.OS === 'ios')? 20: undefined }}>


                <View>

                    <MapView
                        style={{ width: SCREEN_WIDTH, height: 200 }}
                        initialRegion={this.state.initialMapPoint}
                        onPress={e => this.selectPosition(e.nativeEvent.coordinate)}
                    >
                        {this.renderMarker()}
                    </MapView>
                    {this.renderAddress()}
                    {renderFormValidationMessage(this.state.errors.address)}
                </View>

                <View>

                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                        <View style={CAMERA_ICON_CONTAINER}>
                            <Text style={{paddingBottom: 10, color: '#666666', fontSize: 12, fontWeight: '500'}}>{lang.image}</Text>
                            <Image style={{ width: 100, height: 75 }} source={{ uri: this.state.image ? this.state.image.uri : 'http://via.placeholder.com/100x75' }}  />
                        </View>
                        <View style={CAMERA_ICON_CONTAINER}>
                            <Text style={CAMERA_TEXT}>{lang.camera}</Text>
                            <Icon name='camera' type='font-awesome' color={APP_BLUE} size={60}
                                  onPress={() => takeImage(this, 4, 3)} />
                        </View>
                        <View style={CAMERA_ICON_CONTAINER} >
                            <Text style={CAMERA_TEXT}>{lang.gallery}</Text>
                            <Icon name='picture-o' type='font-awesome' color={APP_BLUE} size={60}
                                  onPress={() => pickImage(this, 4, 3)} />
                        </View>
                    </View>

                    {renderFormValidationMessage(this.state.errors.image)}
                </View>

                <View>
                    <FormLabel>{lang.description}</FormLabel>
                    <FormInput value={this.state.description}
                           onChangeText={description => this.setState({ description }) }
                           multiline = {true} numberOfLines={4}
                           blurOnSubmit={false}
                           style={{ flex:1, padding: 7 }}
                    />
                    {renderFormValidationMessage(this.state.errors.description)}

                    {submitButton(this.state.sending, () => this.storeReport(), 'Save')}
                </View>


            </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

const mapStateToProps = ({ auth }) => {
    return auth;
};

export default connect(mapStateToProps, { reloadScreen })(ReportForm);

