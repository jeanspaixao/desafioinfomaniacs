import React from "react";
import { Link } from "react-router-dom";

export default function Menu() {


  
    return (

            <div className="flex flex-row">
                <ul className="container-list">
                    <li><Link to="/">Página inicial</Link></li>
                    <li><Link to="/addUser">Adicionar usuário</Link></li>
                    <li><Link to="/getTopics">Ver postagens</Link></li>
                    <li><Link to="/addTopic">Nova postagem</Link></li>
                </ul>
            </div>
          );
}

