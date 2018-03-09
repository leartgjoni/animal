import React from 'react';
import { View, ActivityIndicator } from 'react-native';

export const spliceArray = (array, chunkSize) => {
    const arrays = [];
    while(array.length > 0)
        arrays.push(array.splice(0, chunkSize));
    return arrays;
};

export const showReport = (item, navigation) => {
    return function(){
        navigation.navigate('showReport', item)
    }
};