

import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom'
import Menu from './Menu.tsx';
import api from '../Api.js';


export default function TopicList(){

    const handleFormSubmitAddTopic = async (event) => {
        event.preventDefault();
        var now = new Date();
        var nowString = ("0" + now.getDate()).slice(-2) + "/" + ("0"+(now.getMonth()+1)).slice(-2)
         + "/" + now.getFullYear() + " " + ("0" + now.getHours()).slice(-2)
        + ":" + ("0" + now.getMinutes()).slice(-2);
        formDataTopic.user_id = "1";
        formDataTopic.status_topic = "Aberto";
        formDataTopic.date_insert = nowString;
        formDataTopic.date_update = nowString;
        await api.post('/topic/', formDataTopic);
        fetchTopics();
        setFormDataTopic({
          title: '',
          content: '',
          user_id: '',
          status_topic: '',
          category: '',
          date_insert: '',
          date_update:''
        })
      };
      
    const [topics, setTopics] = useState([]);
    const [formDataTopic,setFormDataTopic] = useState({
        title: '',
        content: '',
        user_id: '',
        status_topic: '',
        category: '',
        date_insert: '',
        date_update: ''
    });
  
    const fetchTopics = async () => {
        const response = await api.get('/topics/1?limit=5');
        setTopics(response.data)
    };

    useEffect ( () => {
    fetchTopics();
    }, []);

    const handleInputChangeTopic = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormDataTopic({
        ...formDataTopic,
        [event.target.name]: value,
    });
    };

    return (
    <div className="container_addTopic">
        <Menu />
        <form onSubmit={handleFormSubmitAddTopic}>
        <div className="mb-3 mt-3">
        <label htmlFor="title" className="form-label">
            Assunto
        </label>
        <input type="text" className="form-control" id="title" name="title"
        onChange={handleInputChangeTopic} value={formDataTopic.title}></input>
        </div>

        <div className="mb-3 mt-3">
        <label htmlFor="content" className="form-label">
            Conteúdo
        </label>
        <input type="text" className="form-control" id="content" name="content"
        onChange={handleInputChangeTopic} value={formDataTopic.content}></input>
        </div>
        <div className="mb-3 mt-3">
        <label htmlFor="category" className="form-label">
            Categoria
        </label>
        <input type="text" className="form-control" id="category" name="category"
        onChange={handleInputChangeTopic} value={formDataTopic.category}></input>
        </div>

        <button type="submit" className="btn btn-primary">Adicionar postagem</button>

        </form>
        </div>);
}

