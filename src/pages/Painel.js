import React, { useEffect, useState } from "react";
import { Link, Route, Switch } from "react-router-dom"
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

    function logout(){
        localStorage.removeItem("st_token");
        localStorage.removeItem("id_usuario");
        history.push("/login")
    }

    async function getCurrentPlayer(){
        const response = await api.get('/Spotify/null/getCurrentPlayer').then(response => {
            setCurrentPlayerArtists(response.data.data.resumo.artists);
            setCurrentPlayerName(response.data.data.resumo.name);

        });
    }

    useEffect(() => {

        async function verificaUsuario(){
            const response = await api.get('/Usuario/null/verificaautenticacao').then(response => {

            }).catch(response => {
                history.push("/login");
            });
        }

        async function verificaIntegracao() {
            const response = await api.get('/Spotify/null/VerificaIntegracao');
            setIntegracao(response.data.data);

        }
        verificaUsuario(); 
        verificaIntegracao();
        getCurrentPlayer();
        getInterval();

    }, []);

    function getInterval(){
        setInterval(() => {
            getCurrentPlayer();
        }, 5000);
    }

    return (
        <div className="painel">
            <div className="menu">
                <ul>
                    <Link to={"/"}>
                        <li><i className="fa fa-home"></i> <span>Home</span></li>
                    </Link>
                    <Link to={"/playlist"}>
                        <li><i className="fa fa-search"></i> <span>Pesquisar</span></li>
                    </Link>
                    <Link to={"/new"}>
                        <li><i className="fa fa-plus"></i> <span>Criar</span></li>
                    </Link>

                    <Link to="/library/">
                    <li><i className="fa fa-list"></i> <span>Biblioteca</span></li>
                    </Link>

                    {+integracao.bl_integracao === 1 && (
                        <Link to="/spotify/">
                            <li><i className="fab fa-spotify"></i> <span>Spotify</span></li>
                        </Link>
                    )}
                    <Link to={"/perfil/"}>
                        <li><i className="fa fa-user"></i> <span>Perfil</span></li>
                    </Link>

                        <li onClick={logout}><i className="fa fa-door-open"></i> <span>Sair</span></li>
                </ul>

                <div className="playing">
                    <div>Em seu <i className="fab fa-spotify"></i></div>
                    <div className="music">{currentPlayerName}</div>
                    <div>{currentPlayerArtists}</div>
                </div>

            </div>

            <div className="area-page">

                <Switch>
                    <Route path="/" exact component={Home}></Route>
                    <Route path="/new/" exact component={NewPlaylist}></Route>
                    <Route path="/edit/:id_playlist" exact component={NewPlaylist}></Route>
                    <Route path="/playlist/" exact component={PlaylistSource}></Route>
                    <Route path="/playlist/:id_playlist" exact component={Playlist}></Route>
                    <Route path="/playlist/:id_playlist/new" exact component={NewMusic}></Route>
                        <Route path="/perfil/" exact  render={ () => (<Perfil integracao={integracao}/>)}></Route>
                    <Route path="/spotify" exact component={Spotify}></Route>
                    <Route path="/library/" exact component={Library}></Route>
                </Switch>

            </div>

        </div>
    );

}