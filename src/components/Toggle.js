import React, { useEffect } from "react";
import './Toggle.css';

export default function Toggle(props) {

    function changeFunction() {
        props.onChangeFunction();
    }

    return (
        <div>
            <label className="switch">
                <input
                    id={props.name}
                    type="checkbox"
                    onChange={changeFunction}
                    checked={props.checked}
                />
                <span className="slider round"></span>
            </label>
        </div>
    );


}