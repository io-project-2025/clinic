import React from "react";
import {Link} from "react-router-dom";



const  MainLink = (props) => {
    return (
            <>
            <Link to={props.link}>
                <div className = {props.className} onClick={props.onClick}>
                { props.render ? props.render : props.txt }
                </div>
            </Link>
            </>    
    );
};

export default MainLink;