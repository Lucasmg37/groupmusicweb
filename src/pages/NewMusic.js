import React, { useState } from 'react';
import './NewMusic.css';
import api from '../services/api';
export default function NewMusic({ match }) {

    const [st_music, setSt_music] = useState('');
    const [musics, setMusics] = useState([]);

    async function handleSource(e) {
        e.preventDefault();

        const response = await api.get('/Musics/' + st_music);

        setMusics(response.data.data);
    }

    async function addMusic(id_music) {
        const response = await api.post('/Music/', {
            'id_spotify': id_music,
            'id_playlist': match.params.id_playlist
        });

        setMusics(musics.filter(music => music.id_spotify !== id_music));

    }

    async function buscaMusica(source) {

        const response = await api.get('/Musics/' + source);
        setMusics(response.data.data);

    }

    return (
        <div className="container-area">
            <div className="area-busca">
                <h1>Adicione músicas</h1>
                <input
                    type="text"
                    onKeyUp={e => buscaMusica(e.target.value)} />
            </div>
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
        </div>
    );

}