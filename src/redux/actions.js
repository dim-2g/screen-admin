import {
    PAGES_FETCH,
    PAGES_LOADING_SHOW,
    PAGES_LOADING_HIDE,
    PAGES_LOADED,
    SET_CURRENT_PAGE,
    SET_LOADING_ROW
} from "./types";
import Axios from "axios";

export function fetchPages(limit, currentPage, query) {
    return async dispatch => {
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
    return async dispatch => {
        dispatch({
            type: SET_LOADING_ROW,
            payload: {
                id: id,
                loading: true
            }
        });

        Axios.get(`http://screenshotter.demis.ru/once?id=${id}`)
            .then(res => {
                console.log('Обновим данные');
                console.log(res);
                //const {currentPage, perPage} = this.state.pagination;
                //fetchPages(perPage, currentPage, '');
                console.log('Убираем загрузку');
                dispatch({
                    type: SET_LOADING_ROW,
                    payload: {
                        id: id,
                        loading: false
                    }
                });
            })
            .catch(error => {
                console.log(`Ошибка API: ${error}`);
            })
    }
}