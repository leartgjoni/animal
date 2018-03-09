import React, { Component } from 'react';
import { ScrollView, View, Text, Image, Alert, RefreshControl, KeyboardAvoidingView } from 'react-native';
import { Button, FormInput, FormLabel, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import axios from 'axios';
import _ from 'lodash';
import { logoutUser, reloadScreen } from '../actions';
import { API_ROOT, IMG_ROOT } from '../config/main';
import { submitButton, pickImage, takeImage, renderFormValidationMessage, renderLoading, addErrorToState } from '../helpers/forms';
import { requestError } from '../helpers/netInfo';
import { APP_BLUE, CAMERA_ICON_CONTAINER, CAMERA_TEXT } from '../config/style';
import lang from '../config/lang/sq';

const no_errors = {
    name: null,
    password: null,
    image: null
};

const INITIAL_STATE = {
    user: null,
    loading: true,
    name: null,
    password: null,
    image: null,
    updating: false,
    errors: no_errors
};

class SettingsForm extends Component{
    state = INITIAL_STATE;

    componentDidMount(){
        this.fetchSettings();
    };

    fetchSettings = () => {
        const url = `${API_ROOT}/profile/settings`;
        axios.get(url, { headers: { 'Authorization': `JWT ${this.props.token}`}})
            .then(res => {
                this.setState({
                    user: res.data.user,
                    name: res.data.user.name,
                    loading: false
                });
            })
            .catch(error => {
                if(_.has(error.response.data, 'error'))
                    requestError(data);
                this.setState({ loading: false });
            });
    };

    updateSettings = () => {
        this.setState({ updating: true });
        const url = `${API_ROOT}/profile/`;
        let data = new FormData();
        data.append('default', true); //formdata multipart needs at least one part
        if(this.state.name)
            data.append('name', this.state.name);
        if(this.state.password)
            data.append('password', this.state.password);
        if(this.state.image){
            const uri = this.state.image.uri;
            const fileType = uri[uri.length - 1];
            data.append('image', { uri, name: `photo.${fileType}`, type: `image/${fileType}` });
        }

        axios.patch(url, data , { headers: { 'Authorization': `JWT ${this.props.token}`, 'Content-Type': 'multipart/form-data'}})
            .then(res => {
                this.setState(INITIAL_STATE, () => { this.props.reloadScreen('profile'); this.fetchSettings(); Alert.alert('Settings Updated Successfully!') });
            })
            .catch(error => {
                const { data } = error.response;
                if(_.has(data, 'error'))
                    requestError(data);
                else
                    data.errors.map((error) => { addErrorToState(this, error) });
                this.setState({ updating: false });
            })
    };

    renderSettings = () => {
        return (
            <View>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 18, color: APP_BLUE}}>{lang.edit_info}</Text>
                </View>

                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                    <View style={CAMERA_ICON_CONTAINER}>
                        <Text style={CAMERA_TEXT}>{lang.profile_image}</Text>
                        <Image style={{ height: 80, width: 80, borderRadius: 40}} source={{ uri: this.state.image ? this.state.image.uri : `${IMG_ROOT}/user_profile_images/${this.state.user.image}` }}  />
                    </View>
                    <View style={CAMERA_ICON_CONTAINER}>
                        <Text style={CAMERA_TEXT}>{lang.camera}</Text>
                        <Icon name='camera' type='font-awesome' color='#27709d' size={60}
                              onPress={() => takeImage(this, 1, 1)} />
                    </View>
                    <View style={CAMERA_ICON_CONTAINER}>
                        <Text style={CAMERA_TEXT}>{lang.gallery}</Text>
                        <Icon name='picture-o' type='font-awesome' color='#27709d' size={60}
                              onPress={() => pickImage(this, 1, 1)} />
                    </View>
                </View>

                <FormLabel>{lang.email}</FormLabel>
                <FormLabel>{this.state.user.email}</FormLabel>

                <FormLabel>{lang.name}</FormLabel>
                <FormInput value={this.state.name} onChangeText={name => this.setState({ name }) }/>
                {renderFormValidationMessage(this.state.errors.name)}

                <FormLabel>{lang.password}</FormLabel>
                <FormInput placeholder={lang.type_new_password} secureTextEntry value={this.state.password} onChangeText={password => this.setState({ password }) }/>
                {renderFormValidationMessage(this.state.errors.password)}

                {submitButton(this.state.updating, () => this.updateSettings(), 'EDIT')}
            </View>

        );
    };

    renderView = () => {
        if(this.state.loading)
            return renderLoading();
        return this.renderSettings();
    };

    render() {
        return (
            <KeyboardAvoidingView style={{ flex: 1 }}
                                  behavior="padding"
            >
                <ScrollView style={{ backgroundColor: 'white'}}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.loading}
                            onRefresh={() => this.fetchSettings()}
                        />
                    }
                >
                <Button
                onPress={() => this.props.logoutUser(this.props.navigation)}
                buttonStyle={{ marginTop: 15, marginBottom: 20, backgroundColor: APP_BLUE }}
                title={lang.logout}
                />
                    {this.renderView()}
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

const mapStateToProps = ({ auth }) => {
    return auth;
};

export default connect(mapStateToProps, { logoutUser, reloadScreen })(SettingsForm);