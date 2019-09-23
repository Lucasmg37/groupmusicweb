import React, { useState, useEffect } from 'react';
import './NewMusic.css';
import api from '../services/api';
import Loading from '../components/Loading';
export default function NewMusic({ match }) {

    const [musics, setMusics] = useState([]);
    const [loaded, setloaded] = useState(false);

    useEffect(() => {
        async function getTopMusics() {
            const response = await api.get("/Usuario/null/getTopTracks");
            setMusics(response.data.data);
            setloaded(true);
        }

        getTopMusics();

    }, [])

    async function addMusic(id_music) {
        const response = await api.post('/Music/', {
            'id_spotify': id_music,
            'id_playlist': match.params.id_playlist
        });

        setMusics(musics.filter(music => music.id_spotify !== id_music));

    }

    async function buscaMusica(source) {
        setloaded(false);
        const response = await api.get('/Musics/' + source);
        setMusics(response.data.data);
        setloaded(true);
    }

    return (
        <div className="container-area">
            <div className="area-busca">
                <h1>Adicione músicas</h1>
                <input
                    type="text"
                    placeholder="Escreva o nome de sua música"
                    onKeyUp={e => buscaMusica(e.target.value)} />
            </div>
            <div>
                {loaded ? (
                    <div>
                        {musics ? (
                            <div className="list-playlist">

                                <ul>
                                    {musics.map(music => (
                                        <li>
                                            <img src={music.st_urlimagem} />
                                            <div className="info-music">
                                                <strong>{music.st_nome}</strong>
                                                <p>Artista: {music.st_artista}</p>
                                                <p>Album: {music.st_album}</p>
                                            </div>
                                            <div className="actions-buttons">
                                                <button onClick={() => addMusic(music.id_spotify)}>Adiconar</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                            </div>

                        ) : (
                                <div className="empty-response">Sem resultados!</div>
                            )}
                    </div>
                ) : (
                        <Loading></Loading>
                    )}
            </div>
        </div>
    );

}