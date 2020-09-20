import React, { Fragment } from 'react';
import {debounce} from 'lodash';
import Axios from 'axios';
import dimensions from './dimension';

class Add extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            project_id: '',
            url: '',
            domain: null,
            threshold: 1.5,
            width: null,
            errorUrlText: null,
            trueUrl: false,
            dimensions: dimensions,
            success: false,
        }
        this.findProject = debounce(this.findProject.bind(this), 500);
        this.setThreshold = this.setThreshold.bind(this);
        this.changeWidth = this.changeWidth.bind(this);
        this.saveOneUrl = this.saveOneUrl.bind(this);
    }
    saveOneUrl(e) {
        console.log('Сохранение адреса');
        e.preventDefault();
        Axios.post(`http://otp.demis.ru/app/web/srceenshotter/save-one-url`, this.state)
            .then(res => {
                this.setState({
                    domain: null,
                    errorUrlText: null,
                    project_id: null,
                    url: '',
                    success: true,
                }); 
            })
            .catch(error => {
                console.log('Ошибка API при сохранении страницы')
            })
    }
    findDomain(str) {
        try {
            let url = new URL(str);
            return url.host.replace('www.', '');
        } 
        catch(error) {
            str = 'https://' + str;
            try {
                let url = new URL(str);
                return url.host.replace('www.', '');
            } catch(error) {
                return null;
            }
        }
    }
    findProject(str) {
        const domain = this.findDomain(str);
        try{
            this.setState({
                domain: domain,
                errorUrlText: null,
                project_id: null,
                url: str
            });
            Axios.get(`http://otp.demis.ru/app/web/srceenshotter/find-project-id-by-domain?domain=${domain}`)
                .then(res => {
                    if (res.data.id) {
                        this.setState({
                            project_id: res.data.id
                        });
                    }
                    console.log(res);
                })
                .catch(error => {
                    console.log(`ошибка API: ${error}`);        
                })
        } catch(error) {
            this.setState({
                //trueUrl: false,
                errorUrlText: 'Введен некорректный адрес',
            });
            console.log(`ошибка ${error}`);
        }
        
    }
    setThreshold(e) {
        this.setState({threshold: e.target.value.replace(',', '.')});
    }
    changeWidth(e, width) {
        
        const dimensions = this.state.dimensions.map(item => {
            if (item.width === width) {
                item.active = !item.active;
            }
            return item;
        })
        
        console.log('---', width);
        this.setState({dimensions: dimensions});
    }
    render() {
        let helpText = 'После заполнения будет осуществляться поиск проекта';
        let errorClass = '';
        if (this.state.domain) {
            helpText = `Найден домен ${this.state.domain}`;
        }
        if (this.state.errorUrlText) {
            errorClass = 'error-text';
            helpText = 'В указанной строке не удалось обнаружить домен';
        }
        return (
            <div className="container">
                <h4 className="page-header">Добавление страницы</h4>
                <div>
                    {this.state.success && (
                        <div class="alert alert-success" role="alert">
                            Адрес успешно добавлен
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="url">Адрес страницы</label>
                        <input type="text" className="form-control" id="url" aria-describedby="urlHelp" onChange={e => this.findProject(e.target.value)}/>
                        <small id="urlHelp" className={`form-text text-muted ${errorClass}`}>{helpText}</small>
                    </div>
                    {this.state.project_id && (
                        <Fragment>
                            <div className="form-group">
                                <label htmlFor="project_id">ID проекта</label>
                                <input type="text" className="form-control" id="project_id" value={this.state.project_id} readOnly={true}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="threshold">Порог срабатывания уведомлений</label>
                                <input type="text" className="form-control" id="threshold" value={this.state.threshold} onChange={this.setThreshold}/>
                                <small id="urlHelp" className="form-text text-muted">% отличий эталона от текущего состояния</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="width">Ширина экрана</label>
                                <div>
                                {this.state.dimensions.map(item => {
                                    return (
                                        <div className="form-check form-check-inline" key={item.width}>
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                id={`width${item.width}`} 
                                                value={item.width} 
                                                checked={item.active} 
                                                onChange={e => this.changeWidth(e, item.width)}
                                            />
                                            <label className="form-check-label" htmlFor={`width${item.width}`}>{item.width}</label>
                                        </div>
                                    );
                                })}
                                </div>
                                <small id="urlHelp" className="form-text text-muted">Высота всей страницы будет на скриншоте</small>
                            </div>
                            <button className="btn btn-primary" onClick={e => this.saveOneUrl(e)}>Сохранить</button>        
                        </Fragment>
                    )}
                    
                </div>
            </div>
        );
    }
}

export default Add;