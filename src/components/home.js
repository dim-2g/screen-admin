import React from 'react';
import '../App.css';
import Pager from 'react-pager';
import Loader from './loader';
import Axios from 'axios';
import Row from './table/row';

class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            pages: null,
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
        console.log(`Итого ${currentPage} - ${limit}`);
        this.setState({ loading: true })
        Axios.get(`http://otp.demis.ru/app/web/srceenshotter/find-pages?page=${currentPage}&limit=${limit}`)
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
        console.log('Начинаем подгрузку данных');
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
                    <h4>Отслеживаемые страницы</h4>
                    <table className="table table-pages">
                        <thead className="thead-light">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Страница</th>
                                <th scope="col">Дата проверки</th>
                                <th scope="col">Результат</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.state.pages && this.state.pages.map(item => {
                            return (
                                <Row
                                    key={item.id} 
                                    {...item}
                                />
                            );
                        })}    
                        </tbody>
                    </table>
                    <div className="row justify-content-md-center">
                        {this.state.loadData && 
                            <Pager
                                total={pagination.total}
                                current={pagination.currentPage - 1}
                                visiblePages={pagination.visiblePage}
                                
                                className="pagination-sm pull-right"
                                onPageChanged={this.handlePageChanged}
                            />
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;