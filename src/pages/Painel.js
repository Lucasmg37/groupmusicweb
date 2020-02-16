import React, {useEffect, useState} from "react";
import {Link, Route, Switch} from "react-router-dom"
import api from "../services/api";
import "../css/Main.scss";

import "./Painel.css";
import Playlist from "./Playlist";
import Home from "./Home";
import NewMusic from "./NewMusic";
import PlaylistSource from "./PlaylistSource";
import NewPlaylist from "./NewPlaylist";
import Perfil from "./Perfil";
import Spotify from "./Spotify";
import Library from "./Library";

export default function Painel({history}) {

    const [integracao, setIntegracao] = useState({});
    const [currentPlayerName, setCurrentPlayerName] = useState('');
    const [currentPlayerArtists, setCurrentPlayerArtists] = useState('');
    const [isCurrentPlayer, setIsCurrentPlayer] = useState(false);
    const [progress_ms, setProgress_ms] = useState(0);
    const [duration_ms, setDuration_ms] = useState(0);
    const [progressForCent, setProgressForCent] = useState(0);
    const [usuario, setUsuario] = useState({});


    function logout() {
        localStorage.removeItem("st_token");
        localStorage.removeItem("id_usuario");
        history.push("/login")
    }

    async function getCurrentPlayer() {
        await api.get('/Spotify/null/getCurrentPlayer').then(response => {
            setCurrentPlayerArtists(response.data.data.resumo.artists);
            setCurrentPlayerName(response.data.data.resumo.name);
            setDuration_ms(response.data.data.resumo.progress_ms);
            setProgress_ms(response.data.data.resumo.duration_ms);
            setIsCurrentPlayer(response.data.data.isPlayling);
            setProgressForCent((+response.data.data.resumo.progress_ms * 100) / response.data.data.resumo.duration_ms);

        });
    }

    useEffect(() => {
        getUser();
    }, []);


    async function getUser() {
        await api.get('/Usuario/').then(response => {
                setUsuario(response.data.data);
            }
        ).catch(() => {
            history.push('/login');
        });
    }

    useEffect(() => {

        function startEvents() {

            // api.get('/Usuario/null/verificaautenticacao').then(response => {

            // }).catch(response => {
            //     history.push("/login");
            // });

            // api.get('/Spotify/null/VerificaIntegracao').then(response => {
            //     setIntegracao(response.data.data);
            // });

        }

        if (usuario.id_usuario) {
            startEvents();

            if (usuario.bl_integracao) {
                getInterval();
            }
        }

    }, [usuario]);


    async function getInterval() {

        // await setInterval(() => {
        //     getCurrentPlayer();
        // }, 5000);

    }

    return (
        <div className="painel">
            <div className="menu">
                <ul>
                    <Link to={"/"}>
                        <li><i className="fa fa-home"/> <span>Home</span></li>
                    </Link>
                    <Link to={"/playlist"}>
                        <li><i className="fa fa-search"/> <span>Pesquisar</span></li>
                    </Link>
                    <Link to={"/new"}>
                        <li><i className="fa fa-plus"/> <span>Criar</span></li>
                    </Link>

                    <Link to="/library/">
                        <li><i className="fa fa-list"/> <span>Biblioteca</span></li>
                    </Link>

                    {+usuario.bl_integracao === 1 && (
                        <Link to="/spotify/">
                            <li><i className="fab fa-spotify"/> <span>Spotify</span></li>
                        </Link>
                    )}
                    <Link to={"/perfil/"}>
                        <li><i className="fa fa-user"/> <span>Perfil</span></li>
                    </Link>

                    <li onClick={logout}><i className="fa fa-door-open"/> <span>Sair</span></li>
                </ul>

                <div className={+integracao.bl_integracao === 1 && isCurrentPlayer ? 'playing opacity' : 'playing'}>
                    <div className="linha-de-reproducao">
                        <div className="reproduzido" style={{width: progressForCent + '%'}}/>
                    </div>
                    <div className="info">
                        <div>Em seu <i className="fab fa-spotify"/></div>
                        <div className="music">{currentPlayerName}</div>
                        <div>{currentPlayerArtists}</div>
                    </div>
                </div>

            </div>

            <div className="area-page">

                <Switch>
                    <Route path="/" exact component={Home}/>

                    <Route path="/new/" exact render={({match, history}) => (
                        <NewPlaylist id_playlist={match.params.id_playlist} usuario={usuario} history={history}/>
                    )}/>


                    <Route path="/edit/:id_playlist" exact render={({match, history}) => (
                        <NewPlaylist id_playlist={match.params.id_playlist} usuario={usuario} history={history}/>
                    )}/>

                    <Route path="/playlist/" exact component={PlaylistSource}/>

                    <Route path="/playlist/:id_playlist" exact render={({match, history}) => (
                        <Playlist history={history} id_playlist={match.params.id_playlist}
                                  usuario={usuario}/>)}/>

                    <Route path="/playlist/:id_playlist/new" exact render={({match, history}) => (
                        <NewMusic history={history} params={match.params} usuario={usuario}/>)}/>

                    <Route path="/perfil/" exact render={() => (<Perfil usuario={usuario} setUsuario={getUser}/>)}/>
                    <Route path="/spotify" exact component={Spotify}/>
                    <Route path="/library/" exact component={Library}/>
                </Switch>

            </div>

        </div>
    );

}