import {
    PAGES_FETCH,
    PAGES_LOADING_SHOW,
    PAGES_LOADING_HIDE,
    PAGES_LOADED,
    SET_CURRENT_PAGE,
    SET_LOADING_ROW,
    SET_SEARCH_QUERY
} from "./types";
import Axios from "axios";

export function fetchPages(limit, currentPage, query) {
    return async dispatch => {
        console.log('---fetch---');
        dispatch({type: PAGES_LOADING_SHOW});
        const response = await fetch(`http://otp.demis.ru/app/web/srceenshotter/find-pages?page=${currentPage}&limit=${limit}&term=${query}`);
        const json = await response.json();
        dispatch({
            type: PAGES_FETCH,
            payload: json
        });
        dispatch({type: PAGES_LOADING_HIDE});
        dispatch({type: PAGES_LOADED});
    }
}

export function setCurrentPage(page) {
    return {
        type: SET_CURRENT_PAGE,
        payload: page
    };
}

export function checkUrl(id) {
    return async (dispatch, getState) => {
        showRowLoading(dispatch, id);
        try{
            await Axios.get(`http://screenshotter.demis.ru/once?id=${id}`);
            hideRowLoading(dispatch, id);
            //обновим список текущей страницы
            //получим данные для вызова fetchPages из стейта
            const {pagination: {perPage, currentPage}, searchQuery} = getState().pages;
            dispatch(fetchPages(perPage, currentPage, searchQuery));
        } catch(e) {
            alert(e);
            hideRowLoading(dispatch, id);
        }
    }
}

export function setSearchQuery(query) {
    return {
        type: SET_SEARCH_QUERY,
        payload: query
    }
}

export function showRowLoading(dispatch, id) {
    dispatch({
        type: SET_LOADING_ROW,
        payload: { id: id, loading: true}
    });
}

export function hideRowLoading(dispatch, id) {
    dispatch({
        type: SET_LOADING_ROW,
        payload: { id: id, loading: false}
    });
}

/*
 * Удаление задания по id
 */
export function deleteTask(id) {
    return async (dispatch, getState) => {
        const page = getState().pages.pages.find(item => item.id === id);
        if (!page) return null;
        const conf = window.confirm(`Вы точно хотите далить адрес ${page.url}, шириной экрана ${page.width}?`);
        if (!conf) return null;
        try {
            showRowLoading(dispatch, id);
            await Axios.get(`http://otp.demis.ru/app/web/srceenshotter/delete-task?id=${id}`)
            hideRowLoading(dispatch, id);
            const {pagination: {perPage, currentPage}, searchQuery} = getState().pages;
            dispatch(fetchPages(perPage, currentPage, searchQuery));
        } catch (e) {
            alert(e);
            hideRowLoading(dispatch, id);
        }
    }
}