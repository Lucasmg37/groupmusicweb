import React, {useEffect, useState} from 'react';
import SpotifyLogin from 'react-spotify-login';
import "../services/api";
import api from '../services/api';
import "./Perfil.css";
import Toggle from "../components/Toggle";


export default function Perfil(props) {

    const clientId = "b79a6f7b9eda475da08cd7d365b306c6";
    const redirectUri = "http://localhost:3000/Perfil/";
    const scopes = "user-read-private user-read-email user-read-recently-played user-top-read user-library-read user-library-modify user-read-playback-state user-read-currently-playing user-modify-playback-state playlist-read-collaborative playlist-modify-private playlist-modify-public playlist-read-private streaming app-remote-control";

    const [bl_sincronizaclone, setBl_sincronizaclone] = useState(false);
    const [id_config, setId_config] = useState('');
    const [bl_atualizaspotify, setBl_atualizaspotify] = useState(false);
    const [bl_buscamudancasspotify, setBl_buscamudancasspotify] = useState(false);
    const [bl_deleteplaylistspotify, setBl_deleteplaylistspotify] = useState(false);

    useEffect(() => {

        async function verificaIntegracao() {

            await api.get('/Usuario/getConfig').then(response => {
                setBl_sincronizaclone(response.data.data.bl_sincronizaclone);
                setBl_atualizaspotify(response.data.data.bl_atualizaspotify);
                setId_config(response.data.data.id_config);
                setBl_buscamudancasspotify(response.data.data.bl_buscamudancasspotify);
                setBl_deleteplaylistspotify(response.data.data.bl_deleteplaylistspotify);
            });

        }

        verificaIntegracao();

    }, []);


    const onSuccess = async function (response) {
        await api.post("/Integracao", response);
        props.setUsuario();
    };

    const onFailure = function (response) {

    };

    const saveConfigsIntegracao = () => {
        api.post("/Usuario/saveConfig", {
            id_config,
            bl_atualizaspotify,
            bl_buscamudancasspotify,
            bl_sincronizaclone,
            bl_deleteplaylistspotify
        })
    };

    async function desconectSpotify() {
        await api.delete("/Integracao");
        props.setUsuario();
    }

    return (
        <div>
            {+props.usuario.bl_integracao === 0 ? (
                <div className="connect-spotify">
                    <SpotifyLogin clientId={clientId}
                                  redirectUri={redirectUri}
                                  onSuccess={onSuccess}
                                  onFailure={onFailure}
                                  scope={scopes}
                                  buttonText="Conectar ao Spotify"/>
                </div>
            ) : (
                <div className="connect-spotify">
                    <button className="btn-connected" disabled>Você está conectado ao Spotify</button>
                </div>
            )}

            {props.usuario.bl_integracao && (
                <div className="perfil-area">

                    <h2>Integração com Spotify</h2>

                    <div className="input-toggle">
                        <Toggle
                            name="bl_sincronizaclone"
                            onChangeFunction={() => setBl_sincronizaclone(!bl_sincronizaclone)}
                            checked={bl_sincronizaclone}
                        />
                        <label for="bl_sincronizaclone">Sincronizar playlists clonadas automáticamente.</label>
                    </div>

                    <div className="input-toggle">
                        <Toggle
                            name="bl_atualizaspotify"
                            onChangeFunction={() => setBl_atualizaspotify(!bl_atualizaspotify)}
                            checked={bl_atualizaspotify}
                        />
                        <label for="bl_atualizaspotify">Atualizar playlists sincronizadas do spotify
                            automáticamente</label>
                    </div>

                    <div className="input-toggle">
                        <Toggle
                            name="bl_buscamudancasspotify"
                            onChangeFunction={() => setBl_buscamudancasspotify(!bl_buscamudancasspotify)}
                            checked={bl_buscamudancasspotify}
                        />
                        <label for="bl_buscamudancasspotify">Buscar mudanças em playlists do spotify
                            automáticamente</label>
                    </div>

                    {/*<div className="input-toggle">*/}
                    {/*<Toggle*/}
                    {/*name="bl_deleteplaylistspotify"*/}
                    {/*onChangeFunction={() => setBl_deleteplaylistspotify(!bl_deleteplaylistspotify)}*/}
                    {/*checked={bl_deleteplaylistspotify}*/}
                    {/*/>*/}
                    {/*<label for="bl_buscamudancasspotify">Deletar playlist do Spotify.</label>*/}
                    {/*</div>*/}

                    <div onClick={desconectSpotify}>
                        <button className="desconect-spotify"> Desconectar Spotify</button>
                    </div>
                    <div>
                        <button onClick={saveConfigsIntegracao} className="button-primary"> Salvar configurações
                        </button>
                    </div>

                </div>
            )}
        </div>
    );

}