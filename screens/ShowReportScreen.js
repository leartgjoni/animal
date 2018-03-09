import React, { Component } from 'react';
import ReportShow from '../components/ReportShow';

class ShowReportScreen extends Component {

    render() {
        const item = this.props.navigation.state.params;

        return <ReportShow item={item} navigation={this.props.navigation} />;
    }
}

export default ShowReportScreen;