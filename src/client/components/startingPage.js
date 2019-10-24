import React, { Component } from 'react';
import { connect } from 'react-redux';

import { translate } from '../lib/translater';
import usersModule from '../store/modules/users';
const usersActions = usersModule.actions;
import { Redirect } from 'react-router-dom';

class StartingPage extends Component{

  constructor(props){
    super(props);
    this.onEnter = this.onEnter.bind(this);
  }

  onEnter(){
    // console.log(this.refs.loginEmail.value, this.refs.password.value);
    this.props.userSignIn(this.refs.loginEmail.value, this.refs.password.value);
  }

  render(){
    let userToken = window.localStorage.getItem('userToken');
    return(
      <div className="enter-form">
        {userToken && <Redirect to="/web" />}
        <form>
          <div className="form-group">
            <label>{translate('Login or email')}</label>
            <input ref="loginEmail" type="text" className="form-control" placeholder={translate('login or email')} required></input>
          </div>
          <div className="form-group">
            <label>{translate('Password')}</label>
            <input ref="password" type="password" className="form-control" required placeholder={translate('password')}></input>
          </div>
          <button onClick={() => this.onEnter()} className="btn btn-secondary" type="button">{translate('enter')}</button>
        </form>
      </div>
    );
  }

}

function mapStateToProps(state){
  return {
    currentUser: state.users.currentUser
  }
}

export default connect(mapStateToProps, usersActions)(StartingPage);