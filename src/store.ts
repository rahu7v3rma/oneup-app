import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  createTransform,
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';

import postReducer from './reducers/post';

const rootReducer = combineReducers({
  post: postReducer,
});

const ignoreLoadingTransform = createTransform(
  // do not modify state as it is being persisted
  (inboundState: any) => {
    return inboundState;
  },
  // modify state as it is being loaded from persistance - unset all loading
  // flags
  (outboundState: any) => {
    delete outboundState.loading;
    return { ...outboundState };
  },
  // call this transform for every reducer
  {},
);

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  blacklist: ['date', 'clientConfig'],
  transforms: [ignoreLoadingTransform],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // disable the serializable check for redux-persist's actions
      serializableCheck: {
        ignoredActions: [FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE],
      },
    }),
});

export default store;

export const persistor = persistStore(store);

// infer the `RootState` type from the store
export type RootState = ReturnType<typeof store.getState>;

// infer the `AppDispatch` type from the store so thunk actions can return promises
export type AppDispatch = typeof store.dispatch;

// reset persisted store when a user logs out
export const resetStore = () => {
  return persistor.flush().then(() => persistor.purge());
};
