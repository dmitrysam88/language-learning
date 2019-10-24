import React, { Component } from 'react';
import { connect } from 'react-redux';

import usersModule from '../../store/modules/users';
const userActions = usersModule.actions;
import { Route, Link, Redirect } from 'react-router-dom';

import { translate } from '../../lib/translater';

import UserList from './users/userList';
import LocaleList from './locale/lokaleList';
import ArticlesList from './articles/articlesList';
import TestsList from './tests/testsList';
import ResultTable from './testResults/resultTable';

class IndexAdmin extends Component {

  addUser(){
    this.props.addUser({ name: this.refs.name.value, email: this.refs.email.value });
  }

  getUsers(){
    this.props.getUsers();
  }

  onLogOut(){
    this.props.userLogOut();
  }

  render(){
    return(
      <div className="admin-panel">
        <Redirect from="/admin" to="/admin/users"/>
        <nav className="navbar navbar-light admin-navbar">
          <Link className="nav-link" to='/admin/users'>{translate('users')}</Link>
          <Link className="nav-link" to='/admin/articles'>{translate('articles')}</Link>
          <Link className="nav-link" to='/admin/tests'>{translate('tests')}</Link>
          <Link className="nav-link" to='/admin/locale'>{translate('locales')}</Link>
          <Link className="nav-link" to='/admin/results'>{translate('results')}</Link>
          <Link className="nav-link" to='/web'>{translate('web')}</Link>
          <button onClick={() => this.onLogOut()} type="button" className="btn btn-link">{translate('log out')}</button>
        </nav>
        <div>
          <Route path="/admin/results" component={ResultTable} />
          <Route path="/admin/users" component={UserList} />
          <Route path="/admin/locale" component={LocaleList} />
          <Route path="/admin/articles" component={ArticlesList} />
          <Route path="/admin/tests" component={TestsList} />      
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

export default connect(mapStateToProps, Object.assign({}, userActions))(IndexAdmin);