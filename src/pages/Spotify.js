import React, {useState, useEffect} from 'react';
import api from '../services/api';
import Loading from '../components/Loading';

export default function Spotify() {

    const [musicsPlaylist, setMusicsPlaylist] = useState([]);
    const [loaded, setLoaded] = useState(false);

    async function sincrinizarSpotifyToList(id) {

        setMusicsPlaylist(musicsPlaylist.map(music => {
            if (music.id === id) {
                music.bl_sincronizing = 1;
            }
            return music;
        }, id));

        const response = await api.post("/Playlist/getPlaylistSpotify/" + id);

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
            const response = await api.get("/Playlist/getSpotify");
            setMusicsPlaylist(response.data.data);
            setLoaded(true);
        }

        loadPlaylist();

    }, []);


    return (
        <div className="container-area">
            <div className="area-busca">
                <h1>Suas Playlists do Spotify</h1>
            </div>

            {loaded ? (
                <div className="list-playlist">
                    {musicsPlaylist.length > 0 ? (
                        <ul>
                            {musicsPlaylist.map(music => (
                                <li key={music.id}>
                                    <img src={music.image}/>
                                    <div className="info-music">
                                        <strong>{music.name}</strong>
                                    </div>

                                    <div className="actions-buttons">
                                        {+music.bl_sincronizado === 1 ? (
                                            <div/>
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
                    ) : (<div className="empty-response">Nenhuma playlist encontrada :)</div>)}
                </div>
            ) : (
                <Loading></Loading>
            )}


        </div>
    );

}

