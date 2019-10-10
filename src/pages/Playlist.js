import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';

import api from '../services/api';
import './Playlist.css';
import Loading from '../components/Loading';
import PopUp from './PopUp';
import ListMedia from '../components/ListMedia';
import HeaderPlaylist from '../components/HeaderPlaylist';


export default function Playlist(props) {

    const [playlist, setPlaylist] = useState({});
    const [musicsPlaylist, setMusicsPlaylist] = useState([]);
    const [loadmusics, setLoadmusics] = useState(false);
    const [loadplaylist, setLoadPlaylist] = useState(false);

    const id_usuario = localStorage.getItem("id_usuario");

    async function desativaPlaylist(id_playlist) {
        await api.delete("/Playlist/" + id_playlist).then(response => {
            props.history.push("/");
        })
    }

    async function clonarPlaylist(id_musicplaylist) {
        await api.post("/Playlist/" + id_musicplaylist + "/clone").then(
            response => {
                props.history.push("/playlist/" + response.data.data.id_playlist);
            }
        );

    }

    async function playPlaylist(id_playlis) {
        await api.post("/Playlist/" + id_playlis + "/play")
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
        await api.post("/Playlist/" + id_musicplaylist + "/playMusicPlaylist");
    }


    useEffect(() => {

        async function loadPlaylist() {
            loadPlaylistMusics();

            const response = await api.get('/Playlist/' + props.id_playlist);
            setPlaylist(response.data.data);

            if (!response.data.data.id_playlist) {
                props.history.push("/");
                return;
            }

            setLoadPlaylist(true);
            // loadPlaylistMusics();
        }

        async function loadPlaylistMusics() {
            const response = await api.get('/Music/' + props.id_playlist + '/byPlaylist');
            setMusicsPlaylist(response.data.data);
            setLoadmusics(true);

        }

        loadPlaylist();

    }, [props.id_playlist])

    return (
        <div className="container-area-full">
            <PopUp/>

            <div className={loadplaylist ? 'header-playlist header-playlist-show' : 'header-playlist'}>
                <HeaderPlaylist
                    playlist={playlist}
                    buttons={[
                        {
                            text: 'Curtir',
                            show: +props.usuario.id_usuario !== +playlist.id_usuario,
                            icon: 'fa-heart'

                        },
                        {
                            text: 'Copiar',
                            show: true,
                            icon: 'fa-copy',
                            action: () => clonarPlaylist(playlist.id_playlist)

                        },
                        {
                            text: 'Nova Música',
                            show: (+props.usuario.id_usuario === +playlist.id_usuario && +playlist.bl_publicedit === 0) || +playlist.bl_publicedit === 1,
                            icon: 'fa-plus',
                            action: () =>  props.history.push('/playlist/' + playlist.id_playlist + '/new')

                        },
                        {
                            text: 'Compartilhar',
                            show: true,
                            icon: 'fa-link'

                        },
                        {
                            text: 'Editar',
                            show: +props.usuario.id_usuario === +playlist.id_usuario,
                            icon: 'fa-edit',
                            action: () => props.history.push('/edit/' + playlist.id_playlist)

                        },
                        {
                            text: 'Excluir',
                            show: +props.usuario.id_usuario === +playlist.id_usuario,
                            icon: 'fa-trash',
                            action: () => desativaPlaylist(playlist.id_playlist)

                        },
                        {
                            text: 'Reproduzir',
                            show: +props.usuario.bl_premium === 1,
                            icon: 'fa-play',
                            action: () => playPlaylist(playlist.id_playlist)

                        }
                    ]}
                />
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
                                            hoverCapa={props.usuario.bl_premium}
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
                                        />
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