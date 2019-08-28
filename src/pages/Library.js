import React, { useState, useEffect } from "react";
import Moment from "react-moment";
import api from "../services/api";
import Loading from "../components/Loading";

export default function Library({ history }) {

    const [playlists, setPlaylists] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const editPlaylist = function (id_playlist) {
      //  history.push("/playlist/" + id_playlist);
    }

    useEffect(() => {

        async function loadPlaylist() {
            const response = await api.get("/Playlist/NULL/getPlaylistsUser");
            setPlaylists(response.data.data);
            setLoaded(true);
        }

        loadPlaylist();

    }, [])



    return (
        <div className="container-area">

            <div className="area-busca">
                <h1>Suas Playlists</h1>
            </div>

            {loaded ? (
                <div className="list-playlist">
                    {playlists !== undefined && playlists.length > 0 ? (
                        <ul>
                            {playlists.map(playlist => (
                                <li key={playlist.id_playlist} onClick={() => editPlaylist(playlist.id_playlist)}>
                                    <img src={playlist.st_capa} />
                                    <div className="info-music">
                                        <strong>{playlist.st_nome}</strong>
                                        <p>Data de criação: <Moment format="DD/MM/YYYY">{playlist.dt_create}</Moment><br />
                                            Número de músicas: {playlist.nu_music} <br />
                                            {playlist.bl_sincronizado && (<i className="fab fa-spotify"></i>)}
                                            {playlist.bl_privada ? (<i className="fa fa-lock"></i>) : (<i className="fa fa-unlock "></i>)}

                                        </p>
                                    </div>

                                    <div className="info-icons">
                                        <i className="fa fa-ellipsis-v fa-2x"></i>
                                    </div>

                                </li>
                            ))}
                        </ul>
                    ) : (<div className="empty-response">Você não tem playlists!</div>)}

                </div>

            ) : (
                    <Loading></Loading>
                )}


        </div>
    );

}