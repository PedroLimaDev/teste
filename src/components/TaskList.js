import React from 'react'
import { TextField, Button, Typography, MenuList, MenuItem } from '@material-ui/core'
import axiosApi from '../services/api/api'
import { Link, Redirect } from 'react-router-dom'


export default function TaskList(props) {

    function alterar(id) {
        var url = `/alterar/${id}`

        return url
    }

    function apagar(id) {
        axiosApi.delete(`/task/apagar/${id}`)
			.then((res) => {
                var filtered = props.tasks.filter(function(el) { return el.id != id; }); 
                props.setTasks(filtered)
            })
            .catch((err) => {
                console.log(err)
            })

        window.location.reload()
    }

    return (
        <div>
            {props.tasks.length > 0 ? 
                <MenuList id="menu-list-grow">
                    {props.tasks.map((e) => 
                        <MenuItem {...e} key={`${e.nome}_${Math.random()}`}>
                            <div>
                                {e.nome} - {e.descricao} - {e.data}
                                <Link to={{
                                    pathname:alterar(e.id),
                                    id:e.id,
                                    nome:e.nome,
                                    descricao:e.descricao
                                }} 
                                style={{marginLeft:'10px'}}>
                                    Alterar
                                </Link>
                                <Button  onClick={() => apagar(e.id)} style={{marginLeft:'10px'}} type="submit" variant="contained" color="secondary">
                                    Apagar
                                </Button>
                            </div>

   
                        </MenuItem>
                    )}
                </MenuList>
                :
                <Typography variant="h5" align="center">Sem Tasks</Typography> 
            }
           
        </div>
    )
}