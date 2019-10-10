import React from 'react';

export default function RecoverySend({history, match}) {

    return (
        <div className="container-center animate-up-opacity">

            <div>
                <h1>Email de recuperação Enviado! 📬</h1>
                <button onClick={() => history.push("/login")} type="submit" className="button-green">
                    Acessar o Group Playlist
                </button>
            </div>
        </div>

    )
}