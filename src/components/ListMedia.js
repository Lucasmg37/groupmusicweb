import React from 'react';
import api from '../services/api'
import './ListMedia.scss'

export default function ListMedia(props) {

    async function playPlaylistMusic(id_musicplaylist) {
        await api.post("/Playlist/" + id_musicplaylist + "/playMusicPlaylist").then(
            // response => {
            //     history.push("/playlist/" + response.data.data.id_playlist);
            // }
        );
    }

    async function removeMusicPlaylist(id_musicplaylist) {
        await api.delete("/Music/" + id_musicplaylist);
        // setMusicsPlaylist(musicsPlaylist.filter(musicsPlaylist => musicsPlaylist.id_musicplaylist !== id_musicplaylist));

    }

    return (

        <div className="list-media">
            <div onClick={() => playPlaylistMusic(props.music.id_musicplaylist)} className="img-playlist">
                <div className="hover-img">
                    <i className="fa fa-play"></i>
                </div>
                <img src={props.music.st_urlimagem} />
            </div>

            <div className="info-music">
                <strong>{props.music.st_nome}</strong>
                <p>Artista: {props.music.st_artista}</p>
                <p>Album: {props.music.st_album}</p>
            </div>

            <div className="actions-buttons">

                <button>Copiar para...</button>

                {(+props.id_usuario === +props.playlist.id_usuario &&
                    +props.playlist.bl_publicedit === 0) || +props.playlist.bl_publicedit === 1 ? (
                        <button onClick={() => removeMusicPlaylist(props.music.id_musicplaylist)}>Remover</button>
                    ) : <div></div>}

            </div>
        </div>
    );

}