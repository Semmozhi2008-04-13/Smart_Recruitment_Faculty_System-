import React from 'react';

function Button({variant='primary'}){
    const butstyle={
        padding: '10px 10px',
        fontSize: '14px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        backgroundColor: variant === 'primary' ? '#007bff' : '#6c757d',
        color: 'white',
    };

    return(
        <button style={butstyle}>
            Hello there!!!!
        </button>
    );
}

export default Button;
