import React from 'react';
import { Link } from 'react-router-dom'

const Nav = () => {
    return (
        <div className="header">
            <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
                <div className="container">
                    <a className="navbar-brand" href="/">
                        <img src="/logo.png" alt="" className="d-inline-block align-top" alt="" loading="lazy"/>
                        ScreenShotter
                    </a>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link to='/' className="nav-link">Страницы</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/projects' className="nav-link">Проекты</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/add' className="nav-link">Добавить адрес</Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/promo' className="nav-link">Массово добавить</Link>
                            </li>
                        </ul>

                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Nav;