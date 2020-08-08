import React, {useState, useEffect} from 'react';
import SpotifyLogin from "react-spotify-login";

import './Login.scss'

import logo from '../../assets/img/logo.png';
import {spotify} from "../../config/config";

import LoginService from "../../services/LoginService";
import UsuarioService from "../../services/UsuarioService";

import ValidateAcountComponent from "../../components/Login/ValidateAcountComponent";
import AlertLoginComponent from "../../components/Login/AlertLoginComponent";

export default function Login({history}) {

    const [id_usuario, setIdUsuario] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [logging, setLogging] = useState(false);
    const [alert, setAlert] = useState('');
    const [countNotActivate, setCountNotActivate] = useState(false);

    function loginBySpotifySuccess(response) {
        LoginService.loginBySpotify(response).then(response => {
                localStorage.setItem('st_token', response.data.st_token);
                window.location.href = "http://localhost:3000";
            }
        ).catch(error => {
            setAlert(error.message);
        });

    }

    function activateAccount(code) {
        setLogging(true);
        UsuarioService.activate(code, id_usuario).then(response => {
            setCountNotActivate(false);
            setAlert("");
        }).catch(erro => {
            setAlert(erro.message);
        }).finally(() => {
            setLogging(false);
        });
    }

    function sendActivateEmail() {
        UsuarioService.resendEmailActivate(id_usuario).then(() => {
            setAlert("Email reenviado!");
        }).catch(error => {
            setAlert(error.message);
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
            setAlert(error.message);

            if (error.data && !error.data.bl_ativo) {
                setAlert('');
                setCountNotActivate(true);
                setIdUsuario(error.data.id_usuario);
            }

        }).finally(() => {
            setLogging(false);
        });

    }

    return (
        <div className="container-center animate-up-opacity">

            {!countNotActivate && (
                <div>
                    <form className="w100" onSubmit={login}>
                        <img className="w100" src={logo} alt="Group List"/>

                        <input
                            className="input-primary"
                            type="text"
                            placeholder="E-mail"
                            required
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />

                        <input
                            className="input-primary"
                            type="password"
                            placeholder="Senha"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />

                        <button
                            className="button-primary"
                            type="submit">
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

                    <AlertLoginComponent
                        text={alert}
                    />

                    <div className="group-button-login mt-20">
                        <button onClick={() => history.push("/signup")} className="link-button">Não tenho uma conta.
                        </button>
                        <button onClick={() => history.push("/recovery")} className="link-button">Esqueci a minha senha.
                        </button>
                    </div>

                </div>
            )}

            {countNotActivate && (
                <div>
                    <ValidateAcountComponent
                        logging={logging}
                        info="Enviamos um email de ativação para o seu email."
                        buttonAction={(code) => activateAccount(code)}
                    />

                    <button
                        onClick={() => sendActivateEmail()}
                        className="button-secundary"
                    >Receber novo código
                    </button>

                    <AlertLoginComponent
                        text={alert}
                    />

                    <div className="group-button-login mt-20">
                        <button onClick={() => {
                            setCountNotActivate(false);
                            setAlert("");
                        }} className=" link-button">Cancelar
                        </button>
                    </div>

                </div>
            )}

        </div>
    );

}
