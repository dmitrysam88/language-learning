import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import _ from 'lodash';

import usersModule from '../../../store/modules/users';
const userActions = usersModule.actions;

import { translate } from '../../../lib/translater';

class UserForm extends Component {

  constructor(props){
    super(props);
    this.onChangeUserData = this.onChangeUserData.bind(this);
    this.onSaveUser = this.onSaveUser.bind(this);
  }

  onChangeUserData(name, value){
    this.props.changeUserData(name, value);
  }

  onSaveUser(){
    let {selectedUser} = this.props;
    if(!selectedUser.role){
      selectedUser.role = this.refs.role.selectedOptions[0].value
    }
    if(selectedUser._id){
      this.props.saveUser(selectedUser);
    }else{
      this.props.addNewUser(selectedUser);
    }
  }

  render(){
    let optionsRoles = [
      { value: 'admin', label: 'admin' },
      { value: 'manager', label: 'manager' },
      { value: 'user', label: 'user' } 
    ];
    let currentUserRole = _.find(optionsRoles, { value: this.props.selectedUser.role });
    return (
      <div>
        <p>{translate('user form')}</p>
        <div>
          <button onClick={this.onSaveUser} type="button" className="btn btn-secondary save-button">{translate('save')}</button>
        </div>
        <label className="mt-1">{translate('user name')}</label>
        <input onChange={(event)=>this.onChangeUserData('name', event.target.value)} type="text" className="form-control" value={this.props.selectedUser.name || ""}></input>
        <label>{translate('email')}</label>
        <input onChange={(event)=>this.onChangeUserData('email', event.target.value)} type="email" className="form-control" value={this.props.selectedUser.email || ""}></input>
        <label>{translate('password')}</label>
        <input onChange={(event)=>this.onChangeUserData('password', event.target.value)} type="password" className="form-control" value={this.props.selectedUser.password || ""}></input>
        <label>{translate('role')}</label>
        <Select value={currentUserRole} onChange={(selectedOption) => this.onChangeUserData('role', selectedOption.value)} options={optionsRoles}/>
      </div>
    )
  }
}

function mapStateToProps(state){
  return {
    selectedUser: state.users.selectedUser
  }
}

export default connect(mapStateToProps, userActions)(UserForm);