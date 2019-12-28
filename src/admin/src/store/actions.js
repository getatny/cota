import { UPDATE_LOGIN_STATUS } from "./actionTypes";

export const login = userInfo => {
    return {
        type: UPDATE_LOGIN_STATUS,
        userInfo
    }
}

export const logout = () => {
    return {
        type: UPDATE_LOGIN_STATUS,
        userInfo: null
    }
}