import React from 'react';

export default function ButtonAction(props) {

    return (
        <div>
        { props.show && (
                <button onClick={() => props.action} >{props.text}</button>
            )
        }
        </div>
    );

}