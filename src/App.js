import React from 'react';
// import { Link, Route, Router } from 'react-router';
import { BrowserRouter, Route, Switch, Router } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './App.css';
import Login from './pages/Login';
import Painel from './pages/Painel';
import Home from './pages/Home';
import Cadastro from './pages/Cadastro';

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" exact component={Login}></Route>
        <Route path="/signup" exact component={Cadastro}></Route>
        <Route path="/"  component={Painel}></Route>
      </Switch>
      
    </BrowserRouter>
  );

}
