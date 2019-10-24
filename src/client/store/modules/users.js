import { createAction, handleActions } from 'redux-actions';
import { call, put, takeEvery, takeLatest, actionChannel } from 'redux-saga/effects';
import axios from 'axios';
import config from '../../config/config.api';
import _ from 'lodash';

// Actions

// let addUser = createAction('ADD_NEW_USER', user => user);

const actions = { 
  addNewUser: createAction('ADD_NEW_USER', (user) => { return { user }}),
  getUsers: createAction('FETCH_USERS'),
  selectUser: createAction('SELECT_USER', (userId) => { return { userId }}),
  changeUserData: createAction('CHANGE_USER_DATA', (fieldName, value) => { return { fieldName, value }}),
  saveUser: createAction('SAVE_USER', (user) => { return { user }}),
  deleteUser: createAction('DELETE_USER', (userId) => { return {userId}}),
  userSignIn: createAction('USER_SIGN_IN', (userLogin, userPassword) => { return { userLogin, userPassword }}),
  userLogOut: createAction('USER_LOG_OUT'),
  getCurrentUser: createAction('GET_CURREN_TUSER', (userToken) => { return { userToken }}) 
};

// Sagas
function* sagaFetchUsers(action){
  yield put({ type: 'FETCH_USERS_STARTED' });
  try {
    let result = yield axios.get(`${config.baseUrl}users`);
    yield put({ type: 'FETCH_USERS_SUCCEEDED', payload: { users: result.data }});
  } catch (error) {
    console.log(error);
    yield put({ type: 'FETCH_USERS_FAILED' });
  }
}

function* sagaSaveUser(action){
  yield put({ type: 'SAVE_USER_STARTED' });
  try{
    let result = yield axios.put(`${config.baseUrl}user`, action.payload.user, { params: { userId: action.payload.user._id }});
    yield put({ type: 'SAVE_USER_SUCCEEDED', payload: { user: result.data }});
  } catch (error){
    console.log(error);
    yield put({ type: 'SAVE_USER_FAILED' });
  }
}

function* sagaAddNewUser(action){
  yield put({ type: 'ADD_NEW_USER_STARTED' });
  try{
    let result = yield axios.post(`${config.baseUrl}user`, action.payload.user);
    yield put({ type: 'ADD_NEW_USER_SUCCEEDED', payload: { newUser: result.data }});
  } catch (error){
    console.log(error);
    yield put({ type: 'ADD_NEW_USER_FAILED' });
  }
}

function* sagaDeleteUser(action){
  yield put({ type: 'DELETE_USER_STARTED' });
  try{
    let result = yield axios.delete(`${config.baseUrl}user`,{ params: { userId: action.payload.userId}});
    if(!result.data.ok){
      throw new Error('User have not been deleted');
    }        
    yield put({ type: 'DELETE_USER_SUCCEEDED', payload: { userId: action.payload.userId }});
  } catch(error){
    console.log(error);
    yield put({ type: 'DELETE_USER_FAILED' });
  }
}

function* sagaUserSignIn(action){
  yield put({ type: 'USER_SIGN_IN_STARTED' });
  try{
    let result = yield axios.get(`${config.baseUrl}singIn`, { params: { userLogin: action.payload.userLogin, userPassword: action.payload.userPassword }});
    let userToken = _.get(result.data, 'userToken');
    if(userToken)
      window.localStorage.setItem('userToken', userToken);
    yield put({ type: 'USER_SIGN_IN_SUCCEEDED', payload: { currentUser: _.omit(result.data, 'userToken') }});
  }catch(error){
    console.log(error);
    yield put({ type: 'USER_SIGN_IN_FAILED' });
  }
}

function* sagaUserLogOut(action){
  yield put({ type: 'USER_LOG_OUT_STARTED' });
  window.localStorage.removeItem('userToken');
  yield put({ type: 'USER_LOG_OUT_SUCCEEDED' });
}

function* sagaGetCurrentUser(action){
  yield put({ type: 'GET_CURREN_TUSER_STARTED' });
  try{
    let result = yield axios.get(`${config.baseUrl}current_user`, { params: { userToken: action.payload.userToken }});
    yield put({ type: 'GET_CURREN_TUSER_SUCCEEDED', payload: { currentUser: result.data }});
  }catch(error){
    console.log(error);
    yield put({ type: 'GET_CURREN_TUSER_FAILED' });
  }
}

function* rootSaga(){
  yield takeEvery('FETCH_USERS', sagaFetchUsers),
  yield takeEvery('SAVE_USER', sagaSaveUser),
  yield takeEvery('ADD_NEW_USER', sagaAddNewUser),
  yield takeEvery('DELETE_USER', sagaDeleteUser),
  yield takeEvery('USER_SIGN_IN', sagaUserSignIn),
  yield takeEvery('USER_LOG_OUT', sagaUserLogOut),
  yield takeEvery('GET_CURREN_TUSER', sagaGetCurrentUser)
}

// Reducers

const reducers = handleActions({
  'FETCH_USERS_SUCCEEDED': (state, action) => {        
    return Object.assign({}, state, { users: action.payload.users });
  },
  'SELECT_USER': (state, action) => {
    let user = _.find(state.users, { _id: action.payload.userId });
    if(!user){
      user = {};
    }
    return Object.assign({}, state, { selectedUser: user });
  },
  'CHANGE_USER_DATA': (state, action) => {
    let user = Object.assign({}, state.selectedUser);
    let userData = {};
    userData[action.payload.fieldName] = action.payload.value;
    user = Object.assign({}, user, userData);
    return Object.assign({}, state, { selectedUser: user });
  },
  'ADD_NEW_USER_SUCCEEDED': (state, action) => {
    let users = state.users.slice();
    users.push(action.payload.newUser);
    return Object.assign({}, state, { users });
  },
  'DELETE_USER_SUCCEEDED': (state, action) => {
    let users = _.filter(state.users, (user) => user._id != action.payload.userId);
    return Object.assign({}, state, { users });
  },
  'SAVE_USER_SUCCEEDED': (state, action) => {
    let users = _.map(state.users, (user) => {
      if(user._id == action.payload.user._id)
        return action.payload.user;
      else
        return user;
    });
    return Object.assign({}, state, { users });
  },
  'USER_SIGN_IN_SUCCEEDED': (state, action) => {
    return Object.assign({}, state, { currentUser: action.payload.currentUser });
  },
  'USER_LOG_OUT_SUCCEEDED': (state, action) => {
    return Object.assign({}, state, { currentUser: {} });
  },
  'GET_CURREN_TUSER_SUCCEEDED': (state, action) => {    
    return Object.assign({}, state, { currentUser: action.payload.currentUser });
  }
}, { users: [], selectedUser: {}, currentUser: {}});

export default { actions, reducers, rootSaga: rootSaga };