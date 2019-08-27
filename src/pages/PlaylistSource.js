import React, { useState, useEffect } from "react";
import Moment from "react-moment";
import api from "../services/api";
import Loading from "../components/Loading";

export default function PlaylistSource() {

    const [playlists, setPlaylists] = useState({});
    const [loaded, setLoaded] = useState(false);


    useEffect(() => {
        async function buscaTopPlaylists() {
            const response = await api.get("Acesso/null/getTopPlaylists");
            setPlaylists(response.data.data);
            setLoaded(true);
        }

        buscaTopPlaylists();

    }, [])

    async function buscaPlaylist(search) {
        const response = await api.get("Playlist/null/getByName?search=" + search);
        setPlaylists(response.data.data);
    }

    return (
        <div>
            <div className="container-area">
                <div className="area-busca">
                    <h1>Descubra novas playlists</h1>
                    <input
                    placeholder="Digite aqui um nome de playlist"
                        type="text"
                        onKeyUp={e => buscaPlaylist(e.target.value)} />
                </div>
            </div>

            {loaded ? (
                <div className="list-playlist">
                    {playlists !== undefined && playlists.length > 0 ? (
                        <ul>
                            {playlists.map(playlist => (
                                <li key={playlist.id_playlist} >
                                    <img src={playlist.st_capa} />
                                    <div className="info-music">
                                        <strong>{playlist.st_nome}</strong>
                                        <p>Data de criação: <Moment format="DD/MM/YYYY">{playlist.dt_create}</Moment><br />
                                            Criada por: {playlist.st_nomeusuario} <br />
                                            Número de músicas: {playlist.nu_music} <br />
                                            {playlist.bl_sincronizado && (<span>Disponível no Spotify <i className="fab fa-spotify"></i></span>)}

                                        </p>
                                    </div>

                                    <div className="info-icons">
                                        <i className="fa fa-ellipsis-v fa-2x"></i>
                                    </div>

                                </li>
                            ))}
                        </ul>
                    ) : (<div className="empty-response">Nenhuma playlist encontrada!</div>)}

                </div>
            ) : (
                    <Loading></Loading>
                )}



        </div>
    );

}