import React from "react";

function InputQuantity(props) {
    const { id, name, value, onChange } = props;
    return (
        <div className="btn-group">
            <button
                className="btn btn-primary"
                onClick={(e) => {
                    e.preventDefault();
                    onChange(value - 1);
                }}
            >
                <i className="bi bi-dash"></i>
            </button>
            <input
                type="number"
                name={name}
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="form-control webkit-appearance-none rounded-0 border-dark"
                style={{ width: "60px" }}
            />
            <button
                className="btn btn-primary"
                onClick={(e) => {
                    e.preventDefault();
                    onChange(value + 1);
                }}
            >
                <i className="bi bi-plus"></i>
            </button>
        </div>
    );
}

export default InputQuantity;
