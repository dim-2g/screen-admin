import React, {Fragment} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
} from "react-router-dom";
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
        }
        this.getData = this.getData.bind(this);
    }
    getData(id) {
        this.setState({ loading: true })
        Axios.get(`http://otp.demis.ru/app/web/srceenshotter/find-url?id=${id}`)
            .then(res => {
                if (res.data && res.data.body) {
                    const data = JSON.parse(res.data.body);
                    console.log('data: ', data);
                    this.setState({data: res.data, result: data.result});
                }
                this.setState({loading: false});

            })
            .catch(error => {
                console.log(`Ошибка API: ${error}`);
            })
    }
    getImage(image) {
        return  `${this.state.imgHost}${image}`;
    }
    componentDidMount() {
        //const id = this.props.match.params.id;
        //this.setState({id: id}, () => {})
        console.log('Подгрузим данные для id ', this.state.id);
        this.getData(this.state.id);
    }
    render() {
        const {result} = this.state;
        return (
            <Fragment>
                {this.state.loading && <Loader />}
                <div className="container">
                    <h4 className="page-header">Детальный просмотр задания {this.state.id}</h4>
                    {result && (
                        <Fragment>
                        <p>Адрес страницы: {this.state.data.url}</p>
                        <p>Ширина экрана: {this.state.data.width}</p>
                        <p>Порог уведомлений: {this.state.data.threshold}</p>
                        <div className="row">
                            <div className="col">
                                <div className="card" style={{width: '18rem'}}>
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
                                    <a href={this.getImage(result.screenAfter)} data-fancybox="">
                                        <img src={this.getImage(result.screenAfter)} className="card-img-top" alt="..." />
                                    </a>
                                    <div className="card-body">
                                        <p className="card-text">Последний снимок</p>
                                    </div>
                                    <div className="card-footer">
                                        <p className="card-text">
                                            <small className="text-muted">{this.state.data.check_date}</small>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="card" style={{width: '18rem'}}>
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