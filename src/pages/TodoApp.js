import React from "react";
import { Redirect, Link } from "react-router-dom"
import { Button, FormControlLabel, Checkbox, Grid, Box, Container, Typography, InputAdornment, IconButton, TextField } from '@material-ui/core'
import AddTask from "../components/AddTask";
import TaskList from "../components/TaskList";
import "../styles.css";

import axiosApi from '../services/api/api'

import { logout, isAuthenticated, getToken, getNome, getEmail } from "../services/api/auth"

export default function TodoApp() {

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
    <div className="todo-app">
      <Typography variant="h5" align="center">{nome}</Typography>
      
      <Typography variant="h5" align="center">Lista de Tasks</Typography>
      
      <AddTask tasks={tasks} setTasks={setTasks} addOrEdit={addOrEdit} />
      <TaskList tasks={tasks} setTasks={setTasks} />


      <Button onClick={() => sair()} style={{marginTop:'10px'}} type="submit" variant="contained" color="primary">
        Sair
      </Button>
    </div>
  );
}
