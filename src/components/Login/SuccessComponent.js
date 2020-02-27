import React from 'react';

export default function SuccesComponent(props) {

    return (
        <div>
            <h1>{props.titulo}</h1>
            <button
                onClick={props.buttonAction}
                className="button-primary">
                {props.buttonText}
            </button>
        </div>
    );

}