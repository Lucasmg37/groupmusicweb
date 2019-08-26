import React, { useEffect, useState } from 'react';
import SpotifyLogin from 'react-spotify-login';
import "../services/api";
import api from '../services/api';
import "./Perfil.css";
import Toggle from "../components/Toggle";


export default function Perfil({ match, props }) {

    const clientId = "b79a6f7b9eda475da08cd7d365b306c6";
    const redirectUri = "http://localhost:3000/Perfil/";
    // const redirectUri = "http://groupmusicapi.lucasjunior.com.br/SaveSpotify/"
    const scopes = "user-read-private user-read-email user-read-recently-played user-top-read user-library-read user-library-modify user-read-playback-state user-read-currently-playing user-modify-playback-state playlist-read-collaborative playlist-modify-private playlist-modify-public playlist-read-private streaming app-remote-control";

    const [integracao, setIntegracao] = useState({});
    const [bl_sincronizaclone, setBl_sincronizaclone] = useState(false);
    const [id_config, setId_config] = useState('');
    const [bl_atualizaspotify, setBl_atualizaspotify] = useState(false);
    const [bl_buscamudancasspotify, setBl_buscamudancasspotify] = useState(false);



    useEffect(() => {

        async function verificaIntegracao() {
            const response = await api.get('/Spotify/null/VerificaIntegracao');
            setIntegracao(response.data.data);

            await api.get('/Config').then(response => {
                setBl_sincronizaclone(response.data.data.bl_sincronizaclone);
                setBl_atualizaspotify(response.data.data.bl_atualizaspotify);
                setId_config(response.data.data.id_config);
                setBl_buscamudancasspotify(response.data.data.bl_buscamudancasspotify)
            });

        }

        verificaIntegracao();

    }, []);


    const onSuccess = async function (response) {
        await api.post("/Spotify", response);
    }

    const onFailure = function (response) {

    }

    const saveConfigsIntegracao = () => {
        api.post("/Config", {
            id_config,
            bl_atualizaspotify,
            bl_buscamudancasspotify,
            bl_sincronizaclone
        })
    }

    return (
        <div>
            {+integracao.bl_integracao === 0 ? (
                <div className="connect-spotify">
                    <SpotifyLogin clientId={clientId}
                        redirectUri={redirectUri}
                        onSuccess={onSuccess}
                        onFailure={onFailure}
                        scope={scopes}
                        buttonText="Conectar ao Spotify" />
                </div>
            ) : (
                    <div className="connect-spotify">
                        <button className="btn-connected" disabled >Você está conectado ao Spotify</button>
                    </div>
                )}

            <div className="perfil-area">

                <h2>Integração com Spotify</h2>

                <div className="input-toggle">
                    <Toggle
                        name="bl_sincronizaclone"
                        onChangeFunction={() => setBl_sincronizaclone(!bl_sincronizaclone)}
                        checked={bl_sincronizaclone}
                    ></Toggle>
                    <label for="bl_sincronizaclone">Sincronizar playlists clonadas automáticamente.</label>
                </div>

                <div className="input-toggle">
                    <Toggle
                        name="bl_atualizaspotify"
                        onChangeFunction={() => setBl_atualizaspotify(!bl_atualizaspotify)}
                        checked={bl_atualizaspotify}
                    ></Toggle>
                    <label for="bl_atualizaspotify">Atualizar playlists sincronizadas do spotify automáticamente</label>
                </div>

                <div className="input-toggle">
                    <Toggle
                        name="bl_buscamudancasspotify"
                        onChangeFunction={() => setBl_buscamudancasspotify(!bl_buscamudancasspotify)}
                        checked={bl_buscamudancasspotify}
                    ></Toggle>
                    <label for="bl_buscamudancasspotify">Buscar mudanças em playlists do spotify automáticamente</label>
                </div>
            
                <div> <button className="desconect-spotify"> Desconectar Spotify</button> </div>
                <div> <button onClick={saveConfigsIntegracao} className="button-primary"> Salvar configurações</button> </div>

            </div>
        </div>
    );

}