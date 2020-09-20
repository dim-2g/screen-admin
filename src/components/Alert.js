import React, {useEffect, useState} from "react";

const Alert = (props) => {
    const classAlert = props.classAlert || 'alert-success';

    useEffect(() => {
        setTimeout(() => {
            props.onClose();
        }, 5000);
    }, [props.show]);

    if (!props.show) return null;

    return (
        <div className={`alert ${classAlert} alert-dismissible fade show`} role="alert">
            {props.children}
            <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={props.onClose}>
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    );
};

export default Alert;