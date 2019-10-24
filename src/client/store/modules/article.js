import { createAction, handleActions } from 'redux-actions';
import { call, put, takeEvery, takeLatest, actionChannel } from 'redux-saga/effects';
import axios from 'axios';
import config from '../../config/config.api';
import _ from 'lodash';
import { yellow } from 'ansi-colors';

// Actions
const actions = {
  getAticles: createAction('GET_ATICLES'),
  selectArticle: createAction('SELECT_ARTICLE', (articleId) => {return { articleId }}),
  selectRemoteArticle: createAction('SELECT_REMOTE_ARTICLE', (articleId) => { return { articleId }}),
  changeArticleData: createAction('CHANGE_ARTICLE_DATA', (fieldName, value) => { return { fieldName, value }}),
  addNewArticle: createAction('ADD_NEW_ARTICLE', (article) => {return { article }}),
  saveArticle: createAction('SAVE_ARTICLE', (article) => { return { article }}),
  getArticleNames: createAction('GET_ARTICLE_NAMES'),
  deleteArticle: createAction('DELETE_ARTICLE', (articleId) => { return { articleId }}),
  addNewComment: createAction('ADD_NEW_COMMENT', (articleId, newComment) => { return { articleId, newComment }}),
  editComment: createAction('EDIT_COMMENT', (articleId, comment) => { return { articleId, comment }}),
  deleteComment: createAction('DELETE_COMMENT', (articleId, commentId) => { return { articleId, commentId }})
};

// Sagas
function* sagaGetAticles(action){
  yield put({ type: 'GET_ATICLES_STARTED' });
  try{
    let result = yield axios.get(`${config.baseUrl}articles`);
    yield put({ type: 'GET_ATICLES_SUCCEEDED', payload: { articles: result.data }});
  }catch(error){
    console.log(error);
    yield put({ type: 'GET_ATICLES_ERROR' });
  }
}

function* sagaAddNewArticle(action){
  yield put({ type: 'ADD_NEW_ARTICLE_STARTED' });
  try{
    let result = yield axios.post(`${config.baseUrl}article`, action.payload.article);
    yield put({ type: 'ADD_NEW_ARTICLE_SUCCEEDED', payload: { newArticle: result.data }});
  }catch(error){
    console.log(error);
    yield put({ type: 'ADD_NEW_ARTICLE_ERROR' });
  }
}

function* sagaSaveArticle(action){
  yield put({ type: 'SAVE_ARTICLE_STARTED' });
  try{
    let result = yield axios.put(`${config.baseUrl}article`, action.payload.article, { params: { articleId: action.payload.article._id }});
    yield put({ type: 'SAVE_ARTICLE_SUCCEEDED' });
  }catch(error){
    console.log(error);
    yield put({ type: 'SAVE_ARTICLE_ERROR' });
  }
}

function* sagaSelectRemoteArticle(action){
  yield put({ type: 'SELECT_REMOTE_ARTICLE_STARTED' });
  try{
    let result = yield axios.get(`${config.baseUrl}article`, { params: { articleId: action.payload.articleId }});
    yield put({ type: 'SELECT_REMOTE_ARTICLE_SUCCEEDED', payload: { article: result.data }});
  }catch(error){
    console.log(error);
    yield put({ type: 'SELECT_REMOTE_ARTICLE_ERROR' });
  }
}

function* sagaGetArticleNames(action){
  yield put({ type: 'GET_ARTICLE_NAMES_STARTED' });
  try{
    let result = yield axios.get(`${config.baseUrl}articles/names`);
    yield put({ type: 'GET_ARTICLE_NAMES_SUCCEEDED', payload: { articleNames: result.data }});
  }catch(error){
    console.log(error);
    yield put({ type: 'GET_ARTICLE_NAMES_ERROR' });
  }
}

function* sagaDeleteArticle(action){
  yield put({ type: 'DELETE_ARTICLE_STARTED' });
  try{
    let result = yield axios.delete(`${config.baseUrl}article`, { params: { articleId: action.payload.articleId }});
    if(!result.data.ok){
      throw new Error('Article have not been deleted');
    }
    yield put({ type: 'DELETE_ARTICLE_SUCCEEDED', payload: { articleId: action.payload.articleId }});
  }catch(error){
    console.log(error);
    yield put({ type: 'DELETE_ARTICLE_ERROR' });
  }
}

function* sagaAddNewComment(action){
  yield put({ type: 'ADD_NEW_COMMENT_STARTED' });
  try{
    let result = yield axios.put(`${config.baseUrl}article/new_coment`, action.payload.newComment, { params: { articleId: action.payload.articleId }});
    yield put({ type: 'ADD_NEW_COMMENT_SUCCEEDED', payload: { comment: result.data, articleId: action.payload.articleId }});
  }catch(error){
    console.log(error);
    yield put({ type: 'ADD_NEW_COMMENT_ERROR' });
  }
}

function* sagaEditComment(action){
  yield put({ type: 'EDIT_COMMENT_STARTED' });
  try{
    let result = yield axios.put(`${config.baseUrl}article/coment`, _.omit(action.payload.comment, 'authorId', 'authorName', 'date'), { params: { articleId: action.payload.articleId }});
    yield put({ type: 'EDIT_COMMENT_SUCCEEDED', payload: { comment: result.data, articleId: action.payload.articleId }});
  }catch(error){
    console.log(error);
    yield put({ type: 'EDIT_COMMENT_ERROR' });
  }
}

function* sagaDeleteComment(action){
  yield put({ type: 'DELETE_COMMENT_STARTED' });
  try{
    let result = yield axios.delete(`${config.baseUrl}article/coment`, { params: { articleId: action.payload.articleId, commentId: action.payload.commentId }});
    if(result.data.ok)
      yield put({ type: 'DELETE_COMMENT_SUCCEEDED', payload: { articleId: action.payload.articleId, commentId: action.payload.commentId }});
  }catch(error){
    console.log(error);
    yield put({ type: 'DELETE_COMMENT_ERROR' });
  }
}

function* rootSaga(){
  yield takeEvery('GET_ATICLES', sagaGetAticles),
  yield takeEvery('ADD_NEW_ARTICLE', sagaAddNewArticle),
  yield takeEvery('SAVE_ARTICLE', sagaSaveArticle),
  yield takeEvery('SELECT_REMOTE_ARTICLE', sagaSelectRemoteArticle),
  yield takeEvery('GET_ARTICLE_NAMES', sagaGetArticleNames),
  yield takeEvery('DELETE_ARTICLE', sagaDeleteArticle),
  yield takeEvery('ADD_NEW_COMMENT', sagaAddNewComment),
  yield takeEvery('EDIT_COMMENT', sagaEditComment),
  yield takeEvery('DELETE_COMMENT', sagaDeleteComment)
}

// Reducers
const reducers = handleActions({
  'GET_ATICLES_SUCCEEDED': (state, action) => {
    return Object.assign({}, state, { articles: action.payload.articles });
  },
  'SELECT_ARTICLE': (state, action) => {
    let article = _.find(state.articles, { _id: action.payload.articleId });
    if(!article)
      article = {};
    return Object.assign({}, state, { selectedArticle: article });
  },
  'CHANGE_ARTICLE_DATA': (state, action) => {
    let article = Object.assign({}, state.selectedArticle);
    let articleData = {};
    articleData[action.payload.fieldName] = action.payload.value;
    article = Object.assign({}, article, articleData);
    return Object.assign({}, state, { selectedArticle: article });
  },
  'ADD_NEW_ARTICLE_SUCCEEDED': (state, action) => {
    let articleNames = state.articleNames.slice();
    articleNames.push({ _id: action.payload.newArticle._id, name: action.payload.newArticle.name });
    return Object.assign({}, state, { articleNames, selectedArticle: action.payload.newArticle });
  },
  'SELECT_REMOTE_ARTICLE_SUCCEEDED': (state, action) => {
    return Object.assign({}, state, { selectedArticle: action.payload.article });
  },
  'GET_ARTICLE_NAMES_SUCCEEDED': (state, action) => {
    return Object.assign({}, state, { articleNames: action.payload.articleNames });
  },
  'DELETE_ARTICLE_SUCCEEDED': (state, action) => {
    let articleNames = _.filter(state.articleNames, (articleName) => articleName._id != action.payload.articleId);
    return Object.assign({}, state, { articleNames });
  },
  'ADD_NEW_COMMENT_SUCCEEDED': (state, action) => {
    if (state.selectedArticle._id != action.payload.articleId){
      return state;
    }
    let comments = []
    if(_.isArray(state.selectedArticle.comments)){
      comments = state.selectedArticle.comments.slice();
    }
    comments.push(action.payload.comment);
    return Object.assign({}, state, { selectedArticle: Object.assign({}, state.selectedArticle, { comments })});    
  },
  'EDIT_COMMENT_SUCCEEDED': (state, action) => {
    if (state.selectedArticle._id != action.payload.articleId){
      return state;
    }
    let article = Object.assign({}, state.selectedArticle);
    Object.assign(_.find(article.comments, { id: action.payload.comment.id }), action.payload.comment)
    return Object.assign({}, state, { selectedArticle: article });
  },
  'DELETE_COMMENT_SUCCEEDED': (state, action) => {
    if (state.selectedArticle._id != action.payload.articleId){
      return state;
    }
    let article = Object.assign({}, state.selectedArticle);
    console.log(article);
    article = Object.assign({}, article, { comments: _.filter(article.comments, (comment) => comment.id != action.payload.commentId) });
    console.log(article);
    return Object.assign({}, state, { selectedArticle: article });
  }
}, { articles: [], articleNames: [], selectedArticle: {}});

export default { actions, reducers, rootSaga: rootSaga };