import React, {useEffect, useState} from "react";
import Axios from "axios";
import Table from "./table/table";
import Loader from "./loader";
import Alert from "./Alert";

const Project = (props) => {
    const [projectId, setProjectId] = useState(props.match.params.id);
    const [tasks, setTasks] = useState([]);
    const [tasksCount, setTasksCount] = useState([]);
    const [projectInfo, setProjectInfo] = useState(null);
    const [projectSettings, setProjectSettings] = useState(null);
    const [statusSave, setStatusSave] = useState({
        show: false,
        text: '',
        classAlert: 'alert-success'
    });

    const debugHandler = (e) => {
        const newProjectSettings = Object.assign({},  projectSettings);
        newProjectSettings.debug = !newProjectSettings.debug;
        setProjectSettings(newProjectSettings);
    };

    const handleSave = () => {
        Axios.post(`http://otp.demis.ru/app/web/screenshotter-project/update-project`, projectSettings)
            .then(res => {
                setStatusSave({
                    show: true,
                    text: 'Данные успешно сохранены',
                    classAlert: 'alert-success'
                })
            })
            .catch(error => {
                setStatusSave({
                    show: true,
                    text: 'Ошибка при сохранении данных',
                    classAlert: 'alert-danger'
                })
            });
    };
    
    useEffect(() => {
        async function getTasks(id) {
            try {
                const res = await Axios.get(`http://otp.demis.ru/app/web/srceenshotter/find-tasks-by-project?id=${id}`);
                console.log(res.data);
                setProjectInfo(res.data.project);
                setTasks(res.data.tasks);
                setTasksCount(res.data.tasks.length);
                setProjectSettings(res.data.settings);
            } catch (e) {
                alert(`Что-то пошло не так`);
            }
        }
        getTasks(projectId);
        /*
        async function getProjectInfo(id) {
            try {
                const res = await Axios.get(`http://otp.demis.ru/app/web/screenshotter-project/find-one?id=${id}`);
                console.log(res.data);
            } catch (e) {
                alert(`Что-то пошло не так`);
            }
        }
        getProjectInfo(projectId);
         */

    }, []);

    if (tasks.length == 0) {
        return (
            <div className="container">
                <h4 className="page-header">
                    Проект {projectId}
                </h4>
                <p>Загрузка данных...</p>
                <Loader />
            </div>
        );
    }

    console.log('render');
    console.log(projectSettings);

    return (
        <div className="container">
            <h4 className="page-header">
                Проект {projectInfo.name}. Всего заданий: {tasksCount}
            </h4>

            <Alert show={statusSave.show} classAlert={statusSave.classAlert} onClose={() => setStatusSave({show: false})}>
                {statusSave.text}
            </Alert>

            {projectSettings && (
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="check-debug"
                            name="debug"
                            checked={projectSettings.debug}
                            onChange={debugHandler}
                        />
                        <label className="form-check-label" htmlFor="check-debug">Режим отладки</label>
                        <small id="debugHelp" className="form-text text-muted">
                            В данном режиме не выставляются задачи по каждому замечанию. Как только проведете отладку всех скриншотов, следует его активировать.
                        </small>
                    </div>
                </div>
                <div className="col-md-6">
                    <button type="submit" className="btn btn-success" onClick={handleSave}>Сохранить</button>
                </div>
            </div>
            )}
            <Table
                loadData={true}
                pages={tasks}
                pagination={{}}
            />
        </div>
    );
};

export default Project;