import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import Login from './pages/login'
import { Provider, useDispatch, useSelector } from 'react-redux'
import Store from './store'
import { login } from "./store/actions"
import Dashboard from './pages/dashboard'
import * as serviceWorker from './serviceWorker'

const PrivateRoute = ({ component: Component, ...rest }) => {
    let isLogin = useSelector(state => state.Auth.isLogin)
    const localLoginStatus = JSON.parse(localStorage.getItem('cotaUserInfo'))
    const sessionLoginStatus = JSON.parse(sessionStorage.getItem('cotaUserInfo'))

    const dispatch = useDispatch()

    if (!isLogin) {
        if ((localLoginStatus !== null && localLoginStatus !== undefined) || (sessionLoginStatus !== null && sessionLoginStatus !== undefined)) {
            dispatch(login(localLoginStatus || sessionLoginStatus))
            isLogin = true
        }
    }

    return (
        <Route {...rest} render={props => (
            isLogin ? (<Component {...props} />) : (<Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }} />)
        )} />
    )
}

const HideRoute = ({ component: Component, ...rest }) => {
    let isLogin = useSelector(state => state.Auth.isLogin)
    const localLoginStatus = JSON.parse(localStorage.getItem('cobaltUserInfo'))
    const sessionLoginStatus = JSON.parse(sessionStorage.getItem('cobaltUserInfo'))

    const dispatch = useDispatch()

    if (!isLogin) {
        if ((localLoginStatus !== null && localLoginStatus !== undefined) || (sessionLoginStatus !== null && sessionLoginStatus !== undefined)) {
            dispatch(login(localLoginStatus || sessionLoginStatus))
            isLogin = true
        }
    }

    return (
        <Route {...rest} render={props => (
            isLogin ? (<Redirect to={{
                pathname: '/',
                state: { from: props.location }
            }} />) : (<Component {...props} />)
        )} />
    )
}

const App = () => (
    <HashRouter>
        <Switch>
            <PrivateRoute exact path='/' component={Dashboard} />
            <HideRoute exact path='/login' component={Login} />
        </Switch>
    </HashRouter>
)

ReactDOM.render(
    <Provider store={Store}>
        <App />
    </Provider>,
    document.getElementById('root')
)

serviceWorker.unregister()