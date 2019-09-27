import React from 'react';

export default function ButtonAction(props) {

    return (
        <span>
            {props.show && (
                <button onClick={props.action} >{props.text}</button>
            )}
        </span>
    );

}