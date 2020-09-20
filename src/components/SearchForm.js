import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setSearchQuery} from "../redux/actions";

const SearchForm = (props) => {
    const [query, setQuery] = useState('');
    const dispatch = useDispatch();
    const searchQuery = useSelector(state => state.pages.searchQuery);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(setSearchQuery(query));
    };

    useEffect(() => {
        setQuery(searchQuery);
    }, [searchQuery]);

    return (
        <div className="mb-3">
            <form action="" onSubmit={(e) => submitHandler(e)}>
                <div className="input-group is-invalid">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Введите адрес страницы для поиска"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="input-group-append">
                        <button className="btn btn-secondary" type="submit">Поиск</button>
                    </div>
                </div>
            </form>
            {searchQuery && (
            <div className="search-query-alert alert alert-success alert-dismissible fade show" role="alert">
                Фильтрация по запросу <strong>{searchQuery}</strong>
                <button
                    type="button"
                    className="close"
                    data-dismiss="alert"
                    aria-label="Close"
                    onClick={() => dispatch(setSearchQuery(''))}
                    title="Сбросить фильтрацию"
                >
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            )}
        </div>
    );
};

export default SearchForm;