import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchPages, setCurrentPage, checkUrl} from "../redux/actions";
import Table from "./table/table";
import Loader from "./loader";

const Main = (props) => {
    const dispatch = useDispatch();
    const pages = useSelector(state => state.pages.pages);
    const loading = useSelector(state => state.pages.loading);
    const perPage = useSelector(state => state.pages.pagination.perPage);
    const currentPage = useSelector(state => state.pages.pagination.currentPage);
    const loadData = useSelector(state => state.pages.loadData);
    const pagination = useSelector(state => state.pages.pagination);

    const getPages = (limit, currentPage = 1, query = '') => {
        dispatch(fetchPages(limit, currentPage, query));
    };

    const handlePageChanged = (newPage) => {
        const normilizedNewPage = newPage + 1;
        getPages(perPage, normilizedNewPage);
        dispatch(setCurrentPage(normilizedNewPage));
    };

    const checkOneUrl = (e, id) => {
        e.preventDefault();
        dispatch(checkUrl(id));
        //console.log(id);
    };

    const deleteUrl = () => {

    };

    useEffect(() => {
        getPages(perPage, currentPage);
    }, []);

    useEffect(() => {
        console.log('pagination');
        console.log(pagination);
    });

    return (
        <div className="App">
            {loading && <Loader />}
            <div className="container">
                <h4 className="page-header">Отслеживаемые страницы</h4>
                <Table
                    loadData={loadData}
                    pages={pages}
                    pagination={pagination}
                    handlePageChanged={handlePageChanged}
                    checkOneUrl={checkOneUrl}
                    deleteUrl={deleteUrl}
                />
            </div>
        </div>
    );
};

export default Main;