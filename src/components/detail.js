import React, {Fragment} from 'react';
import Axios from "axios";
import Loader from "./loader";
import {Link} from "react-router-dom";
import Screens from "./screens";

class Detail extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            data: null,
            result: null,
            loading: false,
            imgHost: 'http://screenshotter.demis.ru',
            issue: null,
            updateSuccess: false,
        }
        this.getData = this.getData.bind(this);
        this.setEtalon = this.setEtalon.bind(this);
        this.reCheck = this.reCheck.bind(this);
        this.setIssue = this.setIssue.bind(this)
    }
    reCheck(e, id) {
        this.setState({ loading: true, data: null, result: null });
        Axios.get(`http://screenshotter.demis.ru/once?id=${id}`)
            .then(res => {
                this.getData(this.state.id);
                this.setState({ loading: false });
            })
            .catch(error => {
                console.log(`Ошибка API: ${error}`);
            })
    }
    setEtalon(e, id) {
        e.preventDefault();
        this.setState({ loading: true });
        Axios.get(`http://screenshotter.demis.ru/update?id=${id}`)
            .then(res => {
                this.setState({updateSuccess: true, loading: false});
                this.getData(this.state.id);
            })
            .catch(error => {
                console.log(`Ошибка API: ${error}`);
            })
    }
    setIssue(e, id) {
        this.setState({ loading: true });
        Axios.get(`http://otp.demis.ru/app/web/srceenshotter/set-issue?id=${id}`)
            .then(res => {
                this.setState({
                    loading: false,
                    issue: res.data.issue,
                });

            })
            .catch(error => {
                console.log(`Ошибка API: ${error}`);
            })

    }
    getData(id) {
        this.setState({ loading: true })
        Axios.get(`http://otp.demis.ru/app/web/srceenshotter/find-url?id=${id}`)
            .then(res => {
                if (res.data && res.data.body) {
                    const data = JSON.parse(res.data.body);
                    this.setState({data: res.data, result: data.result});
                }
                this.setState({loading: false});

            })
            .catch(error => {
                console.log(`Ошибка API: ${error}`);
            })
    }
    getImage(image) {
        const date = new Date();
        return  `${this.state.imgHost}${image}?${date.getTime()}`;
    }
    componentDidMount() {
        this.setState({issue: null, updateSuccess: false});
        this.getData(this.state.id);
    }
    render() {
        const {result} = this.state;
        return (
            <Fragment>
                {this.state.loading && <Loader />}
                <div className="container">
                    <h4 className="page-header">
                        Детальный просмотр задания {this.state.id} 
                    </h4>

                    <div className="btn-group btn-group-page" role="group" aria-label="Basic example">
                        <button
                            type="button"
                            className="btn btn-info btn-sm btn-recheck"
                            onClick={e => this.reCheck(e, this.state.id)}
                        >
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-arrow-repeat" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"></path>
                                <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"></path>
                            </svg>
                            &nbsp;
                            Перепроверить
                        </button>
                        <button
                            className="btn btn-secondary btn-sm"
                            title="Сделать эталоном"
                            onClick={e => this.setEtalon(e, this.state.id)}
                        >
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-check"
                                 fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd"
                                      d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
                            </svg>
                            &nbsp;
                            Обновить эталон
                        </button>
                        <Link
                            to={`/edit/${this.state.id}`}
                            className="btn btn-success btn-sm"
                            title="Редактировать"
                        >
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-pencil-square"
                                 fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fillRule="evenodd"
                                      d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                            </svg>
                            &nbsp;
                            Редактировать
                        </Link>
                    </div>

                    {this.state.issue && (
                        <div class="alert alert-success" role="alert">
                            Выставлена задача <a rel="noopener noreferrer" target="_blank" href={`https://tm.demis.ru/issues/${this.state.issue}`}>#{this.state.issue}</a>
                        </div>
                    )}
                    {this.state.updateSuccess && (
                        <div class="alert alert-success" role="alert">
                            Эталон успешно обновлен
                        </div>
                    )}
                    {result && (
                        <Fragment>
                            <div className="detail-params">
                                <p>Адрес страницы: {this.state.data.url}<br />
                                Ширина экрана: {this.state.data.width}<br />
                                Порог уведомлений: {this.state.data.threshold}<br />
                                Результат: {this.state.data.result}</p>
                            </div>

                            <Screens
                                screenBefore={result.screenBefore}
                                screenAfter={result.screenAfter}
                                screenDiff={result.screenDiff}
                                check_date={this.state.data.check_date}
                            />


                            <div className="actions">
                                <p>Если всё в порядке, то можно обновить эталенный макет текущим снимком</p>
                                <p>В противном случае, необходимо выставить задачу на исправление</p>
                                <button
                                    className="btn btn-info btn-sm"
                                    title="Выставить задачу на основного исполнителя"
                                    onClick={e => this.setIssue(e, this.state.id)}
                                >
                                    Выставить задачу
                                </button>
                            </div>
                        </Fragment>


                    )}
                </div>
            </Fragment>
        );
    }
}

export default Detail;