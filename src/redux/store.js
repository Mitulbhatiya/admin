import { applyMiddleware, createStore } from "redux";
import createSagaMiddleware from "@redux-saga/core";
import { composeWithDevTools } from "redux-devtools-extension";

// Import Combination of all Reducer
import rootReducers from "./rootReducer";
// Import All Saga code 
import { rootSaga } from "./saga/index";


const sagaMiddleware = createSagaMiddleware()

const store = createStore(
    rootReducers,
    // applyMiddleware(sagaMiddleware)
    composeWithDevTools(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga)

export default store
