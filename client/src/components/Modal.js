import React from "react";

function Modal(props) {
    const { id, className, children, title } = props;
    return (
        <div
            id={id}
            tabIndex="-1"
            aria-hidden="true"
            className={`modal fade ${className}`}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body"> {children}</div>
                </div>
            </div>
        </div>
    );
}

export default Modal;
