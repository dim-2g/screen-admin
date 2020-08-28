import React from 'react';

const Head = (props) => {
    return (
        <tr>
            <th scope="col">#</th>
            <th scope="col">Страница</th>
            <th scope="col">Дата проверки</th>
            <th scope="col">Ширина</th>
            <th scope="col">Порог</th>
            <th scope="col">Результат</th>
            <th scope="col">Действие</th>
        </tr>
    );
}

export default Head;