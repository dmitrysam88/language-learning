import React, { Component } from 'react';
import { connect } from 'react-redux';

import usersModule from '../../../store/modules/users';
const userActions = usersModule.actions;

import { translate } from '../../../lib/translater';
import UserForm from './userForm';

class UserList extends Component {

  constructor(props){
    super(props);
    props.getUsers();
    this.onOpenUser = this.onOpenUser.bind(this);
    this.onDeleteUser = this.onDeleteUser.bind(this);
    this.onAddNewUser = this.onAddNewUser.bind(this);
  }

  onOpenUser(userId){
    this.props.selectUser(userId);
  }

  onDeleteUser(userId){
    if(userId && confirm(translate('do you want to delete it'))){
      this.props.deleteUser(userId);
    }
  }

  onAddNewUser(){
    this.props.selectUser();
  }

  render(){
    return(
      <div>
        <h3 className="ml-2">{translate('users')}</h3>
        <div className="row">
          <div className="col-6">
          <button onClick={() => this.onAddNewUser()} type="button" className="ml-2 btn btn-secondary">{translate('add new')}</button>
            <ul>
              {this.props.users.map((item, index) =>
                <li key={index}>
                  <span className="mr-2">{item.name}</span>
                  <span className="mr-2">{item.email}</span>
                  <button onClick={() => this.onOpenUser(item._id)} type="button" className="btn btn-link">{translate('open')}</button>
                  <button onClick={() => this.onDeleteUser(item._id)} type="button" className="btn btn-link">{translate('delete')}</button>
                </li> 
              )}
            </ul>
          </div>
          <div className="col-6">
            <div className="m-2">
              <UserForm/>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

function mapStateToProps(state){
  return {
    users: state.users.users
  }
}

export default connect(mapStateToProps, userActions)(UserList);