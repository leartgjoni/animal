import React, { Component } from 'react';
import UserShow from '../components/UserShow';

class ShowReportScreen extends Component {

    render() {
        const { id } = this.props.navigation.state.params;

        return <UserShow id={id} navigation={this.props.navigation} />;
    }
}

export default ShowReportScreen;