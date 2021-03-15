import React from "react";
import { Redirect, Link } from "react-router-dom"
import { Button, FormControlLabel, Checkbox, Grid, Box, Container, Typography, InputAdornment, IconButton, TextField } from '@material-ui/core'
import AddTask from "../components/AddTask";
import TaskList from "../components/TaskList";
import "../styles.css";

import axiosApi from '../services/api/api'

import { logout, isAuthenticated, getToken, getNome, getEmail } from "../services/api/auth"

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexFlow: 'row wrap',
		alignItems: 'center',
		justifyContent: 'center',
		// paddingTop: theme.spacing(6),
	},
	btnSubmit: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
	},
	buttonsGrid: {
    display:'flex',
    justifyContent:'center',
		alignSelf:'center',
    margin: '10px'
	},
  title: {
    width:'100%',
    justifyContent: 'space-between'
  }
}))

export default function TodoApp() {
	const classes = useStyles()

  const [tasks, setTasks] = React.useState([])
  const [nome, setNome] = React.useState(getNome())
  const [addOrEdit, setAddOrEdit] = React.useState(true)

  React.useEffect(()=>{
    axiosApi.post('/task/all', { owner: nome })
			.then((res) => {
        console.log(res.data)
				setTasks(res.data)
			})
      .catch((err) => {
				console.log(err)
			})
  },[])


  if(!isAuthenticated()){
    return <Redirect to='/login' />
  }

  function sair() {
    logout()
    window.location.reload()
  }

  

  return (
    <div>
      <Button onClick={() => sair()} className={classes.buttonsGrid} type="submit" variant="contained" color="primary">
            Sair
      </Button>
    
    <Container component="section" maxWidth="sm" className={classes.root} >
      <div className={classes.title}>
        <Typography variant="h5" align="center">{nome}</Typography>
        
        <Typography variant="h5" align="center">Lista de Tasks</Typography>
      </div>

      <AddTask tasks={tasks} setTasks={setTasks} addOrEdit={addOrEdit} />
      <TaskList tasks={tasks} setTasks={setTasks} />

    
    </Container>


     
    </div>
  );
}
