import { createAction, handleActions } from 'redux-actions';
import { call, put, takeEvery, takeLatest, actionChannel, select } from 'redux-saga/effects';
import axios from 'axios';
import config from '../../config/config.api';
import { yellow } from 'ansi-colors';

// Actions
const actions = {
  getLocale: createAction('GET_LOCALE', (localeName) => { return { localeName }}),
  saveLocale: createAction('SAVE_LOCALE', (locale)=>{ return {locale}}),
  fetchAllLocales: createAction('FETCH_ALL_LOCALES')
};

// Sagas
function* sagaGetLocale(action){
  yield put({ type: 'GET_LOCALE_STARTED' });
  try{
    let result = yield axios.get(`${config.baseUrl}locale`, { params: { localeName: action.payload.localeName }});
    yield put({ type: 'GET_LOCALE_SUCCEEDED', payload: { localeName: action.payload.localeName, locale: result.data }});
  }catch(error){
    console.log(error);
    yield put({ type: 'GET_LOCALE_ERROR' });
  }
}

function* sagaSaveLocale(action){
  yield put({ type: 'SAVE_LOCALE_STARTED' });
  try{
    let state = yield select();
    let result = yield axios.put(`${config.baseUrl}locale`, action.payload.locale,{params: { localeName: state.locale.localeName }});
    yield put({ type: 'SAVE_LOCALE_SUCCEEDED', payload: { locale: result.data }});
  }catch(error){
    console.log(error);
    yield put({ type: 'SAVE_LOCALE_ERROR' });
  }
}

function* sagaFetchLocaleNames(action){
  yield put({ type: 'FETCH_ALL_LOCALES_STARTED' });
  try{
    let result = yield axios.get(`${config.baseUrl}locale/names`);
    yield put({ type: 'FETCH_ALL_LOCALES_SUCCEEDED', payload: {allLocale: result.data}});
  }catch(error){
    console.log(error);
    yield put({ type: 'FETCH_ALL_LOCALES_ERROR' });
  }
}

function* rootSaga(){
  yield takeEvery('GET_LOCALE', sagaGetLocale),
  yield takeEvery('SAVE_LOCALE', sagaSaveLocale),
  yield takeEvery('FETCH_ALL_LOCALES', sagaFetchLocaleNames)
}

// Reducers
const reducers = handleActions({
  'GET_LOCALE_SUCCEEDED': (state, action) => {
    return Object.assign( {}, state, { localeName: action.payload.localeName, locale: action.payload.locale } );
  },
  'SAVE_LOCALE_SUCCEEDED': (state, action) => {
    return Object.assign( {}, state, { locale: action.payload.locale });
  },
  'FETCH_ALL_LOCALES_SUCCEEDED': (state, action) => {
    return Object.assign( {}, state, { allLocale: action.payload.allLocale });
  } 
}, { localeName: "", locale: {}, allLocale: [] });

export default { actions, reducers, rootSaga: rootSaga };