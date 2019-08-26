import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';

import logo from '../assets/img/logo.svg';
import './Home.css';

import api from '../services/api';


export default function Home({ history }) {

    const [playlists, setPlaylists] = useState([]);
    const [usuario, setUsuario] = useState({});

    useEffect(() => {

        async function getUser() {
            const response = await api.get('/Usuario');
            setUsuario(response.data.data);
        }

        async function loadTopPlaylists() {
            const response = await api.get('/Playlist');
            setPlaylists(response.data.data);
        }

        getUser();
        loadTopPlaylists();

    }, [])

    function openPlaylist(id_playlist) {
        history.push('/playlist/' + id_playlist);
    }

    return (
        <div className='container-area'>
            <div className="area-busca">
                <h1>Para você, {usuario.st_nome}!</h1>
            </div>

            <div className='listagem'>

                {playlists !== undefined  && playlists.length > 0 && (

                    <ul>

                        {playlists.map(playlist => (

                            <li key={playlist.id_playlist} onClick={() => openPlaylist(playlist.id_playlist)}>
                                <img src={playlist.st_capa} />
                                <div className='footer'>
                                    <strong>{playlist.st_nome}</strong>
                                    <p>Criada em <Moment format="DD/MM/YYYY">{playlist.dt_create}</Moment>
                                    </p>

                                </div>
                            </li>

                        ))}

                    </ul>
                )}
            </div>

        </div>
    );

}