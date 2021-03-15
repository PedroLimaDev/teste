import React from 'react'
import { Button, FormControlLabel, Checkbox, Grid, Box, Container, Typography, InputAdornment, IconButton, TextField } from '@material-ui/core'
import { Formik, useFormik } from 'formik'
import axiosApi from '../services/api/api'
import { getNome } from '../services/api/auth'
import { Link } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
	root: {
		backgroundColor: theme.palette.background.paper,
		display: 'flex',
		flexFlow:'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	link: {
		display:'flex',
		alignSelf:'center',
		width:'100%'
	}
}))

export default function Alterar(props) {
	const classes = useStyles()

    const formik = useFormik({
		initialValues: { nome:props.location.nome, descricao: props.location.descricao}
	})

    const editTask = filtro => {
        console.log(filtro)
		if(!filtro.nome){
			return
		}

		if(!filtro.descricao){
			return
		}

		axiosApi.put(`/task/alterar/${props.location.id}`, filtro)
			.then((res) => {
                console.log(res)
			}).catch((err) => {
				console.log(err)
			})
	}

    return (
		<Container component="section" maxWidth="xl" className={classes.root} >
            <Formik initialValues={formik.initialValues}
					onSubmit={(filtro, { setSubmitting, resetForm }) => {
						setSubmitting(true)
						
						let auxFiltro = {...filtro, owner:getNome()}
						editTask(auxFiltro)
						resetForm()
						setSubmitting(false)
					}}>
					{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => {
						return (
							<form noValidate onSubmit={handleSubmit}>
								<TextField fullWidth required autoFocus margin="normal" id="nome"
									label="Nome" name="nome" value={values.nome}
									onChange={handleChange} onBlur={handleBlur}
									error={touched.nome && errors.nome} />

								<TextField fullWidth required id="descricao" margin="normal"
									label="Descricao" name="descricao" 
									value={values.descricao}
									onChange={handleChange} onBlur={handleBlur} 
                                    error={touched.descricao && errors.descricao}/>


								<Button fullWidth disabled={isSubmitting} style={{marginTop:'30px'}} type="submit" variant="contained" color="primary">
									Alterar
								</Button>
							</form>
						)
					}}

				</Formik>
				
				<div className={classes.link}>
                	<Link to= "/todo" href="#" variant="body2" style={{textDecoration:'none'}}>
						<Button variant="contained" color="primary">
							Voltar
						</Button>
					</Link>
				</div>
        </Container>
    )
}