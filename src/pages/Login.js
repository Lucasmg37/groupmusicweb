import React, {useState, useEffect} from 'react';
import './Login.css'

import logo from '../assets/img/logo.png';
import api from '../services/api.js';
import SpotifyLogin from "react-spotify-login";

export default function Login({history}) {

    const clientId = "b79a6f7b9eda475da08cd7d365b306c6";
    const redirectUri = "http://localhost:3000/Perfil/";
    const scopes = "user-read-private user-read-email user-read-recently-played user-top-read user-library-read user-library-modify user-read-playback-state user-read-currently-playing user-modify-playback-state playlist-read-collaborative playlist-modify-private playlist-modify-public playlist-read-private streaming app-remote-control";

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [logging, setLogging] = useState(false);
    const [erroLogin, setErroLogin] = useState('');
    const [emailresend, setEmailresend] = useState('');
    const [countNotActivate, setCountNotActivate] = useState(false);

    const onSuccess = async function (response) {

        setErroLogin('');

        await api.post("/Spotify/Login/LoginBySpotify", response).then(response => {

            async function setLocalStorage() {

                //Buscar configurações do usuário
                await localStorage.setItem('st_token', response.data.data.st_token);
                await localStorage.setItem('id_usuario', response.data.data.id_usuario);
            }

            setLocalStorage();
            window.location.href = "http://localhost:3000";

        }).catch(erro => {

            if (+erro.response.data.erro.code === 1) {
                setCountNotActivate(true);
                setEmailresend(username);
            } else {
                setErroLogin(erro.response.data.erro.message);
            }

        });
    };

    const onFailure = function (response) {

    };


    function sendActivateEmail() {
        if (emailresend) {
            api.post('Usuario/' + emailresend + '/resendEmail');
        } else {
            setCountNotActivate(false);
        }
    }


    useEffect(() => {
        localStorage.removeItem("st_token");
        localStorage.removeItem("id_usuario");
    }, []);

    async function handleSumbmit(e) {
        e.preventDefault();

        setLogging(true);
        setErroLogin('');
        setCountNotActivate(false);
        setEmailresend('');

        await api.post('/Login', {
            'st_email': username,
            'st_senha': password
        }).then(response => {

            async function setLocalStorage() {

                //Buscar configurações do usuário
                await localStorage.setItem('st_token', response.data.data.st_token);
                await localStorage.setItem('id_usuario', response.data.data.id_usuario);
            }

            setLocalStorage();
            window.location.href = "http://localhost:3000";

        }).catch(response => {

            setLogging(false);

            if (+response.response.data.code === 1) {
                setCountNotActivate(true);
                setEmailresend(username);
            } else {
                setErroLogin(response.response.data.message);
            }

        });


    }

    return (
        <div className="container-login animate-up-opacity">

            <form className="form-login" onSubmit={handleSumbmit}>
                <img src={logo} alt="Group List"/>

                <input type="text" placeholder="E-mail"
                       required
                       value={username}
                       onChange={e => setUsername(e.target.value)}
                />

                <input type="password" placeholder="Senha"
                       required
                       value={password}
                       onChange={e => setPassword(e.target.value)}/>

                <button type="submit">
                    {!logging ? (<span>Entrar</span>) : (<i className="fa fa-spinner loading-spinner fa-2x"/>)}
                </button>

            </form>

            <div className='btn-connect-spotify'>
                <SpotifyLogin clientId={clientId}
                              redirectUri={redirectUri}
                              onSuccess={onSuccess}
                              onFailure={onFailure}
                              scope={scopes}
                >Entrar com o Spotify <i className='fab fa-spotify'/></SpotifyLogin>
            </div>

            <div className={erroLogin !== '' ? 'erro-box erro-box-show' : 'erro-box'}>{erroLogin}</div>

            <div className={countNotActivate ? 'erro-box erro-box-show' : 'erro-box'}>Enviamos um email de ativação para
                o seu email.<br/>
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
