import React, { useState } from "react";
import api from "../Api";
import Menu from "./Menu.tsx";

export default function AddUser() {

  const handleInputChangeUser = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormDataUser({
      ...formDataUser,
      [event.target.name]: value,
    });
  };
  const handleFormSubmitAddUser = async (event) => {
    event.preventDefault();
    await api.post('/users/', formDataUser);
    setFormDataUser({
      username: ''
    })
  };

  const [formDataUser,setFormDataUser] = useState({
    username: ''
  });

    return (
        <div className="container_addUser">
          <Menu />
        <form onSubmit={handleFormSubmitAddUser}>
          <div className="mb-3 mt-3">
          <label htmlFor="username" className="form-label">
            Nome do usuário
          </label>
          <input type="text" className="form-control" id="username" name="username"
          onChange={handleInputChangeUser} value={formDataUser.username}></input>
          </div>
          <button type="submit" className="btn btn-primary">Adicionar usuário</button>  
        </form>
      </div>
    );
}