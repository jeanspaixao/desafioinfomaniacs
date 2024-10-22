import React from 'react';
import {Link} from 'react-router-dom'
import Menu from './Menu.tsx';

export default function NotFound(){
    return <div className='flex flex-col gap-2'>
        <Menu />
         Página não encontrada!
        <Link to="/"> Página inicial </Link>
        </div>;
}