import { createAction, handleActions } from 'redux-actions';
import { call, put, takeEvery, takeLatest, actionChannel } from 'redux-saga/effects';
import axios from 'axios';
import config from '../../config/config.api';
import _ from 'lodash';


// Actions
const actions = {
  getTests: createAction('GET_TESTS'),
  getTestNames: createAction('GET_TEST_NAMES'),
  getRemoteTest: createAction('GET_REMOTE_TEST', (testId) => { return { testId }}),
  selectTest: createAction('SELECT_TEST', (test) => { return { test }}),
  changeSelectedTestData: createAction('CHANGE_SELECTED_TEST_DATA', (name, value) => { return { name, value }}),
  addNewTest: createAction('ADD_NEW_TEST', (test) => { return { test }}),
  saveTest: createAction('SAVE_TEST', (test) => { return { test }}),
  deleteTest: createAction('DELETE_TEST', (testId) => { return { testId }}),
  sendTestResults: createAction('SEND_TEST_RESULTS', (test) => { return { test }}),
  getTestResults: createAction('GET_TEST_RESULTS')
};

// Sagas
function* sagaGetTests(action){
  yield put({ type: 'GET_TESTS_STARTED' });
  try{
    let result = yield axios.get(`${config.baseUrl}tests`);
    yield put({ type: 'GET_TESTS_SUCCEEDED', payload: { tests: result.data }});
  }catch(error){
    console.log(error);
    yield put({ type: 'GET_TESTS_FAILED' });
  }
}

function* sagaGetTestNames(action){
  yield put({ type: 'GET_TEST_NAMES_STARTED' });
  try{
    let result = yield axios.get(`${config.baseUrl}tests/names`);
    yield put({ type: 'GET_TEST_NAMES_SUCCEEDED', payload: { testNames: result.data }});
  }catch(error){
    console.log(error);
    yield put({ type: 'GET_TEST_NAMES_FAILED' });
  }
}

function* sagaGetRemoteTest(action){
  yield put({ type: 'GET_REMOTE_TEST_STARTED' });
  try{
    let result = yield axios.get(`${config.baseUrl}test`, { params: { testId: action.payload.testId }});
    yield put({ type: 'GET_REMOTE_TEST_SUCCEEDED', payload: { test: result.data }});
  }catch(error){
    console.log(error);
    yield put({ type: 'GET_REMOTE_TEST_FAILED' });
  }
}

function* sagaAddNewTest(action) {
  yield put({ type: 'ADD_NEW_TEST_STARTED' });
  try{
    let result = yield axios.post(`${config.baseUrl}test`, action.payload.test);
    yield put({ type: 'ADD_NEW_TEST_SUCCEEDED', payload: { test: result.data }});
  }catch(error){
    console.log(error);
    yield put({ type: 'ADD_NEW_TEST_FAILED' });
  }
}

function* sagaSaveTest(action) {
  yield put({ type: 'SAVE_TEST_STARTED' });
  try{
    let result = yield axios.put(`${config.baseUrl}test`, action.payload.test, { params: { testId: action.payload.test._id }});
    yield put({ type: 'SAVE_TEST_SUCCEEDED'});
  }catch(error){
    console.log(error);
    yield put({ type: 'SAVE_TEST_FAILED' });
  }
}

function* sagaDeleteTest(action) {
  yield put({ type: 'DELETE_TEST_STARTED' });
  try{
    let result = yield axios.delete(`${config.baseUrl}test`, { params: { testId: action.payload.testId }});
    if(!result.data.ok){
      throw new Error('Test have not been deleted');
    }
    yield put({ type: 'DELETE_TEST_SUCCEEDED', payload: { testId: action.payload.testId }});
  }catch(error){
    console.log(error);
    yield put({ type: 'DELETE_TEST_FAILED' });
  }
}

function* sagaSendTestResults(action) {
  yield put({ type: 'SEND_TEST_RESULTS_STARTED' });
  try{
    let userToken = window.localStorage.getItem('userToken');
    if(!userToken)
      throw(new Error('Not user'));
    let result = yield axios.post(`${config.baseUrl}test_result`, { test: action.payload.test, userToken });
    if(!result.data.ok){
      throw new Error('Test have not been send');
    }
    yield put({ type: 'SEND_TEST_RESULTS_SUCCEEDED' });
  }catch(error){
    console.log(error);
    yield put({ type: 'SEND_TEST_RESULTS_FAILED' });
  }
}

function* sagaGetTestResults(action){
  yield put({ type: 'GET_TEST_RESULTS_STARTED' });
  try{
    let result = yield axios.get(`${config.baseUrl}test_result`);
    yield put({ type: 'GET_TEST_RESULTS_SUCCEEDED', payload: { testResults: result.data }})
  }catch(error){
    console.log(error);
    yield put({ type: 'GET_TEST_RESULTS_FAILED' });
  }
}

function* rootSaga(){
  yield takeEvery('GET_TESTS', sagaGetTests),
  yield takeEvery('GET_TEST_NAMES', sagaGetTestNames),
  yield takeEvery('GET_REMOTE_TEST', sagaGetRemoteTest),
  yield takeEvery('ADD_NEW_TEST', sagaAddNewTest),
  yield takeEvery('SAVE_TEST', sagaSaveTest),
  yield takeEvery('DELETE_TEST', sagaDeleteTest),
  yield takeEvery('SEND_TEST_RESULTS', sagaSendTestResults),
  yield takeEvery('GET_TEST_RESULTS', sagaGetTestResults)
}

// Reducers
const reducers = handleActions({
  'GET_TESTS_SUCCEEDED': (state, action) => {
    return Object.assign({}, state, { tests: action.payload.tests });
  },
  'GET_TEST_NAMES_SUCCEEDED': (state, action) => {
    return Object.assign({}, state, { testNames: action.payload.testNames });
  },
  'GET_REMOTE_TEST_SUCCEEDED': (state, action) => {
    return Object.assign({}, state, { selectedTest: action.payload.test, testFinished: false });
  },
  'SELECT_TEST': (state, action) => {
    return Object.assign({}, state, { selectedTest: action.payload.test, testFinished: false });
  },
  'CHANGE_SELECTED_TEST_DATA': (state, action) => {
    let selectedTest = _.cloneDeep(state.selectedTest);
    _.set(selectedTest, action.payload.name, action.payload.value);
    return Object.assign({}, state, { selectedTest });
  },
  'DELETE_TEST_SUCCEEDED': (state, action) => {
    let testNames = _.filter(state.testNames, (testName) => testName._id != action.payload.testId);
    return Object.assign({}, state, { testNames });
  },
  'ADD_NEW_TEST_SUCCEEDED': (state, action) => {
    let testNames = state.testNames.slice();
    testNames.push({ _id: action.payload.test._id, name: action.payload.test.name });
    return Object.assign({}, state, { testNames });
  },
  'GET_TEST_RESULTS_SUCCEEDED': (state, action) => {
    return Object.assign({}, state, { testResults: action.payload.testResults });
  },
  'SEND_TEST_RESULTS_SUCCEEDED': (state, action) => {
    return Object.assign({}, state, { testFinished: true });
  }
},{ tests: [], testNames: [], selectedTest: {}, testResults: [], testFinished: false });

export default { actions, reducers, rootSaga: rootSaga };