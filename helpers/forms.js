import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Button, FormValidationMessage } from 'react-native-elements';
import { ImagePicker } from 'expo';

export const submitButton = (state, onPressFunction, title) => {
    if(state)
        return (
            <View style={{ paddingVertical: 20}}>
                <ActivityIndicator animating />
            </View>
        );
    return (
        <Button
            onPress={onPressFunction}
            icon={{ name: 'done' }}
            buttonStyle={{ marginTop: 15, marginBottom: 20 }}
            backgroundColor='#27709d'
            title={title}
        />
    );
};

export const renderFormValidationMessage = (state, style = null) => {
    if (state)
        return (
            <FormValidationMessage labelStyle={style}>{state}</FormValidationMessage>
        );
    return null;
};

export const pickImage = async (_this, widthRatio, heightRatio) => {
    let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [widthRatio, heightRatio],
        quality: 0.5
    });

    if (!result.cancelled) {
        _this.setState({ image: result });
    }
};

export const takeImage = async (_this, widthRatio, heightRatio) => {
    let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [widthRatio, heightRatio],
        quality: 0.5
    });

    if (!result.cancelled) {
        _this.setState({ image: result });
    }
};

export const renderLoading = () => {
    return (
        <View style={{ paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#CED0CE'}}>
            <ActivityIndicator animating size='large' />
        </View>
    );
};

export const addErrorToState = (_this, error) => {
    _this.setState({ errors: { ..._this.state.errors, [`${error.param}`]: error.msg }});
};