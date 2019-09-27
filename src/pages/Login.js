import React, { useState, useEffect } from 'react';
import './Login.css'

import logo from '../assets/img/logo.png';
import api from '../services/api.js';

export default function Login({ history }) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [logging, setLogging] = useState(false);
    const [erroLogin, setErroLogin] = useState('');

    useEffect(() => {
        localStorage.removeItem("st_token");
        localStorage.removeItem("id_usuario");
    }, [])

    async function handleSumbmit(e) {
        e.preventDefault();

        setLogging(true);
        setErroLogin('');

        await api.post('/Login', {
            'st_login': username,
            'st_senha': password
        }).then(response => {

            async function setLocalStorage() {
                await localStorage.setItem('st_token', response.data.data.st_token);
                await localStorage.setItem('id_usuario', response.data.data.id_usuario);
            }

            setLocalStorage();
            window.location.href = "http://localhost:3000";

        }).catch(response => {
            setLogging(false);
            setErroLogin(response.response.data.message);
        });


    }

    return (
        <div className="container-login">

            <form className="form-login" onSubmit={handleSumbmit}>
                <img src={logo} alt="Group List" />
                <input type="text" placeholder="E-mail"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                ></input>
                <input type="password" placeholder="Senha"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}></input>
                <button type="submit">
                    {!logging ? (<span>Entrar</span>) : (<i className="fa fa-spinner loading-spinner fa-2x"></i>)}
                </button>
            </form>

            <div className={ erroLogin !== '' ? 'erro-box erro-box-show' : 'erro-box' }>{erroLogin}</div>
            <div><button onClick={() => history.push("/signup")} className="link-button">Não tenho uma conta.</button></div>


        </div>
    );

}
