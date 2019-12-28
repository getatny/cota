import { UPDATE_LOGIN_STATUS } from "./actionTypes";
import { combineReducers } from "redux";

const initialState = {
    isLogin: false,
    userInfo: null
}

const Auth = (state = initialState, action) => {
    switch(action.type) {
        case UPDATE_LOGIN_STATUS:
            if (action.userInfo !== null) {
                return {...state, isLogin: true, userInfo: action.userInfo}
            } else {
                return {...state, isLogin: false, userInfo: null}
            }
        default:
            return state
    }
}

export default combineReducers({
    Auth
})