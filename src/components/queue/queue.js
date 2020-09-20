import React, {useEffect, useState} from "react";
import Axios from "axios";

import './queue.css';

const Queue = () => {
    const apiUrl = `http://otp.demis.ru/app/web/srceenshotter/find-queue?limit=20&timestamp=${new Date().getTime()}`;
    const [tasks, setTasks] = useState([]);
    //const [timer, setTimer] = useState(null);
    const [loading, setLoading] = useState(false);
    const initialPeriod = 10;
    const [period, setPeriod] = useState(initialPeriod);

    async function getQueue() {
        try {
            setLoading(true);
            const res = await Axios.get(apiUrl);
            setTasks(res.data.tasks);
            setLoading(false);
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
                                <td>{item.url}</td>
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