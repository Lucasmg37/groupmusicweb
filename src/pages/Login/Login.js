import React, {useState, useEffect} from 'react';
import './Login.css'

import logo from '../../assets/img/logo.png';

import SpotifyLogin from "react-spotify-login";
import LoginService from "../../services/LoginService";
import UsuarioService from "../../services/UsuarioService";
import {spotify} from "../../config/config";

export default function Login({history}) {

    const [id_usuario, setIdUsuario] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [logging, setLogging] = useState(false);
    const [erroLogin, setErroLogin] = useState('');
    const [countNotActivate, setCountNotActivate] = useState(false);

    function loginBySpotifySuccess(response) {
        LoginService.loginBySpotify(response).then(response => {
                localStorage.setItem('st_token', response.data.st_token);
                window.location.href = "http://localhost:3000";
            }
        ).catch(error => {
            setErroLogin(error.message);
        });

    }

    function sendActivateEmail() {
        UsuarioService.resendEmailActivate(id_usuario).then(() => {
            setErroLogin("Email reenviado!");
            setCountNotActivate("");
        }).catch(error => {
            setErroLogin(error.message)
        });
    }

    //Verifica a sessão e realiza o login
    useEffect(() => {
        const st_token = localStorage.getItem("st_token");
        if (st_token) {
            window.location.href = "http://localhost:3000";
        }
    }, []);

    function login(e) {
        e.preventDefault();
        setLogging(true);

        LoginService.login(username, password).then(response => {
            localStorage.setItem('st_token', response.data.st_token);
            window.location.href = "http://localhost:3000";
        }).catch(error => {
            setErroLogin(error.message);

            if (error.data && !error.data.bl_ativo) {
                setErroLogin('');
                setCountNotActivate(true);
                setIdUsuario(error.data.id_usuario);
            }

        }).finally(() => {
            setLogging(false);
        });

    }

    return (
        <div className="container-login animate-up-opacity">

            <form className="form-login" onSubmit={login}>
                <img src={logo} alt="Group List"/>

                <input
                    type="text" placeholder="E-mail"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />

                <input
                    type="password" placeholder="Senha"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <button type="submit">
                    {!logging ? (<span>Entrar</span>) : (<i className="fa fa-spinner loading-spinner fa-2x"/>)}
                </button>

            </form>

            <div className='btn-connect-spotify'>
                <SpotifyLogin
                    clientId={spotify.clientId}
                    redirectUri={spotify.redirectUri}
                    onSuccess={loginBySpotifySuccess}
                    onFailure={() => {
                    }}
                    scope={spotify.scopes}>
                    <span>Entrar com o Spotify <i className='fab fa-spotify'/></span>
                </SpotifyLogin>
            </div>

            <div className={erroLogin !== '' ? 'erro-box erro-box-show' : 'erro-box'}>{erroLogin}</div>

            <div className={countNotActivate ? 'erro-box erro-box-show' : 'erro-box'}>
                Enviamos um email de ativação para o seu email.<br/>
                <button onClick={() => sendActivateEmail()}>Clique aqui para receber um novo link de ativação</button>
            </div>

            <div>
                <button onClick={() => history.push("/signup")} className="link-button">Não tenho uma conta.</button>
            </div>

            <div>
                <button onClick={() => history.push("/recovery")} className="link-button">Esqueci a minha senha.
                </button>
            </div>

        </div>
    );

}
