import {
    PAGES_FETCH,
    PAGES_LOADING_SHOW,
    PAGES_LOADING_HIDE,
    PAGES_LOADED,
    SET_CURRENT_PAGE,
    SET_LOADING_ROW
} from "./types";

const initialState = {
    pages: [],
    searchQuery: '',
    pagination: {
        perPage: 50,
        total: null,
        currentPage: 1,
        visiblePage: 30,
    },
    loading: false,
    loadData: false,
};

export const pagesReducer = (state = initialState, action) => {
    switch (action.type) {
        case PAGES_FETCH:
            state.pages = action.payload.pages.slice();
            state.pagination.total = action.payload.total;
            break;
        case PAGES_LOADING_SHOW:
            state.loading = true;
            break;
        case PAGES_LOADING_HIDE:
            state.loading = false;
            break;
        case PAGES_LOADED:
            state.loadData = true;
            break;
        case SET_CURRENT_PAGE:
            state.pagination.currentPage = action.payload;
            break;
        case SET_LOADING_ROW:
            const {id, loading} = action.payload;
            const pages = state.pages.map(item => {
                if (item.id == id) {
                    item.loading = loading;
                }
                return item;
            });
            state.pages = pages.slice();
            break;
    }
    return state;
};