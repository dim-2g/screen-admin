import React, {useEffect, useState} from "react";
import Axios from "axios";
import Table from "./table/table";
import Loader from "./loader";

const Project = (props) => {
    const [projectId, setProjectId] = useState(props.match.params.id);
    const [tasks, setTasks] = useState([]);
    const [tasksCount, setTasksCount] = useState([]);
    const [projectInfo, setProjectInfo] = useState(null);

    useEffect(() => {
        async function getTasks() {
            try {
                const res = await Axios.get(`http://otp.demis.ru/app/web/srceenshotter/find-tasks-by-project?id=${projectId}`);
                console.log(res.data.project);
                setProjectInfo(res.data.project);
                setTasks(res.data.tasks);
                setTasksCount(res.data.tasks.length);
            } catch (e) {
                alert(`Что-то пошло не так`);
            }
        }
        getTasks();
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

    return (
        <div className="container">
            <h4 className="page-header">
                Проект {projectInfo.name}. Всего заданий: {tasksCount}
            </h4>
            <Table
                loadData={true}
                pages={tasks}
                pagination={{}}
            />
        </div>
    );
};

export default Project;