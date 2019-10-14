import React, {useState} from 'react';
import Api from '../services/api';
import api from '../services/api';
import SpotifyLogin from "react-spotify-login";

export default function Cadastro({history}) {

    const clientId = "b79a6f7b9eda475da08cd7d365b306c6";
    const redirectUri = "http://localhost:3000/Perfil/";
    const scopes = "user-read-private user-read-email user-read-recently-played user-top-read user-library-read user-library-modify user-read-playback-state user-read-currently-playing user-modify-playback-state playlist-read-collaborative playlist-modify-private playlist-modify-public playlist-read-private streaming app-remote-control";

    const [email, setEmail] = useState('');
    const [emailresend, setEmailresend] = useState('');
    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const [repeatSenha, setRepeatSenha] = useState('');
    const [erro, setErro] = useState('');
    const [countNotActivate, setCountNotActivate] = useState(false);
    const [logging, setLogging] = useState(false);


    const onSuccess = async function (response) {

        setErro('');

        console.log(response);

        await api.post("/Spotify/Login/SignInBySpotify", response).then(() => {
            history.push('/signup/success');
        }).catch(erro => {
            if (+erro.response.data.erro.code === 1) {
                setCountNotActivate(true);
                setEmailresend(email);
            } else {
                setErro(erro.response.data.erro.message);
            }
        });
    };

    const onFailure = function (response) {

    };


    function sendActivateEmail() {
        if (emailresend) {
            Api.post('Usuario/' + emailresend + '/resendEmail');
        } else {
            setCountNotActivate(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setErro('');
        setCountNotActivate(false);
        setEmailresend('');

        //Verificar a senha
        if (senha !== repeatSenha) {
            setErro("As senhas se diferem entre si.");
            return false;
        }

        var datacadastro = {
            'st_login': email,
            'st_senha': senha,
            'st_nome': nome
        };

        setLogging(true);

        api.post('/signup', datacadastro).then(response => {
            history.push('/signup/success');
        }).catch(response => {

            setLogging(false);

            if (+response.response.data.erro.code === 1) {
                setCountNotActivate(true);
                setEmailresend(email);
            } else {
                setErro(response.response.data.erro.message);
            }
        })

    }

    return (

        <div className="container-login animate-up-opacity">

            <form className="form-login" onSubmit={handleSubmit}>

                <h1>Crie a sua conta!</h1>

                <input type="email" required placeholder="Seu e-mail"
                       value={email}
                       onChange={e => setEmail(e.target.value)}/>

                <input type="text" required placeholder="Seu nome"
                       value={nome}
                       onChange={e => setNome(e.target.value)}/>

                <input type="password" required placeholder="Uma senha"
                       value={senha}
                       onChange={e => setSenha(e.target.value)}/>

                <input type="password" required placeholder="Repita a senha"
                       value={repeatSenha}
                       onChange={e => setRepeatSenha(e.target.value)}/>

                <button type="submit">

                    {!logging ? (<span>Cadastrar</span>) : (<i className="fa fa-spinner loading-spinner fa-2x"></i>)}
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


            <div className={erro !== '' ? 'erro-box erro-box-show' : 'erro-box'}>{erro}</div>
            <div className={countNotActivate ? 'erro-box erro-box-show' : 'erro-box'}>Este e-mail já foi cadastrado mas
                ainda não foi ativado.<br/>
                <button onClick={() => sendActivateEmail()}>Clique aqui para receber um novo link de ativação</button>
            </div>

            <div>
                <button onClick={() => history.push("/login")} className="link-button">Já tenho uma conta.</button>
            </div>

        </div>

    )
}