import React, {useState, useEffect} from 'react';
import './Login.css'

import logo from '../assets/img/logo.svg';
import api from '../services/api.js';

export default function Login( {history} ){

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect( () => {
        localStorage.removeItem("st_token");
        localStorage.removeItem("id_usuario");
    }, [])

    async function handleSumbmit(e){
        e.preventDefault();
    
        const response = await api.post('/Login', {
            'st_login' : username,
            'st_senha' :  password
        });

        async function setLocalStorage(){
            await localStorage.setItem('st_token', response.data.data.st_token);
            await localStorage.setItem('id_usuario', response.data.data.id_usuario);
        }
        setLocalStorage();
        
        window.location.href = "http://localhost:3000";
    }

    return (
        <div className="container-login">
           
            <form className="form-login" onSubmit={handleSumbmit}>
            <img src={logo} alt="Group List" />
            <input type="text" placeholder="Nome de usuário"
                value={username}
                onChange={ e => setUsername (e.target.value) }
            ></input>
            <input type="password" placeholder="Senha"
            value={password}
            onChange={ e => setPassword(e.target.value)}></input>
            <button type="submit">Entrar</button>
            </form>
        </div>
    );

}
