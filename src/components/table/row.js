import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom'

const Row = (props) => {
    const badgeClass = classNames(
        'badge',
        { 'badge-success': props.threshold >  props.result  && props.result > 0},
        { 'badge-warning': props.threshold <=  props.result},
        { 'badge-secondary': props.result == 0}
    );
    const detailUrl = `/detail/${props.id}`;
    return (
        <tr>
            <th scope="row">{props.id}</th>
            <td><Link to={detailUrl}>{props.url}</Link></td>
            <td>{props.check_date}</td>
            <td>{props.width}</td>
            <td>{props.threshold}</td>
            <td>
                {props.loading
                    ? <div className="spinner-border spinner-border-sm" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                    : <span className={badgeClass}>{props.result}</span>
                }
            </td>
            <td>
                <button 
                    type="button" 
                    className="btn btn-outline-secondary btn-action" 
                    onClick={e => props.checkOneUrl(e, props.id)} 
                    title="Проверить сейчас вне очереди" 
                    disabled={props.loading}
                >
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-arrow-repeat" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"></path>
                        <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"></path>
                    </svg>
                </button>
                <button type="button" className="btn btn-outline-danger btn-action" onClick={e => props.deleteUrl(e, props.id)} title="Удалить адрес из проверок">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
                    </svg>
                </button>
            </td>
        </tr>
    );
}

export default Row;