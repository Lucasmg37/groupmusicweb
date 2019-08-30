import React, { useState, useEffect } from "react";
import Moment from "react-moment";
import api from "../services/api";
import Loading from "../components/Loading";
import PopUp from "./PopUp";

export default function Library({ history }) {

    const [playlists, setPlaylists] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [opened, setOpened] = useState(false);
    const [playlistactiveid, setPlaylistactiveid] = useState("");
    const [buttons, setButtons] = useState({});

    

    async function openPopUp(playlist_id) {
        await setPlaylistactiveid(playlist_id);
        setOpened(!opened);
    }

    var actionButtonEdit;

    useEffect(() => {
        
        var id = playlistactiveid

        actionButtonEdit = (id) => {
            alert(id);
            history.push("/edit/" + id);
        }



    }, [playlistactiveid])


    useEffect(() => {

        const dataButtons = 
        [
            {
                name: "Teste",
                action: actionButtonEdit
            }
        ]
    
    setButtons(dataButtons);

        async function loadPlaylist() {
            const response = await api.get("/Playlist/NULL/getPlaylistsUser");
            setPlaylists(response.data.data);
            setLoaded(true);
        }

        loadPlaylist();

    }, [])



    return (
        <div className="container-area">
            <PopUp opened={opened}
                closePopUp={() => setOpened(!opened)}
                buttons={buttons}></PopUp>

            <div className="area-busca">
                <h1>Suas Playlists</h1>
            </div>

            {loaded ? (
                <div className="list-playlist">
                    {playlists !== undefined && playlists.length > 0 ? (
                        <ul>
                            {playlists.map(playlist => (
                                <li key={playlist.id_playlist}>
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
                                        <i onClick={() => openPopUp(playlist.id_playlist)} className="fa fa-ellipsis-v fa-2x"></i>
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