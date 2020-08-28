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
                {!props.loading &&
                    <a href="#" onClick={e => props.checkOneUrl(e, props.id)}>Проверить</a>
                }
            </td>
        </tr>
    );
}

export default Row;