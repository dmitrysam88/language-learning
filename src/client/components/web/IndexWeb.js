import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Link, Redirect } from 'react-router-dom';

import { translate } from '../../lib/translater';
import Select from 'react-select';

import localeModule from '../../store/modules/locale';
const lacaleActions = localeModule.actions;

import usersModule from '../../store/modules/users';
const userActions = usersModule.actions;

import IndexArticle from './articles/indexArticle';
import IndexTest from './tests/indexTest';
import _ from 'lodash';

class IndexWeb extends Component {

  onChangeLanguage(language){    
    if(this.props.localeName != language){
      this.props.getLocale(language);
    }
  }
  
  render(){
    let lokaleKeys = _.map(this.props.allLocale, 'key');
    return(
      <div className="web-panel">
        <nav className="navbar navbar-light navbar-expand-lg web-navbar">
          <Link className="nav-link" to='/web/articles'>{translate('articles')}</Link>
          <Link className="nav-link" to='/web/tests'>{translate('tests')}</Link>
          <div className="btn-group">
            <button type="button" className="dropdown-toggle btn btn-light" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {this.props.localeName}
            </button>
            <div className="dropdown-menu">
              {_.map(lokaleKeys, (item, index) =>
                <a key={index} onClick={(e)=>this.onChangeLanguage(item)} className="dropdown-item">{item}</a> 
              )}
            </div>
          </div>
          <button onClick={() => this.props.userLogOut()} type="button" className="btn btn-link">{translate('log out')}</button>
        </nav>
        <div className="p-2">
          <Route path="/web/articles" component={IndexArticle} />
          <Route path="/web/tests" component={IndexTest} />
        </div>
      </div>
    );
  }

}

function mapStateToProps(state){
  return{
    localeName: state.locale.localeName,
    allLocale: state.locale.allLocale
  }
}

export default connect(mapStateToProps, Object.assign({}, lacaleActions, userActions))(IndexWeb);