import React, {useEffect, useState} from "react";
import Axios from "axios";
import Screens from "./screens";
import Alert from "./Alert";
import {Link} from "react-router-dom";

const Edit = (props) => {
    const [pageId, setPageId] = useState(props.match.params.id);
    const [task, setTask] = useState(null);
    const [showDebug, setShowDebug] = useState(false);
    const [statusSave, setStatusSave] = useState({
        show: false,
        text: '',
        classAlert: 'alert-success'
    });

    const setValue = (e) => {
        let newTask;
        switch (e.target.name) {
            case 'active':
                newTask = {...task, active: !task.active};
                break;
            default:
                newTask = {...task, [e.target.name]: e.target.value};
        }

        console.log(newTask);
        setTask(newTask);
    };

    const toggleDebug = (e) => {
        e.preventDefault();
        setShowDebug(prev => !prev);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        Axios.post(`http://otp.demis.ru/app/web/srceenshotter/update-task`, task)
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
        async function getTask() {
            try {
                const res = await Axios.get(`http://otp.demis.ru/app/web/srceenshotter/find-task-once?id=${pageId}`);
                let issue = {...res.data};
                issue.body = JSON.parse(res.data.body);
                setTask(issue);
            } catch (e) {
                alert(`Что-то пошло не так`);
            }
        }
        getTask();
    }, []);

    if (!task) {
        return (
            <div className="container">
                <h4 className="page-header">
                    Редактирование задания {pageId}
                </h4>
                <p>Ожидание загрузки данных...</p>
            </div>
        );
    }

    return (
        <div className="container">
            <h4 className="page-header">
                Редактирование задания {pageId}
            </h4>

            <div className="btn-group btn-group-page" role="group" aria-label="Basic example">
                <Link
                    to={`/detail/${pageId}`}
                    className="btn btn-info btn-sm"
                    title="Детальный просмотр"
                >
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-layers-half" fill="currentColor"
                         xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd"
                              d="M3.188 8L.264 9.559a.5.5 0 0 0 0 .882l7.5 4a.5.5 0 0 0 .47 0l7.5-4a.5.5 0 0 0 0-.882L12.813 8l-4.578 2.441a.5.5 0 0 1-.47 0L3.188 8z"/>
                        <path fillRule="evenodd"
                              d="M7.765 1.559a.5.5 0 0 1 .47 0l7.5 4a.5.5 0 0 1 0 .882l-7.5 4a.5.5 0 0 1-.47 0l-7.5-4a.5.5 0 0 1 0-.882l7.5-4zM1.563 6L8 9.433 14.438 6 8 2.567 1.562 6z"/>
                    </svg>
                    &nbsp;
                    Детальный просмотр
                </Link>
            </div>

            <Alert show={statusSave.show} classAlert={statusSave.classAlert} onClose={() => setStatusSave({show: false})}>
                {statusSave.text}
            </Alert>

            <form onSubmit={submitHandler}>
                <div className="form-group">
                    <label htmlFor="check-url">Проверяемый адрес</label>
                    <input
                        type="url"
                        className="form-control"
                        id="check-url"
                        name="url"
                        aria-describedby="check-url"
                        value={task.url}
                        onChange={setValue}
                    />
                    <small id="checkUrlHelp" className="form-text text-muted"></small>
                </div>
                <div className="form-group">
                    <label htmlFor="check-threshold">Порог отличий</label>
                    <input
                        type="text"
                        className="form-control"
                        id="check-threshold"
                        name="threshold"
                        value={task.threshold}
                        onChange={setValue}
                    />
                    {task.body && (
                    <small id="thresholdHelp" className="form-text text-muted">
                        Показатель отличий по последней проверке ({task.check_date}): <b>{task.body.result.misMatchPercentage}</b>
                        &nbsp;&nbsp;&nbsp;
                        <a href="#" onClick={toggleDebug}>Показать отладку</a>
                    </small>
                    )}
                </div>

                {showDebug && (
                    <div class="edit__debug">
                        <div className="form-group">
                            <label htmlFor="check-threshold">Данные по последней проверке</label>
                            <pre><code>{JSON.stringify(task.body.result, null, 4)}</code></pre>
                        </div>
                        <Screens
                            screenBefore={task.body.result.screenBefore}
                            screenAfter={task.body.result.screenAfter}
                            screenDiff={task.body.result.screenDiff}
                            check_date={task.check_date}
                        />
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="check-threshold">Ширина экрана</label>
                    <input
                        type="text"
                        className="form-control"
                        id="check-threshold"
                        name="width"
                        value={task.width}
                        onChange={setValue}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="check-threshold">Таймаут перед скриншотом (мс)</label>
                    <input
                        type="text"
                        className="form-control"
                        id="check-manual_timeout"
                        name="manual_timeout"
                        value={task.manual_timeout}
                        onChange={setValue}
                    />
                    <small id="manualTimeoutHelp" className="form-text text-muted">
                        Следует добавить небольшой таймаут, если на снимках есть различия в интерактивных элекентах -
                        не прогрузилось Youtube видео, не отобразаился консультант
                    </small>
                </div>

                <div className="form-group form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="check-active"
                        name="active"
                        checked={task.active}
                        onChange={setValue}
                    />
                    <label className="form-check-label" htmlFor="check-active">Активный</label>
                </div>
                <button type="submit" className="btn btn-success">Сохранить</button>
            </form>

        </div>
    );
};

export default Edit;
