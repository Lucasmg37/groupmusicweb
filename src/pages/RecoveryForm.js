import React, {useState, useEffect} from 'react';
import Api from '../services/api';
import api from '../services/api';

export default function RecoveryForm({history, match}) {

    const [email, setEmail] = useState('');
    const [emailresend, setEmailresend] = useState('');
    const [senha, setSenha] = useState('');
    const [repeatSenha, setRepeatSenha] = useState('');
    const [erro, setErro] = useState('');
    const [countNotActivate, setCountNotActivate] = useState(false);
    const [logging, setLogging] = useState(false);


    useEffect(() => {
        //Buscar usuário a altera a senha
        Api.get('/Recovery/' + match.params.hash).then(response => {
            setEmail(response.data.data.st_login);
        }).catch(() => {
            history.push('/login');
        })

    }, []);


    async function handleSubmit(e) {
        e.preventDefault();

        setErro('');
        setCountNotActivate(false);

        //Verificar a senha
        if (senha !== repeatSenha) {
            setErro("As senhas se diferem entre si.");
            return false;
        }

        var datacadastro = {
            'st_senha': senha,
        };

        setLogging(true);

        api.post('/Recovery/' + match.params.hash + '/saveRecovery', datacadastro).then(response => {
            history.push('/login');
        }).catch(response => {
            setLogging(false);
            setErro(response.response.data.erro.message);
        })

    }

    return (

        <div className="container-login animate-up-opacity">

            <form className="form-login" onSubmit={handleSubmit}>

                <h1>Altere a sua senha!</h1>

                <input type="email" required placeholder="Seu e-mail"
                       value={email}
                       disabled={true}/>

                <input type="password" required placeholder="Uma senha"
                       value={senha}
                       onChange={e => setSenha(e.target.value)}/>

                <input type="password" required placeholder="Repita a senha"
                       value={repeatSenha}
                       onChange={e => setRepeatSenha(e.target.value)}/>

                <button type="submit">
                    {!logging ? (<span>Salvar</span>) : (<i className="fa fa-spinner loading-spinner fa-2x"></i>)}
                </button>
            </form>

            <div className={erro !== '' ? 'erro-box erro-box-show' : 'erro-box'}>{erro}</div>

            <div>
                <button onClick={() => history.push("/login")} className="link-button">Não quero alterar minha senha.
                </button>
            </div>

        </div>

    )
}