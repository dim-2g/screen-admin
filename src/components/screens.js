import React from "react";

const Screens = (props) => {

    const imgHost = 'http://screenshotter.demis.ru';

    const getImage = (image) => {
        const date = new Date();
        return  `${imgHost}${image}?${date.getTime()}`;
    };

    return (
        <div className="block-screens">
            <div className="row">
                <div className="col">
                    <div className="card" style={{width: '18rem'}}>
                        <div className="card-header">
                            <p className="card-text">Эталон</p>
                        </div>
                        <a href={getImage(props.screenBefore)} data-fancybox="">
                            <img src={getImage(props.screenBefore)} className="card-img-top" alt="..."/>
                        </a>
                    </div>
                </div>
                <div className="col">
                    <div className="card" style={{width: '18rem'}}>
                        <div className="card-header">
                            <p className="card-text">Последний снимок</p>
                        </div>
                        <a href={getImage(props.screenAfter)} data-fancybox="">
                            <img src={getImage(props.screenAfter)} className="card-img-top" alt="..."/>
                        </a>
                    </div>
                </div>
                <div className="col">
                    <div className="card" style={{width: '18rem'}}>
                        <div className="card-header">
                            <p className="card-text">Различия</p>
                        </div>
                        <a href={getImage(props.screenDiff)} data-fancybox="">
                            <img src={getImage(props.screenDiff)} className="card-img-top" alt="..."/>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Screens;

