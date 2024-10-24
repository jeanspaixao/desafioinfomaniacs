
import {zodResolver} from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import {Link, useParams} from 'react-router-dom'
import {z} from 'zod';
import Menu from './Menu.tsx';
import api from '../Api.js';
import { Topic } from '../types/Topic.ts';
import {Input} from '../ui/Input.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select.tsx';
import { Button } from '../ui/Button.tsx';

const formSchema = z.object({
    title: z.string(),
    content: z.string(),
    user_id: z.number(),
    status_topic: z.string(),
    category: z.string(),
    date_insert: z.string(),
    date_update: z.string(),
})
    
type FormValues = z.infer<typeof formSchema>;
      
type TopicFormProps = {
    topic?: Topic;
};

interface IFormInput {
    title: string,
    content: string,
    user_id: number,
    status_topic: { label: string; value: string },
    category: string,
    date_insert: string,
    date_update: string
  }

export default function EditTopic(){ 
    
    const  topicId  = useParams()

    var newStatus_topic;

    const [topic, setTopic] = useState<any>([]);
    
    const handleFormSubmitEditTopic = async (event) => {
        event.preventDefault();
        var now = new Date();
        var nowString = ("0" + now.getDate()).slice(-2) + "/" + ("0"+(now.getMonth()+1)).slice(-2)
         + "/" + now.getFullYear() + " " + ("0" + now.getHours()).slice(-2)
        + ":" + ("0" + now.getMinutes()).slice(-2);
        formDataTopic.user_id = "1";
        formDataTopic.date_insert = nowString;
        formDataTopic.date_update = nowString;
        await api.put('/topic/'+topicId.id, formDataTopic);
        fetchTopic();
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
      
    const [formDataTopic,setFormDataTopic] = useState({
        title: '',
        content: '',
        user_id: '',
        status_topic: '',
        category: '',
        date_insert: '',
        date_update: ''
    });
  
    const fetchTopic = async () => {
        const response = await api.get('/topic/'+topicId.id);
        setTopic(response.data)
        setFormDataTopic({
            title: response.data.title,
            content: response.data.content,
            user_id: response.data.user_id,
            status_topic: response.data.status_topic,
            category: response.data.category,
            date_insert: response.data.date_insert,
            date_update:response.data.date_update
          })
    };

    useEffect ( () => {
    fetchTopic();
    }, []);

    const handleInputChangeTopic = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormDataTopic({
        ...formDataTopic,
        [event.target.name]: value,
    });
    };


    return (
        <div className="container_editTopic">
        <Menu />
        <form onSubmit={handleFormSubmitEditTopic}>
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
        
        <label htmlFor="category" className="form-label">
        Situação
        </label>

        <select className='form-control' id='status_topic' name = 'status_topic' value={formDataTopic.status_topic}>
        <option value="Aberto">Aberto</option>
        <option value="Fechado">Fechado</option>
        </select>
        <br/>
        <button type="submit" className="btn btn-primary">Atualizar</button>

        </form>
        </div>);
}

