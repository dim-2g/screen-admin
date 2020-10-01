import React, { Fragment } from 'react';
import Axios from 'axios';
import Loader from './loader';
import {Link} from "react-router-dom";
import classNames from "classnames";

class Projects extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            projects: null, 
            loading: false,
        }
        this.getProjects = this.getProjects.bind(this);
        this.initProjects = this.initProjects.bind(this);
    }
    getProjects() {
        return Axios.get(`http://otp.demis.ru/app/web/screenshotter-project/find-projects`);
    }
    initProjects() {
        this.setState({ loading: true })
        this.getProjects()
            .then(res => {
                this.setState({ 
                    loading: false,
                    projects: res.data
                })
            })
            .catch(error => {
                console.log(`Ошибка API: ${error}`);
            })
    }
    componentDidMount() {
        this.initProjects();
    }
    render() {
        return (
            <Fragment>
                {this.state.loading && <Loader />}
                <div className="container">
                    <h4 className="page-header">Проекты</h4>
                    <table className="table table-pages">
                        <thead className="thead-light">
                            <tr>
                                <th>id</th>
                                <th>Название</th>
                                <th>Кол-во страниц</th>
                                <th>Боевой режим</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.state.projects && this.state.projects.map(item => {
                            console.log(item.debug)
                            const badgeDebugClass = classNames(
                                'badge',
                                { 'badge-success': item.debug == 0},
                                { 'badge-warning': item.debug == 1}
                            );
                            return (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td><Link to={`/project/${item.id}`}>{item.name}</Link></td>
                                    <td>{item.count}</td>
                                    <td><span className={badgeDebugClass}>{item.debug == 1 ? 'Нет' : 'Да'}</span></td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                    
                </div>
            </Fragment>
        );
    }
}

export default Projects;