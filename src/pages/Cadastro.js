import React, { useState } from 'react';
import Api from '../services/api';
import api from '../services/api';

export default function Cadastro({ history }) {

    const [email, setEmail] = useState('');
    const [emailresend, setEmailresend] = useState('');
    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const [repeatSenha, setRepeatSenha] = useState('');
    const [erro, setErro] = useState('');
    const [countNotActivate, setCountNotActivate] = useState(false);

    
    function sendActivateEmail(){
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
        }

        api.post('/signup', datacadastro).then(response => {
            history.push('/signup/success');
        }).catch(response => {
            if (+response.response.data.erro.code === 1 ) {
                setCountNotActivate(true);
                setEmailresend(email);
            } else {
                setErro(response.response.data.erro.message);
            }
        })

    }

    return (

        <div className="container-login">

            <form className="form-login" onSubmit={handleSubmit}>

                <h1>Crie a sua conta!</h1>

                <input type="email" required placeholder="Seu e-mail"
                    value={email}
                    onChange={e => setEmail(e.target.value)} ></input>

                <input type="text" required placeholder="Seu nome"
                    value={nome}
                    onChange={e => setNome(e.target.value)} ></input>

                <input type="password" required placeholder="Uma senha"
                    value={senha}
                    onChange={e => setSenha(e.target.value)} ></input>

                <input type="password" required placeholder="Repita a senha"
                    value={repeatSenha}
                    onChange={e => setRepeatSenha(e.target.value)} ></input>

                <button type="submit">
                    Cadastrar
                {/* {!logging ? (<span>Entrar</span>) : (<i className="fa fa-spinner loading-spinner fa-2x"></i>)} */}
                </button>
            </form>

            <div className={erro !== '' ? 'erro-box erro-box-show' : 'erro-box'}>{erro}</div>
            <div className={countNotActivate ? 'erro-box erro-box-show' : 'erro-box'}>Este e-mail já foi cadastrado mas ainda não foi ativado.<br/>
            <button onClick={() => sendActivateEmail() } >Clique aqui para receber um novo link de ativação</button>
            </div>

            <div><button onClick={() => history.push("/login")} className="link-button">Já tenho uma conta.</button></div>

        </div>

    )
}