import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';
import moment from 'moment'; require('moment/locale/sq');
import _ from 'lodash';
import { IMG_ROOT } from '../config/main';

class ReportItem extends Component {

    onClick = () => {
        const item = this.props.item;
        this.props.navigation.navigate('showReport', item);
    };

    returnItemObj() {
        const item = this.props.item;
        if(_.has(item, 'rescue') && item.rescue.deleted === false)
            return item.rescue;
        return item;
    }

    render() {
        const item = this.returnItemObj();

        return (
            <TouchableOpacity
                key={item._id}
                onPress={this.onClick}>
                <Card
                    key={item._id}
                    title={_.truncate(item.address, {'length': 45})}
                    image={{ uri: `${IMG_ROOT}/${this.props.imgPath}/${item.image}` }}
                    containerStyle={{ backgroundColor: '#f4f8fd' }}
                >
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <Text style={{  fontWeight: 'bold' }}>{item.user.name}</Text>
                    </View>
                    <Text style={{ marginBottom: 2 }}>
                        {_.truncate(item.description, {'length': 50})}
                    </Text>
                    <Text style={{ marginBottom: 10, fontWeight: '100', color: 'grey' }}>
                        {moment(item.createdAt).fromNow()}
                    </Text>
                </Card>
            </TouchableOpacity>
        );
    }
}

export default ReportItem;