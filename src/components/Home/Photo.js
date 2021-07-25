import React from 'react';

const Photo = props => {

    // Renders the url parameter passed via props from it's initial markup in Photo.js.
    return (
        <div className="item w3-card-4 ">
            <img src={props.url} alt={props.title} />
        </div>
        // <li>
        //     <img src={props.url} alt={props.title} />
        // </li>
    );
}

export default Photo;