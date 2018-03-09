import React, { Component } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Badge } from 'react-native-elements';
import axios from 'axios';
import _ from 'lodash';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { API_ROOT, IMG_ROOT } from '../config/main';
import { spliceArray, showReport } from '../helpers/userShow';
import { renderLoading } from '../helpers/forms';
import { requestError } from '../helpers/netInfo';
import lang from '../config/lang/sq';
import { APP_BLUE } from '../config/style';

class UserShow extends Component {

    state = {
        user: null,
        reports: null,
        rescues: null,
        loading: true
    };

    componentDidMount() {
        this.fetchUser();
    }

    fetchUser = () => {
        const url = `${API_ROOT}/profile/${this.props.id}`;
        axios.get(url)
            .then(res => {
                this.setState({
                    user: res.data.user,
                    reports: res.data.reports,
                    rescues: res.data.rescues,
                    loading: false
                });
            })
            .catch(error => {
                if(_.has(error.response.data, 'error'))
                    requestError(error.response.data);
                this.setState({ loading: false });
            });
    };

    renderItems(items, type) {
        if(items.length === 0)
            return (
                <Badge containerStyle={{ marginTop: 15, marginLeft: 80, marginRight:80, marginBottom: 30, backgroundColor: '#f4f8fd' }}
                       value={lang[`no_${type}`]} textStyle={{ color: 'black' }} />
            );

        return (
            <Grid style={{flex: 1}}>
                {this.renderRows(items, type)}
            </Grid>
        );
    }

    renderRows(items, type) {
        const arrays = spliceArray(items, 3);
        return arrays.map((array, i) => {
            return (
                <Row key={i}>
                    {this.renderCols(array, type)}
                </Row>
            );
        });
    };

    renderCols(items, type) {
        return items.map((item, i) => {
            return (
                <Col key={i}>
                    <TouchableOpacity onPress={showReport(item, this.props.navigation)}>
                        <Image style={{ height: 150, width: 200 }} source={{ uri: (type==='report') ? `${IMG_ROOT}/reports/${item.image}` : `${IMG_ROOT}/rescues/${item.rescue.image}` }} />
                    </TouchableOpacity>
                </Col>);
        });
    };


    renderUser() {
        const {user, reports, rescues } = this.state;
        return (
            <ScrollView style={{ backgroundColor: 'white' }}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                    <View>
                        <Image style={{  height: 80, width: 80, borderRadius: 40}} source={{ uri: `${IMG_ROOT}/user_profile_images/${user.image}` }}  />
                        <Text style={{fontWeight: 'bold'}}>{user.name}</Text>
                    </View>
                    <View>
                        <Text style={{fontWeight: 'bold', fontSize: 25, color: APP_BLUE}}>{reports.length} {lang.reports} </Text>
                        <Text style={{fontWeight: 'bold', fontSize: 25, color: APP_BLUE}}>{rescues.length} {lang.rescues} </Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 18, color: APP_BLUE,marginTop: 15, marginBottom:10}}>
                        {lang.reports}
                        </Text>
                </View>
                {this.renderItems(reports, 'report')}
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 18, color: APP_BLUE, marginTop: 15, marginBottom:10}}>
                        {lang.rescues}
                    </Text>
                </View>
                {this.renderItems(rescues,'rescue')}
            </ScrollView>
        );
    };

    renderView = () => {
        if(this.state.loading)
            return renderLoading();
        return this.renderUser();
    };

    render() {
        return this.renderView();
    }

}

export default UserShow;