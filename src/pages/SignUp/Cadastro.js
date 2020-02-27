import React, {useState} from 'react';
import SpotifyLogin from "react-spotify-login";

//Configuração
import {spotify} from "../../config/config";

//Componentes
import SuccesComponent from "../../components/Login/SuccessComponent";
import ValidateAcountComponent from "../../components/Login/ValidateAcountComponent";

//Services
import SignUpService from "../../services/SignUpService";
import UsuarioService from "../../services/UsuarioService";

export default function Cadastro({history}) {
    const [email, setEmail] = useState('');
    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const [repeatSenha, setRepeatSenha] = useState('');

    const [id_usuario, setIdUsuario] = useState("");

    const [logging, setLogging] = useState(false);
    const [signUpStatus, setSignUpStatus] = useState(false);
    const [finish, setFinish] = useState(false);
    const [erro, setErro] = useState('');

    function signUpBySpotify(response) {
        SignUpService.bySpotify(response).then(response => {
            localStorage.setItem('st_token', response.data.st_token);
            history.push("/");
        }).catch(erro => {
            setErro(erro.message);
        });
    }

    function activateAccount(code) {
        setLogging(true);
        UsuarioService.activate(code, id_usuario).then(response => {
            setFinish(true);
            setErro("");
        }).catch(erro => {
            setErro(erro.message);
        }).finally(() => {
            setLogging(false);
        });
    }

    function signUp(e) {
        e.preventDefault();

        if (senha !== repeatSenha) {
            setErro("As senhas se diferem entre si.");
            return false;
        }

        setLogging(true);

        SignUpService.signUp(email, senha, nome).then(response => {
            setIdUsuario(response.data.id_usuario);
            setSignUpStatus(true);
            setErro("");
        }).catch(erro => {
            setErro(erro.message);
        }).finally(() => {
            setLogging(false);
        })
    }


    return (

        <div className="container-center animate-up-opacity">

            {signUpStatus && !finish && (
                <ValidateAcountComponent
                    logging={logging}
                    buttonAction={(code) => activateAccount(code)}
                />
            )}

            {finish && (
                <SuccesComponent
                    titulo="Cadastro ativado com sucesso!"
                    buttonText="Acessar"
                    buttonAction={() => history.push("/login")}
                />
            )}

            {!signUpStatus && !finish && (
                <div className="w100">
                    <form onSubmit={signUp}>
                        <h1>Crie a sua conta!</h1>

                        <input
                            className="input-primary"
                            type="email"
                            required
                            placeholder="Seu e-mail"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />

                        <input
                            className="input-primary"
                            type="text"
                            required
                            placeholder="Seu nome"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                        />

                        <input
                            className="input-primary"
                            type="password"
                            required
                            placeholder="Uma senha"
                            value={senha}
                            onChange={e => setSenha(e.target.value)}
                        />

                        <input
                            className="input-primary"
                            type="password"
                            required
                            placeholder="Repita a senha"
                            value={repeatSenha}
                            onChange={e => setRepeatSenha(e.target.value)}
                        />

                        <button
                            type="submit"
                            className="button-primary">
                            {!logging ? (<span>Cadastrar</span>) : (
                                <i className="fa fa-spinner loading-spinner fa-2x"/>)}
                        </button>
                    </form>

                    <div className='btn-connect-spotify'>
                        <SpotifyLogin
                            clientId={spotify.clientId}
                            redirectUri={spotify.redirectUri}
                            onSuccess={signUpBySpotify}
                            onFailure={() => {
                            }}
                            scope={spotify.scopes}>
                            Entrar com o Spotify <i className='fab fa-spotify'/>
                        </SpotifyLogin>
                    </div>

                </div>
            )}

            <div className={erro !== '' ? 'erro-box erro-box-show' : 'erro-box'}>{erro}</div>

            <div>
                <button onClick={() => history.push("/login")} className="link-button">Já tenho uma conta.</button>
            </div>

        </div>

    )
}