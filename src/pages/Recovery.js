import React, {useState} from 'react';
import Api from "../services/api";
import './Login.css';

export default function Recovery({history}) {

    const [email, setEmail] = useState('');
    const [erro, setErro] = useState('');
    const [countNotActivate, setCountNotActivate] = useState(false);
    const [emailresend, setEmailresend] = useState('');
    const [logging, setLogging] = useState(false);

    function sendActivateEmail() {
        if (emailresend) {
            Api.post('Usuario/' + emailresend + '/resendEmail');
        } else {
            setCountNotActivate(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setLogging(true)

        setErro('');
        setCountNotActivate(false);
        setEmailresend('');

        var datacadastro = {
            'st_login': email
        };

        Api.post('/recovery', datacadastro).then(response => {
            history.push('/recovery/send');
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

                <h1>Recupere a sua senha!</h1>

                <input type="email" required placeholder="Seu e-mail"
                       value={email}
                       onChange={e => setEmail(e.target.value)}/>

                <button type="submit">
                     {!logging ? (<span>Enviar e-mail para recuperação.</span>) : (<i className="fa fa-spinner loading-spinner fa-2x"></i>)}
                </button>
            </form>

            <div className={erro !== '' ? 'erro-box erro-box-show' : 'erro-box'}>{erro}</div>
            <div className={countNotActivate ? 'erro-box erro-box-show' : 'erro-box'}>Este e-mail já foi cadastrado mas
                ainda não foi ativado.<br/>
                <button onClick={() => sendActivateEmail()}>Clique aqui para receber um novo link de ativação</button>
            </div>

            <div>
                <button onClick={() => history.push("/login")} className="link-button">Acessar minha conta.</button>
            </div>

        </div>
    )

}