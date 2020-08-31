import React from 'react';
import '../App.css';
import Loader from './loader';
import axios from 'axios';
const initialState = {
    domain: '',
    canCheckDomain: false,
    threshold: 1.5,
    showSettings: false,
    projectId: null,
    loading: false,
    canTransform: false,
    resolutions: [
        {
            width: 320,
            active: false
        },
        {
            width: 360,
            active: true
        },
        {
            width: 415,
            active: false
        },
        {
            width: 768,
            active: false
        },
        {
            width: 1024,
            active: false
        },
        {
            width: 1280,
            active: false
        },
        {
            width: 1920,
            active: true
        },
    ],
    results: [],
    pages: [],
    successAdd: false,
};

class Promo extends React.Component {
    constructor() {
        super();
        this.state = initialState;
        this.findDomain = this.findDomain.bind(this);
        this.openSettings = this.openSettings.bind(this);
        this.findPages = this.findPages.bind(this);
        this.setResolution = this.setResolution.bind(this);
        this.checkDomain = this.checkDomain.bind(this);
        this.correctPages = this.correctPages.bind(this);
        this.transformPages = this.transformPages.bind(this);
        this.setthreshold = this.setthreshold.bind(this);
        this.deleteRow = this.deleteRow.bind(this);
        this.addToService = this.addToService.bind(this);
        this.changeResultUrl = this.changeResultUrl.bind(this);
        this.changeResultthreshold = this.changeResultthreshold.bind(this);
        this.changeResultResolution = this.changeResultResolution.bind(this);
        this.findPagesTemplate = this.findPagesTemplate.bind(this);
    }
    checkDomain(e) {
        this.setState({
            domain: e.target.value
        });
        if (e.target.value.length > 3) {
            this.setState({
                canCheckDomain: true
            });
        } else {
            this.setState({
                canCheckDomain: false
            });
        }
    }
    findDomain() {
        this.setState({
            loading: true
        });
        axios.get(`http://otp.demis.ru/app/web/srceenshotter/find-project-id-by-domain?domain=${this.state.domain}`)
            .then(res => {
                this.setState({
                    projectId: res.data.id,
                    domain: res.data.name,
                    loading: false,
                    showSettings: true
                });
            })
            .catch(error => {
                this.setState({
                    loading: false
                });
                console.log(error);
            });
    }
    openSettings() {
        this.setState({
            showSettings: true
        });
    }
    /*
    * подгружаем из таска Шаблонные страницы
     */
    findPagesTemplate() {
        this.setState({
            loading: true
        });
        axios.get(`http://otp.demis.ru/app/web/srceenshotter/find-template-pages?id=${this.state.projectId}`)
            .then(res => {
                console.log(res);
                this.setState({
                    pages: res.data.pages,
                    loading: false
                });
                if (res.data.pages.length > 0) {
                    this.setState({
                        canTransform: true
                    });
                }
            })
            .catch(error => {
                this.setState({
                    loading: false
                });
                console.log(error);
            })
    }
    /*
    * подгружаем из промо Продвигаемые страницы
     */
    findPages() {
        console.log('Подгрузка днных из Промо');
        this.setState({
            loading: true
        });
        axios.get(`http://otp.demis.ru/app/web/srceenshotter/find-promo-pages?url=${this.state.domain}`)
            .then(res => {
                console.log(res);
                this.setState({
                    pages: res.data.pages,
                    loading: false
                });
                if (res.data.pages.length > 0) {
                    this.setState({
                        canTransform: true
                    });
                }
            })
            .catch(error => {
                this.setState({
                    loading: false
                });
                console.log(error);
            })
    }
    setResolution(e) {
        console.log(e.target.value);
        const newState = [...this.state.resolutions];
        newState.map((item) => {
            if (item.width == e.target.value) {
                item.active = e.target.checked;
            }
            return item;
        });
        this.setState({resolutions: newState});
    }
    setResolutionOld(e) {
        console.log(e.target.value);
        const newState = Object.assign({}, this.state.resolutions, {[e.target.value]: e.target.checked})
        console.log('newState ', newState);
        this.setState({resolutions: newState});
        //console.log('checked ', e.target.checked);
    }
    setthreshold(e) {
        this.setState({threshold: e.target.value.replace(',','.')});
    }
    correctPages(e) {
        const pages = e.target.value.split("\n");
        this.setState({
            pages: pages,
            canTransform: pages.length > 0
        });
    }
    transformPages() {
        console.log('Получаем окончательный список страниц');
        let results = [];
        for (let item of this.state.pages) {
            for (let resolution of this.state.resolutions) {
                if (!resolution.active) continue;
                let res = {
                    url: item,
                    resolution: resolution.width,
                    threshold: this.state.threshold
                };
                results.push(res);
            }
        }
        this.setState({
            results: results
        });
    }
    deleteRow(e, key) {
        const results = this.state.results.filter((item, index) => index != key);
        this.setState({results: results})
    }
    addToService() {
        console.log('Отправим данные в Backend');
        console.log(this.state);
        this.setState({
            loading: true
        });
        axios.post(`http://otp.demis.ru/app/web/srceenshotter/add-promo-pages`, this.state)
            .then(res => {
                this.setState({
                    loading: false
                });
                console.log('res', res.data);
                if (res.data.success) {
                    console.log('Success!');
                    let newState = initialState;
                    newState.successAdd = true;
                    this.setState(newState);
                }
                console.log('Ok');
            })
            .catch(error => {
                this.setState({
                    loading: false
                });
                console.log(error);
            })
    }
    changeResultthreshold(e, key) {
        const results = this.state.results.map((item, index) => {
            if (key == index) {
                item.threshold = e.target.value.replace(',','.');
            }
            return item;
        });
        this.setState({results: results})
    }
    changeResultUrl(e, key) {
        const results = this.state.results.map((item, index) => {
            if (key == index) {
                item.url = e.target.value.trim();
            }
            return item;
        });
        this.setState({results: results})
    }
    changeResultResolution(e, key) {
        const results = this.state.results.map((item, index) => {
            if (key == index) {
                item.resolution = e.target.value.trim();
            }
            return item;
        });
        this.setState({results: results})
    }
    componentDidMount() {
        this.setState({
            successAdd: false,
        })
    }

    render() {
        console.log(this.state);
        return (
            <div className="App">
                {this.state.loading && <Loader />}
                <div className="container">
                    <h2>Управление страницами для отслеживания</h2>
                </div>
                {this.state.successAdd && (
                    <div className="container">
                        <div class="alert alert-success" role="alert">
                            Адреса успешно добавлены
                        </div>
                    </div>
                )}
                <div className="container">
                    <div className="">
                        <div className="form-group row">
                            <div className="col-md-auto d-flex align-items-center">
                                <div className="form-control-static">Доменное имя</div>
                            </div>
                            <div className="col col__domain">
                                <label htmlFor="inputPassword2" className="sr-only align-items-center" >Доменное имя</label>
                                <input type="text" className="form-control" id="inputPassword2" placeholder="domain.tld" onChange={this.checkDomain} value={this.state.domain}/>
                            </div>
                            <div className="col-md-auto">
                                <button type="submit" className="btn btn-success" onClick={this.findDomain} disabled={!this.state.canCheckDomain}>Найти проект</button>
                            </div>
                            <div className="col-md-auto">
                                <button type="submit" className="btn btn-secondary" onClick={this.openSettings} disabled={!this.state.canCheckDomain} title="Когда нет проекта на продвижении">Вручную</button>
                            </div>
                        </div>

                        {this.state.showSettings &&
                        <div className="col-md-12">
                            <h5>Предварительные настройки</h5>
                            <div className="form-horizontal">
                                <div className="form-group row">
                                    <label htmlFor="inputEmail3" className="col-sm-3 col-form-label control-label text-right">id проекта</label>
                                    <div className="col-sm-9">
                                        <input type="text" className="form-control" placeholder="id" value={this.state.projectId} />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-sm-3 col-form-label text-right">
                                        <label htmlFor="inputEmail3" className="control-label">Список страниц. Каждый новый адрес с
                                            новой строки</label>
                                        <button
                                            type="submit"
                                            className="btn btn-secondary"
                                            onClick={this.findPagesTemplate}
                                            style={{marginTop: '10px'}}
                                        >
                                            Подгрузить шаблонные <i className="glyphicon glyphicon-cloud-download"></i>
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-secondary"
                                            onClick={this.findPages}
                                            style={{marginTop: '10px'}}
                                        >
                                            Подгрузить из промо <i className="glyphicon glyphicon-cloud-download"></i>
                                        </button>
                                    </div>
                                    <div className="col-sm-9">
                                        <textarea className="form-control" rows="12" value={this.state.pages.join("\n")} onChange={this.correctPages}></textarea>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="inputEmail3" className="col-sm-3 col-form-label control-label">Порог отличий для уведомлений</label>
                                    <div className="col-sm-9">
                                        <input type="text" className="form-control" placeholder="0.5" value={this.state.threshold} onChange={this.setthreshold}/>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="inputEmail3" className="col-sm-3 col-form-label control-label">Ширина экрана для отслеживаний</label>
                                    <div className="col-sm-9 text-left">
                                        {this.state.resolutions.map((item, index) => {
                                            return (
                                                <div className="form-group form-check" key={index}>
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id={`exampleCheck${item.width}`}
                                                        value={item.width}
                                                        onClick={this.setResolution}
                                                        checked={item.active}
                                                    />
                                                    <label className="form-check-label" htmlFor={`exampleCheck${item.width}`} >{item.width}</label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="mb-20">
                                <button type="submit" className="btn btn-success" disabled={!this.state.canTransform} onClick={this.transformPages}>Сформировать предварительные настройки</button>
                            </div>
                        </div>
                        }
                        {this.state.results.length > 0 && (
                            <div className="col-md-12" style={{marginTop: '40px'}}>
                                <h3>Страницы для отслеживания</h3>
                                <table className="table table-hover table-bordered">
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Адрес страницы</th>
                                        <th>Порог</th>
                                        <th>Ширина</th>
                                        <th>Действия</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.results.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td className="results__url"><input type="text" value={item.url} onChange={e => this.changeResultUrl(e, index)}/></td>
                                                <td className="results__threshold"><input type="text" value={item.threshold} onChange={e => this.changeResultthreshold(e, index)}/></td>
                                                <td className="results__resolution"><input type="text" value={item.resolution} onChange={e => this.changeResultResolution(e, index)}/></td>
                                                <td>
                                                    <button type="button" className="btn btn-outline-danger btn-action" onClick={e => this.deleteRow(e, index)} title="Удалить адрес из проверок">
                                                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                            <path fillRule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path>
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                                <div>
                                    <button
                                        type="submit"
                                        className="btn btn-success"
                                        style={{marginTop: '30px', marginBottom: '30px'}}
                                        onClick={this.addToService}
                                    >
                                        Добавить в сервис
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default Promo;