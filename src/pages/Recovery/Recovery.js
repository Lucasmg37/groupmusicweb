import React, {useState} from 'react';

//Services
import UsuarioService from "../../services/UsuarioService";

//Componentes
import SuccesComponent from "../../components/Login/SuccessComponent";

export default function Recovery({history}) {

    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [senha, setSenha] = useState('');
    const [senhaConfirm, setSenhaConfirm] = useState('');

    const [erro, setErro] = useState('');
    const [logging, setLogging] = useState(false);
    const [step, setStep] = useState(0);

    function sendEmail(e) {
        e.preventDefault();
        setLogging(true);
        UsuarioService.recoveryPassword(email).then(() => {
            setStep(1);
        }).catch(erro => {
            setErro(erro.message);
        }).finally(() => {
            setLogging(false);
        });
    }

    function salvarNovaSenha(e) {
        e.preventDefault();
        setErro("");

        if (senha !== senhaConfirm) {
            setErro("Senhas diferem entre si!");
            return false;
        }

        setLogging(true);

        UsuarioService.validateRecovery(email, code, senha).then(() => {
            setStep(2);
        }).catch(erro => {
            setErro(erro.message);
        }).finally(() => {
            setLogging(false);
        })

    }

    return (
        <div className="container-center animate-up-opacity">

            {step === 0 && (
                <form onSubmit={sendEmail}>
                    <h1>Recupere a sua senha!</h1>
                    <input
                        className="input-primary"
                        type="email"
                        required
                        placeholder="Seu e-mail"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="button-primary"
                    >
                        {!logging ? (<span>Enviar e-mail para recuperação.</span>) : (
                            <i className="fa fa-spinner loading-spinner fa-2x"/>)}
                    </button>
                </form>
            )}

            {step === 1 && (
                <form onSubmit={salvarNovaSenha}>
                    <h1>Recupere a sua senha!</h1>
                    <p className="p-login">Enviamos um código de verificação em seu email. Informe-o para continuar com
                        o processo!</p>
                    <input
                        type="text"
                        className="input-primary"
                        required
                        placeholder="Código de verificação"
                        value={code}
                        onChange={e => setCode(e.target.value)}
                    />

                    {code.length >= 6 && (
                        <div>
                            <input
                                type="password"
                                className="input-primary"
                                required
                                placeholder="Nova Senha"
                                value={senha}
                                onChange={e => setSenha(e.target.value)}
                            />

                            <input
                                type="password"
                                className="input-primary"
                                required
                                placeholder="Confirme a Senha"
                                value={senhaConfirm}
                                onChange={e => setSenhaConfirm(e.target.value)}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="button-primary">
                        {!logging ? (<span>Salvar</span>) : (
                            <i className="fa fa-spinner loading-spinner fa-2x"/>)}
                    </button>
                </form>
            )}

            {step === 2 && (
                <SuccesComponent
                    titulo="Senha alterada com sucesso!"
                    buttonText="Acessar"
                    buttonAction={() => history.push("/login")}
                />
            )}

            <div className={erro !== '' ? 'erro-box erro-box-show' : 'erro-box'}>{erro}</div>

            {step > 0 && (
                <div>
                    <button onClick={() => setStep(step - 1)} className="link-button">Voltar</button>
                </div>
            )}

            <div>
                <button onClick={() => history.push("/login")} className="link-button">Acessar minha conta</button>
            </div>

        </div>
    )

}