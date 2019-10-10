import React from 'react';
import {BrowserRouter, Route, Switch, Router} from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Painel from './pages/Painel';
import Cadastro from './pages/Cadastro';
import SignUpSuccess from './pages/SignUpSuccess';
import Recovery from "./pages/Recovery";
import RecoveryForm from "./pages/RecoveryForm";
import RecoverySend from "./pages/RecoverySend";

export default function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/login" exact component={Login}/>
                <Route path="/signup" exact component={Cadastro}/>
                <Route path="/User/:hash/activate" exact component={SignUpSuccess}/>
                <Route path="/User/:hash/recovery" exact component={RecoveryForm}/>
                <Route path="/signup/success" exact component={SignUpSuccess}/>
                <Route path="/recovery" exact component={Recovery}/>
                <Route path="/recovery/send" exact component={RecoverySend}/>
                <Route path="/"  component={Painel}/>
            </Switch>
        </BrowserRouter>
    );

}
