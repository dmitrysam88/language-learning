import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Route, Link, Redirect } from 'react-router-dom';

import IndexWeb from './web/IndexWeb';
import IndexAdmin from './admin/IndexAdmin';
import StartingPage from './startingPage'

import localeModule from '../store/modules/locale';
const localeActions = localeModule.actions;
import usersModule from '../store/modules/users';
const usersActions = usersModule.actions;
import { initTranslate, translate } from '../lib/translater';

import _ from 'lodash';

class App extends Component {

  constructor(props){
    super(props);
    const userToken = window.localStorage.getItem('userToken');
    if(userToken){
      props.getCurrentUser(userToken);
    }
    props.fetchAllLocales();
    props.getLocale('en');
    this.onLogOut = this.onLogOut.bind(this);
  }

  componentDidUpdate(){
    const userToken = window.localStorage.getItem('userToken');
    if(_.isEmpty(userToken) && window.location.pathname !== "/signIn"){
      window.location = "/signIn";
    }else if(!_.isEmpty(userToken) && window.location.pathname === "/signIn"){
      window.location = "/web";
    }
  }

  onLogOut(){
    this.props.userLogOut();
  }

  render(){
    initTranslate(this.props.locale);
    let userToken = window.localStorage.getItem('userToken');
    return(
      <div id="main-container">
        {!userToken && <Redirect to="/signIn" />}
        <div className="web-page">
          <Route path="/web" component={IndexWeb} />
          <Route path="/admin" component={IndexAdmin} />
          <Route exact path="/signIn" component={StartingPage}/>        
        </div>        
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    locale: state.locale.locale
  }
}

export default connect(mapStateToProps,  Object.assign({}, localeActions, usersActions))(App);