import React from 'react'
import { TextField, Button, Container, Typography, MenuList, MenuItem } from '@material-ui/core'
import axiosApi from '../services/api/api'
import { Link, Redirect } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
	root: {
		backgroundColor: theme.palette.background.paper,
		display: 'flex',
		flexFlow: 'row wrap',
		alignItems: 'center',
		justifyContent: 'center',
	},
}))

export default function TaskList(props) {
    const classes = useStyles()

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
        <Container component="section" maxWidth="xl" className={classes.root} >
            {props.tasks.length > 0 ? 
                <MenuList id="menu-list-grow">
                    {props.tasks.map((e) => 
                        <MenuItem {...e} key={`${e.nome}_${Math.random()}`}>
                            <Container component="section" maxWidth="xs">
                                <div style={{width:'100vw'}}>
                                    <Typography variant="h7" style={{color:'#999999'}}>
                                        {e.data}
                                    </Typography>

                                    <Typography noWrap variant="h6">
                                        {e.nome}: {e.descricao}
                                      </Typography>
                                </div>
                            
                                <Link to={{
                                    pathname:alterar(e.id),
                                    id:e.id,
                                    nome:e.nome,
                                    descricao:e.descricao
                                }} 
                                style={{marginLeft:'10px', textDecoration:'none'}}>
                                    <Button variant="contained" color="primary">
                                        Alterar
                                    </Button>
                                </Link>
                                <Button  onClick={() => apagar(e.id)} style={{marginLeft:'10px'}} type="submit" variant="contained" color="secondary">
                                    Apagar
                                </Button>
                            </Container>

   
                        </MenuItem>
                    )}
                </MenuList>
                :
                <Typography variant="h5" align="center">Sem Tasks</Typography> 
            }
           
        </Container>
    )
}