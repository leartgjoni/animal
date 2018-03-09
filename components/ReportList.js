import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { List, Badge } from 'react-native-elements';
import axios from 'axios';
import _ from 'lodash';
import { connect } from 'react-redux';
import ReportItem from './ReportItem';
import { API_ROOT } from '../config/main';
import { requestError } from '../helpers/netInfo';
import lang from '../config/lang/sq';

class ReportList extends React.PureComponent {

  state = {
    loading: false,
    data: [],
    page: 1,
    error: null,
    refreshing: false,
    noMoreData: false
  };

  componentDidMount() {
    this.setState({ loading: true }, this.fetchReports());
  }

  componentWillReceiveProps(nextProps){
      if(nextProps.reloadScreen && nextProps.reloadScreen.screen === this.props.screen)
          this.setState({
              page: 1,
              refreshing: true,
              noMoreData: false
          }, () => this.fetchReports());
  }



  fetchReports = () => {
    const { page } = this.state;
    const url = `${API_ROOT}/${this.props.apiUrl}/?page=${page}`;
    axios.get(url)
        .then(res => {
          this.setState({
            data: page===1 ? res.data.reports : [...this.state.data, ...res.data.reports],
            loading: false,
            refreshing: false,
            noMoreData: res.data.reports.length < res.data.pagination
          });
        })
        .catch(error => {
            if(_.has(error.response.data, 'error'))
                requestError(error.response.data);
            this.setState({error, loading: false, refreshing: false });
        });
  };

  handleRefresh = () => {
    this.setState({
      page: 1,
      refreshing: true,
      noMoreData: false
    }, () => this.fetchReports());
  };

  handleLoadMore = () => {
    if(!this.state.noMoreData && !this.state.refreshing)
        this.setState({
            page: this.state.page + 1,
            loading: true
        }, () => this.fetchReports());
  };

  renderFooter = () => {
    if(this.state.noMoreData){
        return (
            <Badge containerStyle={{ marginTop: 15, backgroundColor: '#f4f8fd' , marginLeft: 100, marginRight: 100}}
                   value={lang.no_more_data} textStyle={{ color: 'black' }} wrapperStyle={{borderColor: 'black'}}/>
        );
    }

    return (
      <View style={{ paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#CED0CE'}}>
        <ActivityIndicator animating size='large' />
      </View>
    );
  };

  render() {
    return (
      <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0, marginBottom: 15 }}>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (<ReportItem item={item} imgPath={this.props.imgPath} navigation={this.props.navigation}/>) }
          keyExtractor={(item, index) => index}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefresh}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={1}
        />
      </List>
    );
  };

}

const mapStateToProps = ({ reloadScreen }) => {
    return { reloadScreen };
};

export default connect(mapStateToProps, null)(ReportList);
