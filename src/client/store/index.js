import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware, push } from 'react-router-redux';
import history from 'history';

import usersModule from './modules/users';
import localeModule from './modules/locale';
import articleModule from './modules/article';
import testModule from './modules/test';

let reducers = combineReducers({ users: usersModule.reducers, locale: localeModule.reducers, articles: articleModule.reducers, test: testModule.reducers });

const sagaMiddleware = createSagaMiddleware();
const routMiddleware = routerMiddleware(history);
const middleware = applyMiddleware(sagaMiddleware, routMiddleware);

const store = createStore(reducers, composeWithDevTools(middleware));

sagaMiddleware.run(usersModule.rootSaga);
sagaMiddleware.run(localeModule.rootSaga);
sagaMiddleware.run(articleModule.rootSaga);
sagaMiddleware.run(testModule.rootSaga);

export default store;