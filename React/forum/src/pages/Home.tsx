import React, { useState } from "react";
import api from "../Api";
import { Link } from "react-router-dom";
import Menu from "./Menu.tsx";

export default function Home() {


  
    return (
          <div className="home">
            <Menu />
            Seja bem-vindo ao nosso fórum! Aqui você pode encontrar a resposta para as suas dúvidas.
          </div>
          );
}
