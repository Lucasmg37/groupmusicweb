import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';

import api from '../services/api';
import './Playlist.css';
import Loading from '../components/Loading';
import PopUp from './PopUp';
import ListMedia from '../components/ListMedia';


export default function Playlist({ match, history }) {

    const [playlist, setPlaylist] = useState({});
    const [musicsPlaylist, setMusicsPlaylist] = useState([]);
    const [loadmusics, setLoadmusics] = useState(false);
    const [loadplaylist, setLoadPlaylist] = useState(false);

    const id_usuario = localStorage.getItem("id_usuario");

    async function desativaPlaylist(id_playlist) {
        await api.delete("/Playlist/" + id_playlist).then(response => {
            history.push("/");
        })
    }

    async function clonarPlaylist(id_musicplaylist) {
        await api.post("/Playlist/" + id_musicplaylist + "/clone").then(
            response => {
                history.push("/playlist/" + response.data.data.id_playlist);
            }
        );

    }

    async function playPlaylist(id_playlis) {
        await api.post("/Playlist/" + id_playlis + "/play").then(
            // response => {
            //     history.push("/playlist/" + response.data.data.id_playlist);
            // }
        );
    }

    function selectMusic(id_musicplaylist) {

        setMusicsPlaylist(musicsPlaylist.map(music => {
            if (+music.id_musicplaylist === +id_musicplaylist) {
                music.bl_selected = !music.bl_selected;
            }

            return music;

        }, id_musicplaylist))

    }

    async function removeMusicPlaylist(id_musicplaylist) {
        await api.delete("/Music/" + id_musicplaylist);
        setMusicsPlaylist(musicsPlaylist.filter(musicsPlaylist => musicsPlaylist.id_musicplaylist !== id_musicplaylist));

    }

    async function playPlaylistMusic(id_musicplaylist) {
        await api.post("/Playlist/" + id_musicplaylist + "/playMusicPlaylist").then(
            // response => {
            //     history.push("/playlist/" + response.data.data.id_playlist);
            // }
        );
    }


    useEffect(() => {

        async function loadPlaylist() {
            loadPlaylistMusics();

            const response = await api.get('/Playlist/' + match.params.id_playlist);
            setPlaylist(response.data.data);

            if (!response.data.data.id_playlist) {
                history.push("/");
                return;
            }

            setLoadPlaylist(true);
            // loadPlaylistMusics();
        }

        async function loadPlaylistMusics() {
            const response = await api.get('/Music/' + match.params.id_playlist + '/byPlaylist');
            setMusicsPlaylist(response.data.data);
            setLoadmusics(true);

        }

        loadPlaylist();

    }, [match.params.id_playlist])

    return (
        <div className="container-area-full">
            <PopUp></PopUp>

            <div className={loadplaylist ? 'header-playlist header-playlist-show' : 'header-playlist'}>

                <div className='capa-playlist'>
                    <img src={playlist.st_capa} />
                </div>

                <div className='capa-playlist-sobre'></div>

                <div className='playlist-info'>
                    <h1>{playlist.st_nome}</h1>
                    <p>Criada em <Moment format="DD/MM/YYYY">{playlist.dt_create}</Moment></p>
                    <p className='info-by'>By {playlist.st_nomeusuario}</p>

                    <div className='button-actions'>
                        {+id_usuario !== +playlist.id_usuario && (
                            <button> <i className="fa fa-heart"></i> Curtir</button>
                        )}

                        <button onClick={() => clonarPlaylist(playlist.id_playlist)}> <i className="fa fa-copy"></i> Clonar</button>

                        {(+id_usuario === +playlist.id_usuario && +playlist.bl_publicedit === 0) || +playlist.bl_publicedit === 1 ? (
                            <Link to={'/playlist/' + playlist.id_playlist + '/new'}>
                                <button> <i className="fa fa-plus"></i> Nova Música</button>
                            </Link>
                        ) : <div></div>}

                        <button> <i className="fa fa-link"></i> Compartilhar</button>

                        {+id_usuario === +playlist.id_usuario && (
                            <Link to={'/edit/' + playlist.id_playlist}>
                                <button> <i className="fa fa-edit"></i> Editar</button>
                            </Link>
                        )}

                        {+id_usuario === +playlist.id_usuario && (
                            <button onClick={() => desativaPlaylist(playlist.id_playlist)}> <i className="fa fa-trash"></i> Excluir</button>
                        )}

                        <button onClick={() => playPlaylist(playlist.id_playlist)} > <i className="fa fa-play"></i> Reproduzir</button>

                    </div>
                </div>
            </div>
            {loadmusics && loadplaylist ? (
                <div className="container-area">
                    <div>
                        {musicsPlaylist ? (
                            <ul>
                                {musicsPlaylist.map(music => (
                                    <li key={music.id_musicplaylist}
                                        className={+music.bl_selected === 1 ? 'list-playlist-select' : ''}
                                    // onClick={() => selectMusic(music.id_musicplaylist)}
                                    >
                                        <ListMedia
                                            hoverCapa={true}
                                            clickCapa={() => playPlaylistMusic(music.id_musicplaylist)}
                                            playlist={playlist}
                                            id_usuario={id_usuario}
                                            music={music}
                                            buttons={[
                                                {
                                                    text: 'Copiar para...',
                                                    show: true,

                                                },
                                                {
                                                    text: 'Remover',
                                                    show: +id_usuario === +playlist.id_usuario && +playlist.bl_publicedit === 0 || +playlist.bl_publicedit === 1,
                                                    action: () => removeMusicPlaylist(music.id_musicplaylist)

                                                }
                                            ]}
                                        ></ListMedia>
                                    </li>
                                ))}
                            </ul>
                        ) : (<div className="empty-response">Nenhuma música nesta playlist!</div>)}
                    </div>
                </div>) : (
                    <Loading></Loading>
                )}

        </div>


    );

}