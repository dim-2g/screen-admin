import React from 'react';

const Row = (props) => {
    return (
        <tr>
            <th scope="row">{props.id}</th>
            <td>{props.url}</td>
            <td>{props.check_date}</td>
            <td>{props.result}</td>
        </tr>
    );
}

export default Row;