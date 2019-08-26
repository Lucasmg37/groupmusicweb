import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Spotify() {

    const [musicsPlaylist, setMusicsPlaylist] = useState([]);

    async function sincrinizarSpotifyToList(id) {

        setMusicsPlaylist(musicsPlaylist.map(music => {
            if (music.id === id) {
                music.bl_sincronizing = 1;
            }
            return music;
        }, id))

        const response = await api.post("/Spotify/" + id + "/playlistSpotifyToList");

        setMusicsPlaylist(musicsPlaylist.map(music => {
            if (music.id === id) {
                music.bl_sincronizing = 0;
                music.bl_sincronizado = +response.data.status;
            }
            return music;
        }, id, response.data.status))

    }

    useEffect(() => {

        async function loadPlaylist() {
            const response = await api.get("/Spotify/NULL/getPlaylistsSpotifybyUser");
            setMusicsPlaylist(response.data.data);
        }

        loadPlaylist();

    }, [])


    return (
        <div className="container-area">

            <div className="area-busca">
                <h1>Suas Playlist do Spotify</h1>
            </div>


            <div className="list-playlist">
                {musicsPlaylist.length > 0 ? (
                    <ul>
                        {musicsPlaylist.map(music => (
                            <li key={music.id_musicplaylist}>
                                <img src={music.images[0].url} />
                                <div className="info-music">
                                    <strong>{music.name}</strong>
                                </div>

                                <div className="actions-buttons">
                                    {music.bl_sincronizado == 1 ? (
                                        <div></div>
                                    ) : (
                                            (
                                                <button onClick={() => sincrinizarSpotifyToList(music.id)}>
                                                    {+music.bl_sincronizing === 1 ? (
                                                        <span><i className="fa fa-sync animate-rotate"></i> Sincronizando</span>
                                                    ) : (
                                                            <span> <i className="fa fa-sync"></i> Sincronizar</span>
                                                        )}
                                                </button>
                                            )
                                        )}

                                </div>

                            </li>
                        ))}
                    </ul>
                ) : (<div className="empty-response">Nenhuma música nesta playlist!</div>)}

            </div>

        </div>
    );

}

