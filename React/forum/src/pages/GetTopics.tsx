import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom'
import Menu from './Menu.tsx';
import api from '../Api.js';

export default function GetTopics(){

    const [topics, setTopics] = useState<any[]>([]);
    const fetchTopics = async () => {
        const response = await api.get('/topics/1?limit=5');
        setTopics(response.data)
    };

    useEffect ( () => {
    fetchTopics();
    }, []);


    return <div className='flex flex-col gap-2'>
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
          {topics.map((topic) => (
            <tr key={topic.id}>
              <td>{topic.title}</td>
              <td>{topic.content}</td>
              <td>{topic.user_id}</td>
              <td>{topic.category}</td>
              <td>{topic.status_topic}</td>
              <td>{topic.date_insert}</td>
              <td>{topic.date_update}</td>
              <td><button><Link to={topic.id+"/editTopic"}>Editar</Link> </button> </td>
              <td><button><Link to={topic.id+"/getMessages"}>Respostas</Link> </button></td> 
              <td><button><Link to={"deletTopic/"+topic.id}>Remover</Link> </button> </td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>;
}