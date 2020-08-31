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
                        <form className="form-inline my-2 my-lg-0">
                            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-info my-2 my-sm-0" type="submit">Search</button>
                        </form>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Nav;