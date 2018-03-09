import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Provider } from 'react-redux';
import store from './store';
import MainNavigator from './components/navigator/MainNavigator';

export default class App extends React.Component {



  render() {

    return (
        <Provider store={store}>
            <View style={styles.container}>
                <MainNavigator />
            </View>
        </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? Expo.Constants.statusBarHeight : undefined
  },
});
