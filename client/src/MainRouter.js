import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
import Home from './core/Home'
import Signup from './user/Signup'
import Signin from './auth/Signin'
import PrivateRoute from './auth/PrivateRoute'
import GroupPage from './groups/GroupPage'
import SingleUser from './groups/SingleUser'
import Menu from './core/Menu'
import ExplanationPage from "./ExplanationPage"
import ForgotPassword from './auth/ForgotPassword'

const MainRouter = () => {
    return (<div>
      <Menu/>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/signup" component={Signup}/>
        <Route exact path="/signin" component={Signin}/>
        <Route exact path="/forgotpassword/:token" component={ForgotPassword}/>
        <Route exact path="/group/:groupId"    component={GroupPage}/>
        <Route exact path="/explanation"    component={ExplanationPage}/>
        <Route exact path="/singleuser/:userId"    component={SingleUser}/>
      </Switch>

    </div>)
}

export default MainRouter
