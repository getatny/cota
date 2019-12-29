import { createStore, applyMiddleware, compose } from "redux";
import store from './reducer';

const middleware = []

// print logs in console only on dev env.
if (process.env.NODE_ENV === `development`) {
    const { logger } = require(`redux-logger`);
    middleware.push(logger);
}

export default compose(applyMiddleware(...middleware))(createStore)(store)