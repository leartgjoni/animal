import React, { Component } from 'react';
import { View, Text, Image, ScrollView, Platform, Dimensions, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { MapView } from 'expo';
import { Icon, Button, FormLabel, FormInput } from 'react-native-elements';
import _ from 'lodash';
import axios from 'axios';
import moment from 'moment'; require('moment/locale/sq');
import { connect } from 'react-redux';
import { reloadScreen } from '../actions';
import { API_ROOT, IMG_ROOT } from '../config/main';
import { pickImage, takeImage, submitButton, renderFormValidationMessage, addErrorToState  } from '../helpers/forms';
import { requestError } from '../helpers/netInfo';
import lang from '../config/lang/sq';
import { APP_BLUE, CAMERA_TEXT, CAMERA_ICON_CONTAINER } from '../config/style';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMG_HEIGHT = SCREEN_WIDTH*3/4;

const no_errors = {
    description: null,
    image: null
};

const INITIAL_RESCUE = {
    description: null,
    image: null
};

const INITIAL_STATE = {
    sending: false,
    showMap:false,
    showRescueFormView: false,
    rescue: INITIAL_RESCUE,
    errors: no_errors
};

class ReportShow extends Component {
    state = INITIAL_STATE;

    storeRescue = () => {
        this.setState({ sending: true });
        const url = `${API_ROOT}/rescue/${this.props.item._id}`;
        let data = new FormData();
        data.append('default', true); //formdata multipart needs at least one part
        if(this.state.description)
            data.append('description', this.state.description);
        if(this.state.image){
            const uri = this.state.image.uri;
            const fileType = uri[uri.length - 1];
            data.append('image', { uri, name: `photo.${fileType}`, type: `image/${fileType}` });
        }

        axios.post(url, data , { headers: { 'Authorization': `JWT ${this.props.auth.token}`, 'Content-Type': 'multipart/form-data'}})
            .then(res => {
                this.setState(INITIAL_STATE , async () => { await this.props.reloadScreen('profile'); this.props.reloadScreen('rescued'); this.props.navigation.navigate('rescued')});
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

    showReporter = () => {
        if(this.props.auth._id === this.props.item.user._id)
            return this.props.navigation.navigate('profile');
        return this.props.navigation.navigate('showUser', {id: this.props.item.user._id});
    };

    showRescuer = () => {
        if(this.props.auth._id === this.props.item.rescue.user._id)
            return this.props.navigation.navigate('profile');
        return this.props.navigation.navigate('showUser', {id: this.props.item.rescue.user._id});
    };

    showMap = () => {
        if(!this.state.showMap)
            return null;

        const { item } = this.props;
        const mapPoint = {
            longitude: item.geometry.coordinates[0],
            latitude: item.geometry.coordinates[1],
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
        };

        return (
            <MapView
                scrollEnabled={false}
                style={{ width: SCREEN_WIDTH, height: 200 }}
                cacheEnabled={Platform.OS === 'android'}
                initialRegion={mapPoint}
            >
                <MapView.Marker
                    coordinate={{latitude: item.geometry.coordinates[1], longitude: item.geometry.coordinates[0]}}
                />
            </MapView>
        );
    };

    showRescueForm = () => {
        if(!this.state.showRescueForm)
            return null;

        return(
            <View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                    <View style={CAMERA_ICON_CONTAINER}>
                        <Text style={CAMERA_TEXT}>{lang.image}</Text>
                        <Image style={{ width: 100, height: 75 }} source={{ uri: this.state.image ? this.state.image.uri : 'http://via.placeholder.com/100x75' }}  />
                    </View>
                    <View style={CAMERA_ICON_CONTAINER} >
                        <Text style={CAMERA_TEXT}>{lang.camera}</Text>
                        <Icon name='camera' type='font-awesome' color={APP_BLUE} size={60}
                              onPress={() => takeImage(this, 4, 3)} />
                    </View>
                    <View style={CAMERA_ICON_CONTAINER}>
                        <Text style={CAMERA_TEXT}>{lang.gallery}</Text>
                        <Icon name='picture-o' type='font-awesome' color={APP_BLUE} size={60}
                              onPress={() => pickImage(this, 4, 3)} />
                    </View>
                </View>
                {renderFormValidationMessage(this.state.errors.image)}

                <FormLabel>Description</FormLabel>
                <FormInput value={this.state.description} onChangeText={description => this.setState({ description }) }
                           multiline = {true} numberOfLines={4}
                           blurOnSubmit={false}
                           style={{ flex:1, padding: 7 }} />
                {renderFormValidationMessage(this.state.errors.description)}

                {submitButton(this.state.sending, () => this.storeRescue(), 'Save')}
            </View>
        );
    };


    renderRescue(item){
        if(_.has(item, 'rescue') && item.rescue.deleted === false)
            return (
                <View>

                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        <Icon name='check-circle' type='font-awesome' size={18} color={APP_BLUE} />
                        <Text style={{fontWeight: 'bold', fontSize: 18, color: APP_BLUE}}>
                            {lang.rescued}
                        </Text>
                    </View>

                    <Image source={{uri: `${IMG_ROOT}/rescues/${item.rescue.image}`}}  style={{ width:SCREEN_WIDTH, height: IMG_HEIGHT }}/>
                    <View style={{ marginLeft: 15, marginRight: 15 }}>
                        <TouchableOpacity onPress={this.showRescuer} style={{flexDirection: 'row', marginTop: 3, marginBottom: 3}}>
                            <Text style={{  fontWeight: 'bold', fontSize: 16 }}> {item.rescue.user.name}</Text>
                        </TouchableOpacity>
                        <Text style={{ marginBottom: 2 }}> {item.rescue.description}</Text>
                        <Text style={{marginBottom: 10, fontWeight: '100', color: 'grey' }}> {moment(item.rescue.createdAt).calendar()}</Text>
                    </View>
                </View>
            );
        else if (this.props.auth.logged)
            return (
                <View>
                    <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 15, marginBottom: 15}}>
                        <TouchableOpacity onPress={() => this.setState({ showRescueForm: !this.state.showRescueForm })} style={{marginTop:10, marginBottom: 10}} >
                            <Text style={{fontWeight: 'bold', fontSize: 18, color: APP_BLUE}}>
                                {lang.have_you_rescued}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {this.showRescueForm()}
                </View>
            );
        else
            return null;
    }

    render() {
        const { item } = this.props;

        return (
            <KeyboardAvoidingView style={{ flex: 1 }}
                                  behavior="padding"
            >
            <ScrollView style={{flex: 1, backgroundColor: 'white'}}>



                <View>
                    <TouchableOpacity onPress={() => this.setState({ showMap: !this.state.showMap })} style={{ flexDirection: 'row', marginTop: 3, marginBottom: 3, justifyContent: 'center', alignItems: 'center'}}>
                        <Icon name='map-marker' type='font-awesome'/><Text> {item.address}</Text>
                    </TouchableOpacity>
                    {this.showMap()}
                </View>
                <View style={{ marginTop: 2 }}>
                    <Image
                        style={{width: SCREEN_WIDTH, height: IMG_HEIGHT }}
                        source={{ uri: `${IMG_ROOT}/reports/${item.image}` }}
                    />
                </View>
                <View style={{ marginLeft: 15, marginRight: 15 }}>
                    <TouchableOpacity onPress={this.showReporter} style={{flexDirection: 'row', marginTop: 3, marginBottom: 3}}>
                        <Text style={{  fontWeight: 'bold', fontSize: 16 }}> {item.user.name}</Text>
                    </TouchableOpacity>
                    <Text style={{ marginBottom: 2 }}> {item.description}</Text>
                    <Text style={{marginBottom: 10, fontWeight: '100', color: 'grey' }}> {moment(item.createdAt).calendar()}</Text>
                </View>


                {this.renderRescue(item)}

            </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

const mapStateToProps = ({ auth }) => {
    return { auth };
};

export default connect(mapStateToProps, { reloadScreen })(ReportShow);