
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

export default function EditMessage(){ 
    
    const  topicId  = useParams()

    const [topic, setTopic] = useState<any>([]);
    
      
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
    const fetchMessages = async () => {
        const response = await api.get('/messages/'+topicId.id);
        setMessages(response.data)
    };

    useEffect ( () => {
    fetchTopic();
    fetchMessages();
    }, []);
    const [formDataMessage,setFormDataMessage] = useState({
        topic_id: 0,
        message_position: 0,
        user_id: '',
        message: '',
        date_insert: '',
        date_update: ''
    });

    const [messages, setMessages] = useState<any[]>([]);

    const handleFormSubmitEditMessage = async (event) => {
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
        await api.put('/topic/'+topicId.id+'/message/'+topicId.idMessage, formDataMessage);
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

    const handleInputChangeMessage = (event) => {
    const value = event.target.value;
    setFormDataMessage({
        ...formDataMessage,
        [event.target.name]: value,
    });
    };

        return <div className='container_editMessage'>
        <Menu />
        <form onSubmit={handleFormSubmitEditMessage}>
        <div className="mb-3 mt-3">
        <label htmlFor="message" className="form-label">
            Mensagem
        </label>
        <input type="text" className="form-control" id="message" name="message"
        onChange={handleInputChangeMessage} value={formDataMessage.message}></input>
        </div>
        <button type="submit" className="btn btn-primary">Atualizar mensagem</button>

        </form>
        </div>;
}

