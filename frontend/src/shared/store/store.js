import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import logger from 'redux-logger';
import storage from 'redux-persist/lib/storage';
 
import rootReducer from '../reducers/rootReducer';
 
const persistConfig = {
  key: 'root',
  storage,
};
 
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer,applyMiddleware(logger));
export const persistor = persistStore(store);