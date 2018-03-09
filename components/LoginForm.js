import React, { Component } from 'react';
import { ScrollView, View, Text, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { FormLabel, FormInput, SocialIcon } from 'react-native-elements';
import axios from 'axios';
import _ from 'lodash';
import { Facebook } from 'expo';
import { connect } from 'react-redux';
import { API_ROOT } from '../config/main';
import { loginUserSuccess } from '../actions';
import { submitButton, renderFormValidationMessage } from '../helpers/forms';
import { FB_API_KEY } from '../config/apiKey';
import lang from '../config/lang/sq';

const no_errors = {
    login_email: null,
    login_password: null,
    register_name: null,
    register_email: null,
    register_password: null,
    login: null,
    register: null,
    fb: null
};


class LoginForm extends Component{
    state = {
        login_email: null,
        login_password: null,
        register_name: null,
        register_email: null,
        register_password: null,
        showLoginForm: true,
        loading: {
            login: false,
            register: false,
            fb: false
        },
        errors: no_errors
    };

    apiRequest = (key) => {
        this.setState({ loading: { ...this.state.loading, [key]: true }, errors: no_errors });
        const url = `${API_ROOT}/auth/${key}`;

        const data = {
            email: this.state[`${key}_email`],
            password: this.state[`${key}_password`]
        };
        if(key === 'register')
            data['name'] = this.state[`${key}_name`];

        axios.post(url, data)
            .then(res => {
                this.setState(
                    { loading: { ...this.state.loading, [key]: false } },
                    () => this.props.loginUserSuccess({ data: res.data, navigation: this.props.navigation })
                );
            })
            .catch(error => {
                const { data } = error.response;
                if(_.has(data, 'errors'))
                    data.errors.map((error) => { this.addErrorToState(key, error) });
                if(_.has(data, 'error'))
                    this.setState({ errors: { ...this.state.errors, [`${key}`]: data.error }});
                this.setState({ loading: { ...this.state.loading, [key]: false } });
            });
    };

    addErrorToState = (path, error) => {
        this.setState({ errors: { ...this.state.errors, [`${path}_${error.param}`]: error.msg }});
    };

    facebookLogin = async () => {
        let { type, token } = await Facebook.logInWithReadPermissionsAsync(FB_API_KEY, {
            permissions: ['public_profile', 'email']
        });

        if(type === 'cancel')
            return;

        this.setState({ loading: { ...this.state.loading, fb: true }, errors: no_errors });
        const url = `${API_ROOT}/auth/fbAuth`;
        data = { token };
        axios.post(url, data)
            .then(res => {
                this.setState(
                    { loading: { ...this.state.loading, fb: false } },
                    () => this.props.loginUserSuccess({ data: res.data, navigation: this.props.navigation })
                );
            })
            .catch(error => {
                const { data } = error.response;
                this.setState({ errors: { ...this.state.errors, fb: data.error }});
                this.setState({ loading: { ...this.state.loading, fb: false } });
            })
    };

    facebookButton = () => {
        if(this.state.loading.fb)
            return (
                <View style={{ paddingVertical: 20}}>
                    <ActivityIndicator animating />
                </View>
            );
        return (
            <SocialIcon
                title='Sign In With Facebook'
                button
                light
                type='facebook'
                onPress={() => this.facebookLogin()}
            />
        );
    };

    showLoginForm = () => {
        if(this.state.showLoginForm)
            return(
                <View>
                    <Text style={{fontWeight: 'bold', fontSize: 22, color: '#27709d', textAlign: 'center'}}>{lang.login}</Text>


                    <FormLabel>Email</FormLabel>
                    <FormInput placeholder='example@email.com' value={this.state.login_email} onChangeText={login_email => this.setState({ login_email }) }/>
                    {renderFormValidationMessage(this.state.errors.login_email)}

                    <FormLabel>{lang.password}</FormLabel>
                    <FormInput placeholder={lang.your_password} secureTextEntry value={this.state.login_password} onChangeText={login_password => this.setState({ login_password }) }/>
                    {renderFormValidationMessage(this.state.errors.login_password)}

                    {renderFormValidationMessage(this.state.errors.login, {fontWeight: 'bold', fontSize: 16, textAlign: 'center'})}
                    {submitButton(this.state.loading.login, () => { this.apiRequest('login') }, 'LOGIN')}


                </View>
            );

        return(
            <View>
                <Text style={{fontWeight: 'bold', fontSize: 22, color: '#27709d', textAlign: 'center'}}>{lang.register}</Text>

                <FormLabel>{lang.name}</FormLabel>
                <FormInput placeholder='John Doe' value={this.state.register_name} onChangeText={register_name => this.setState({ register_name }) }/>
                {renderFormValidationMessage(this.state.errors.register_name)}

                <FormLabel>Email</FormLabel>
                <FormInput placeholder='example@email.com' value={this.state.register_email} onChangeText={register_email => this.setState({ register_email }) }/>
                {renderFormValidationMessage(this.state.errors.register_email)}

                <FormLabel>{lang.password}</FormLabel>
                <FormInput placeholder={lang.your_password} secureTextEntry value={this.state.register_password} onChangeText={register_password => this.setState({ register_password }) }/>
                {renderFormValidationMessage(this.state.errors.register_password)}

                {renderFormValidationMessage(this.state.errors.register, {fontWeight: 'bold', fontSize: 16, textAlign: 'center'})}
                {submitButton(this.state.loading.register, () => { this.apiRequest('register') }, 'REGISTER')}

            </View>
        );
    };

    showRegisterForm = () => {};

    render() {
        return (
            <ScrollView style={{backgroundColor: 'white', paddingTop: (Platform.OS === 'ios')? 50: undefined}}>
                {this.showLoginForm()}
                <TouchableOpacity onPress={() => this.setState({ showLoginForm: !this.state.showLoginForm })}>
                    <Text style={{marginTop: 4, marginBottom: 20, fontSize: 14, color: '#27709d', textAlign: 'center', fontWeight: '100'}}>
                        {this.state.showLoginForm ? lang.not_registered: lang.login}
                    </Text>
                </TouchableOpacity>

                {this.facebookButton()}

                {renderFormValidationMessage(this.state.errors.fb, {fontWeight: 'bold', fontSize: 16, textAlign: 'center'})}
            </ScrollView>
        );
    }
}

const mapStateToProps = ({ auth }) => {
    return auth;
};

export default connect(mapStateToProps, { loginUserSuccess })(LoginForm);