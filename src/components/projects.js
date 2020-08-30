import React, { Fragment } from 'react';
import Axios from 'axios';
import Loader from './loader';

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
        return Axios.get(`http://otp.demis.ru/app/web/srceenshotter/find-projects`);
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
                            <th>id</th>
                            <th>Название</th>
                            <th>Кол-во страниц</th>
                        </thead>
                        <tbody>
                        {this.state.projects && this.state.projects.map(item => {
                            return (
                                <tr>
                                    <td>{item.project_id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.count}</td>
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