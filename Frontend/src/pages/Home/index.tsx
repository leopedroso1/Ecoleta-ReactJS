import React from 'react';
import logo from '../../assets/logo.svg';
// React Icons - npm install react-icons >> VERY USEFUL!!!
import { FiLogIn } from 'react-icons/fi'; // md => material design / fi => Feather Icon / fa => Font Awesome
import './styles.css'; // We just wanna execute the code, so we can do this way

// SPA Link: Instead of using the anchor tag <a href="" />, we can use this tool in order to keep our SPA performance and concept
import { Link } from 'react-router-dom';

const Home = () => {
   
    return (
    <div id="page-home">
        <div className="content">
            <header>
            <img src={logo} alt="Ecoleta" />
            </header>
            <main>
                <h1>Seu marketplace de coleta de resíduos.</h1>
                <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</p>
            <Link to="/create-point"> 
                <span><FiLogIn /></span>
                <strong>Cadastre um ponto de coleta</strong>
            </Link>
            </main>
        </div>
    </div>
    );

}

export default Home;
