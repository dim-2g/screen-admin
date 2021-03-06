import React, {useEffect, useState} from "react";
import Axios from "axios";

import './queue.css';
import {Link} from "react-router-dom";

const Queue = () => {
    const initialPeriod = 10;
    const limit = 50;
    const apiUrl = `http://otp.demis.ru/app/web/srceenshotter/find-queue?limit=${limit}&timestamp=${new Date().getTime()}`;
    const [tasks, setTasks] = useState([]);
    const [countAllTasks, setCountAllTasks] = useState(0);
    const [countAllActiveTasks, setCountAllActiveTasks] = useState(0);
    //const [timer, setTimer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [period, setPeriod] = useState(initialPeriod);

    async function getQueue() {
        try {
            setLoading(true);
            const res = await Axios.get(apiUrl);
            setTasks(res.data.tasks);
            setLoading(false);
            setCountAllTasks(res.data.all_count);
            setCountAllActiveTasks(res.data.count);
        } catch (e) {
            alert(`Что-то пошло не так`);
            setLoading(false);
        }
    }

    const startTimer = () => {
        setPeriod(initialPeriod);
        const tm = setInterval(() => {
            console.log('start interval')
            setPeriod(prev => prev - 1);
        }, 1000);
        return tm;
    };

    useEffect(() => {
        getQueue();
    }, []);

    useEffect(() => {
        let timer = startTimer();
        const interval = setInterval(() => {
            getQueue();
            clearInterval(timer);
            timer = startTimer();
        }, initialPeriod * 1000);

        return () => {
            clearInterval(interval);
        }
    }, []);

    const indicator = !loading
        ? `${period}s`
        : (
            <div className="spinner-border spinner-border-sm" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        );

    return (
        <div className="container">
            <h4 className="page-header">
                Очередь заданий, которые выполнятся в ближайшее время ({indicator})
            </h4>
            <p>Всего необработано заданий: {countAllActiveTasks} / {countAllTasks}</p>
            <div className="queue-list">
                <table className="table table-pages">
                    <thead className="thead-light">
                        <tr>
                            <th>#</th>
                            <th>Дата посл. проверки</th>
                            <th>Проверяемый адрес</th>
                            <th>Ширина</th>
                        </tr>
                    </thead>
                    <tbody>
                    {tasks && tasks.map((item, index) => {
                        return (
                            <tr className="queue-item" key={item.id}>
                                <td>{index+1}</td>
                                <td>{item.check_date}</td>
                                <td>
                                    <Link
                                        to={`/edit/${item.id}`}
                                        className=""
                                        title="Редактировать"
                                    >
                                        {item.url}
                                    </Link>
                                </td>
                                <td>{item.width}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Queue;