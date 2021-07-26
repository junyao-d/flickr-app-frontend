import React from 'react';

const Photo = props => {

    // Renders the url parameter passed via props from it's initial markup in Photo.js.
    return (
        <div className="item w3-hover-opacity">
            <img src={props.url} alt={props.title} className="w3-round-large"/>
        </div>
        // <li>
        //     <img src={props.url} alt={props.title} />
        // </li>
    );
}

export default Photo;