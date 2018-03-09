import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image
} from 'react-native';

class SplashScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.logoView}>
                    <Image style={{width: 150, height: 150}} source={require('../media/images/logo.png')}/>
                </View>
                <View style={styles.textView}>
                    <Text style={styles.welcome}>
                        Powered by
                    </Text>
                    <Image style={{width: 150, height: 50}} source={require('../media/images/logo_text.png')}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#333333',
    },
    welcome: {
        fontSize: 25,
        textAlign: 'center',
        marginTop: 40,
        fontWeight: 'bold',
        color: '#fff'
    },
    logoView: {
        marginBottom: 70
    },
    textView: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default SplashScreen;