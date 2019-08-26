import React, { useState, useEffect } from "react";
import "./Inputs.css";
import Toggle from "../components/Toggle";

import api from "../services/api";

export default function NewPlaylist({ history, match }) {

    const teste = function () {
        console.log("dvsiohja");
    }

    const [id_playlist, setId_playlist] = useState('');
    const [st_nome, setSt_nome] = useState('');
    const [st_descricao, setSt_descricao] = useState('');
    const [bl_privada, setBl_privada] = useState(0);
    const [bl_publicedit, setBl_publicedit] = useState('');
    const [bl_sincronizar, setBl_sincronizar] = useState('');
    const [bl_sincronizado, setBl_sincronizado] = useState('');
    const [st_capa, setSt_capa] = useState("");
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {

        const id_usuario = localStorage.getItem("id_usuario")

        async function sourcePlaylist() {

            if (match.params.id_playlist) {

                const response = await api.get("/Playlist/" + match.params.id_playlist);
                const playlist = response.data.data;

                if (+response.data.data.id_usuario !== +id_usuario) {
                    history.push("/");
                    return;
                }

                setId_playlist(playlist.id_playlist);
                setSt_nome(playlist.st_nome);
                setSt_descricao(playlist.st_descricao);
                setBl_privada(playlist.bl_privada);
                setBl_publicedit(playlist.bl_publicedit);
                setBl_sincronizar(playlist.bl_sincronizar);
                setBl_sincronizado(playlist.bl_sincronizado);
                setSt_capa(playlist.st_capa);
            }
            setLoaded(true);
        }

        sourcePlaylist();




    }, [match.params.id_playlist])


    async function savePlaylist(e) {
        e.preventDefault();

        await api.post("/Playlist", {
            id_playlist,
            st_nome,
            st_descricao,
            bl_privada,
            bl_publicedit,
            bl_sincronizar
        }).then(response => {
            history.push("/playlist/" + response.data.data.id_playlist);
        })

    }

    return (

        <div className="container-area">
            {loaded && (
                <div>
                    <div className="area-busca">
                        <h1>Crie a sua.</h1>
                    </div>

                    <form>
                        <input
                            onChange={e => setSt_nome(e.target.value)}
                            value={st_nome}
                            className="text-input"
                            placeholder="Nome da playlist" />

                        <textarea
                            onChange={e => setSt_descricao(e.target.value)}
                            value={st_descricao}
                            className="text-area-input"
                            placeholder="Descreva a sua playlist!"></textarea>


                        <div className="input-toggle">
                            <Toggle
                                name="bl_privada"
                                checked={bl_privada}
                                onChangeFunction={() => setBl_privada(!bl_privada)}
                            ></Toggle>
                            <label for="bl_privada">Playlist privada. (Outros usuários não terão acesso a sua playlist.)</label>
                        </div>

                        <div className="input-toggle">
                            <Toggle
                                name="bl_publicedit"
                                checked={bl_publicedit}
                                onChangeFunction={() => setBl_publicedit(!bl_publicedit)}
                            ></Toggle>
                            <label for="bl_publicedit">Playlist editável. (Outros usuários poderão adicionar e remover músicas desta playlist.)</label>
                        </div>

                        <div className="input-toggle">
                            <Toggle
                                name="bl_sincronizar"
                                checked={bl_sincronizar}
                                onChangeFunction={() => setBl_sincronizar(!bl_sincronizar)}
                            ></Toggle>
                            <label for="bl_sincronizar">Sincronizar com o Spotify <i className="fab fa-spotify"></i>. (Playlist será criada no spotify. Saiba mais em seu perfil.)</label>

                        </div>

                        <div>

                        </div>

                        <button className="button-primary" onClick={savePlaylist}>Salvar</button>
                    </form></div>
            )}
        </div >
    );

}