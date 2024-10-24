

import React, { useEffect, useState } from 'react';
import {Link}from 'react-router-dom'
import { useParams } from 'react-router';
import Menu from './Menu.tsx';
import api from '../Api.js';


export default function GetMessages(){

    const  topicId  = useParams()

    const [topic, setTopic] = useState<any>([]);
    const fetchTopic = async () => {
        const response = await api.get('/topic/'+topicId.id);
        setTopic(response.data)
    };

    const fetchMessages = async () => {
        const response = await api.get('/messages/'+topicId.id);
        setMessages(response.data)
    };

    const handleFormSubmitAddMessage = async (event) => {
        event.preventDefault();
        var now = new Date();
        var nowString = ("0" + now.getDate()).slice(-2) + "/" + ("0"+(now.getMonth()+1)).slice(-2)
         + "/" + now.getFullYear() + " " + ("0" + now.getHours()).slice(-2)
        + ":" + ("0" + now.getMinutes()).slice(-2);
        formDataMessage.user_id = "1";
        formDataMessage.date_insert = nowString;
        formDataMessage.date_update = nowString;
        formDataMessage.message_position = messages.length + 1;
        formDataMessage.topic_id = Number(topicId.id);
        await api.post('/message/'+topicId.id, formDataMessage);
        fetchMessages();
        setFormDataMessage({
        topic_id: 0,
        message_position: 0,
        user_id: '',
        message: '',
        date_insert: '',
        date_update: ''
        })
      };
      
    const [messages, setMessages] = useState<any[]>([]);
    const [formDataMessage,setFormDataMessage] = useState({
        topic_id: 0,
        message_position: 0,
        user_id: '',
        message: '',
        date_insert: '',
        date_update: ''
    });
  
    const handleInputChangeMessage = (event) => {
    const value = event.target.value;
    setFormDataMessage({
        ...formDataMessage,
        [event.target.name]: value,
    });
    };

    useEffect ( () => {
        fetchTopic();
        fetchMessages();
    
    }, []);

    return (
    <div className="container_getMessages">
        <Menu />

        <table className="table table-striped table-bordered table-hover">
        <thead>
          <tr>
            <th>Título</th>
            <th>Conteúdo</th>
            <th>Autor</th>
            <th>Categoria</th>
            <th>Status </th>
            <th>Data da postagem</th>
            <th>Última atualização</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
            <tr>
              <td>{topic.title}</td>
              <td>{topic.content}</td>
              <td>{topic.user_id}</td>
              <td>{topic.category}</td>
              <td>{topic.status_topic}</td>
              <td>{topic.date_insert}</td>
              <td>{topic.date_update}</td>
              <td><button><Link to={"/"+topic.id}>Editar</Link> </button>  
              <button><Link to={"deletTopic/"+topic.id}>Remover</Link> </button> </td>
            </tr>
        </tbody>
      </table>

      <table className="table table-striped table-bordered table-hover">
        <thead>
          <tr>
            <th>Mensagem</th>
            <th>Usuário</th>
            <th>Data de adição</th>
            <th>Data de atualização</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((message) => (
            <tr key={message.id}>
              <td>{message.message}</td>
              <td>{message.user_id}</td>
              <td>{message.date_insert}</td>
              <td>{message.date_update}</td>
              <td><button><Link to={"editTopic/"+topic.id}>Editar</Link> </button> 
              <button><Link to={"deletTopic/"+topic.id}>Remover</Link> </button> </td>
            </tr>
          ))}
        </tbody>
      </table>

        <form onSubmit={handleFormSubmitAddMessage}>
        <div className="mb-3 mt-3">
        <label htmlFor="message" className="form-label">
            Mensagem
        </label>
        <input type="text" className="form-control" id="message" name="message"
        onChange={handleInputChangeMessage} value={formDataMessage.message}></input>
        </div>
        <button type="submit" className="btn btn-primary">Adicionar postagem</button>

        </form>
        </div>);
}

