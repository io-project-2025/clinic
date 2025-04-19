import React from "react";
import {Link} from "react-router-dom";


const HelperDiv = (props) => {
    return (<div className = {props.className} onClick={props.onClick}>
        {props.txt}
    </div>)
}


const MainLink = (props) => {
    return (
            <Link to={props.link} className={props.linkClass}>
            {
                props.render ? props.render : (<HelperDiv {...props}/>)
            }
            </Link>       
    );
};

export default MainLink;