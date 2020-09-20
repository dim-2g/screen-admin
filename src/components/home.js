import React from 'react';
import '../App.css';
import Loader from './loader';
import Axios from 'axios';
import Table from './table/table';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: null,
            searchQuery: '',
            pagination: {
                perPage: 50,
                total: null,
                currentPage: 1,
                visiblePage: 30,
            },
            loading: false,
            loadData: false,
        }
        this.handlePageChanged = this.handlePageChanged.bind(this);
        this.checkOneUrl = this.checkOneUrl.bind(this);
        this.deleteUrl = this.deleteUrl.bind(this);
        this.deleteUrlRequest = this.deleteUrlRequest.bind(this);
    }
    deleteUrl(e, id) {
        const page = this.state.pages.find(item => item.id === id);
        if (page) {
            const conf = window.confirm(`Вы точно хотите далить адрес ${page.url}, шириной экрана ${page.width}?`);
            if (conf) {
                this.setState({ loading: true });
                this.deleteUrlRequest(page.id)
                    .then(res => {
                        console.log(res);
                        this.setState({ loading: false });
                        const {currentPage, perPage} = this.state.pagination;
                        this.getPosts(perPage, currentPage);
                    })
                    .catch(error => {
                        console.log('Ошибка API ', error);
                    })
            }
        } else {
            return null;
        }
    }
    deleteUrlRequest(id) {
        return Axios.get(`http://otp.demis.ru/app/web/srceenshotter/delete-task?id=${id}`)
    }
    checkOneUrl(e, id) {
        e.preventDefault();
        console.log(`Проверить конкретный урл ${id}`);
        const pages = this.state.pages.map(item => {
            if (item.id === id) {
                item.loading = true;
            }
            return item;
        });
        this.setState({pages: pages});
        Axios.get(`http://uto-screen.demis.ru/once?id=${id}`)
            .then(res => {
                console.log('Обновим данные');
                console.log(res);
                const {currentPage, perPage} = this.state.pagination;
                this.getPosts(perPage, currentPage);
            })
            .catch(error => {
                console.log(`Ошибка API: ${error}`);
            })
    }
    handlePageChanged(newPage) {
        //console.log(`Клик по странице ${newPage} пагинации`);
        const normilizedNewPage = newPage + 1;
        this.getPosts(this.state.pagination.perPage, normilizedNewPage);
        this.setState({
            pagination: {
                ...this.state.pagination,
                currentPage: normilizedNewPage
            }, 
            loading: true
        });
    }
    getPosts(limit, currentPage = 1) {
        this.setState({ loading: true })
        Axios.get(`http://otp.demis.ru/app/web/srceenshotter/find-pages?page=${currentPage}&limit=${limit}&term=${this.state.searchQuery}`)
            .then(res => {
                console.log(res.data);
                this.setState({
                    pagination: {
                        ...this.state.pagination,
                        total: res.data.total
                    },
                    pages: res.data.pages,
                    loadData: true,
                    loading: false
                });
            })
            .catch(error => {
                console.log(`Ошибка API: ${error}`);
            })
    }
    componentDidMount() {
        const {currentPage, perPage} = this.state.pagination;
        this.getPosts(perPage, currentPage);
        //
    }
    render() {
        const {pagination} = this.state;
        return (
            <div className="App">
                {this.state.loading && <Loader />}
                <div className="container">
                    <h4 className="page-header">Отслеживаемые страницы</h4>

                    <Table
                        loadData={this.state.loadData}
                        pages={this.state.pages}
                        pagination={this.state.pagination}
                        handlePageChanged={this.handlePageChanged}
                        checkOneUrl={this.checkOneUrl}
                        deleteUrl={this.deleteUrl}
                    />
                </div>
            </div>
        );
    }
}

export default Home;