import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';

import logo from '../assets/img/logo.svg';
import './Home.css';

import api from '../services/api';
import Loading from '../components/Loading';


export default function Home({ history }) {

    const [playlists, setPlaylists] = useState([]);
    const [usuario, setUsuario] = useState({});
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {

        async function getUser() {
            const response = await api.get('/Usuario');
            setUsuario(response.data.data);
        }

        async function loadTopPlaylists() {
            const response = await api.get('/Playlist');
            setPlaylists(response.data.data);
            setLoaded(true);
        }

        getUser();
        loadTopPlaylists();

    }, [])

    function openPlaylist(id_playlist) {
        history.push('/playlist/' + id_playlist);
    }

    return (
        <div className='container-area'>
            {usuario.st_nome && (
                <div className="area-busca animate-up-opacity">
                    <h1>Para você, {usuario.st_nome}!</h1>
                </div>
            )}

            <div className='listagem'>
                {loaded ? (

                    <div>
                        {playlists !== undefined && playlists.length > 0 && (

                            <ul>

                                {playlists.map(playlist => (

                                    <li className="" key={playlist.id_playlist} onClick={() => openPlaylist(playlist.id_playlist)}>
                                        <div className="capa">
                                            <img src={playlist.st_capa} />
                                        </div>

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

                ) : (<Loading></Loading>)}

            </div>
        </div>
    );

}