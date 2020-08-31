import React, {Fragment} from 'react';
import Axios from "axios";
import Loader from "./loader";

class Detail extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            data: null,
            result: null,
            loading: false,
            imgHost: 'http://uto-screen.demis.ru',
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
        Axios.get(`http://uto-screen.demis.ru/once?id=${id}`)
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
        Axios.get(`http://uto-screen.demis.ru/update?id=${id}`)
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
                        <button
                            type="button"
                            className="btn btn-success btn-sm btn-recheck"
                            onClick={e => this.reCheck(e, this.state.id)}
                        >
                            Перепроверить
                        </button>
                        <button
                            className="btn btn-secondary btn-sm"
                            title="Сделать эталоном"
                            onClick={e => this.setEtalon(e, this.state.id)}
                        >
                            Обновить эталон
                        </button>
                        <button
                            className="btn btn-info btn-sm"
                            title="Выставить задачу на основного исполнителя"
                            onClick={e => this.setIssue(e, this.state.id)}
                        >
                            Выставить задачу
                        </button>
                    </h4>
                    {this.state.issue && (
                        <div class="alert alert-success" role="alert">
                            Выставлена задача <a target="_blank" href={`https://tm.demis.ru/issues/${this.state.issue}`}>#{this.state.issue}</a>
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

                            <div className="row">
                                <div className="col">
                                    <div className="card" style={{width: '18rem'}}>
                                        <div className="card-header">
                                            <p className="card-text">Эталон</p>
                                        </div>
                                        <a href={this.getImage(result.screenBefore)} data-fancybox="">
                                            <img src={this.getImage(result.screenBefore)} className="card-img-top" alt="..." />
                                        </a>
                                        <div className="card-body">
                                            <p className="card-text">Эталон</p>
                                        </div>
                                        <div className="card-footer">
                                            <p className="card-text">
                                                <small className="text-muted">Дата создания эталона</small>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card" style={{width: '18rem'}}>
                                        <div className="card-header">
                                            <p className="card-text">Последний снимок</p>
                                        </div>
                                        <a href={this.getImage(result.screenAfter)} data-fancybox="">
                                            <img src={this.getImage(result.screenAfter)} className="card-img-top" alt="..." />
                                        </a>
                                        <div className="card-footer">
                                            <div className="card-text">
                                                <p><small className="text-muted">{this.state.data.check_date}</small></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card" style={{width: '18rem'}}>
                                        <div className="card-header">
                                            <p className="card-text">Различия</p>
                                        </div>
                                        <a href={this.getImage(result.screenDiff)} data-fancybox="">
                                        <img src={this.getImage(result.screenDiff)} className="card-img-top" alt="..." />
                                        </a>
                                        <div className="card-body">
                                            <p className="card-text">Разница</p>
                                        </div>
                                        <div className="card-footer">
                                            <p className="card-text">
                                                <small className="text-muted">{this.state.data.result}</small>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="actions">
                                <p>Если всё в порядке, то можно обновить эталенный макет текущим снимком</p>
                            </div>
                        </Fragment>
                    )}
                </div>
            </Fragment>
        );
    }
}

export default Detail;