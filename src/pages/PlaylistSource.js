import React from "react";

export default function PlaylistSource() {

    async function buscaPlaylist(search) {
        
    }

    return (
        <div className="container-area">
            <div className="area-busca">
                <h1>Descubra novas playlists</h1>
                <input
                    type="text"
                    onKeyUp={e => buscaPlaylist(e.target.value)} />
            </div>

        </div>
    );

}