import React from 'react'
import { Button, FormControlLabel, Checkbox, Grid, Box, Container, Typography, InputAdornment, IconButton, TextField } from '@material-ui/core'
import { Formik, useFormik } from 'formik'
import axiosApi from '../services/api/api'
import { getNome } from '../services/api/auth'

export default function AddTask(props) {
    const formik = useFormik({
		initialValues: { nome:'', descricao: ''}
	})

    const addtask = filtro => {
		if(!filtro.nome){
			return
		}

		if(!filtro.descricao){
			return
		}

		axiosApi.post('/task/criar', filtro)
			.then((res) => {
                console.log(res)
                props.tasks.push()

				window.location.reload()
			}).catch((err) => {
				console.log(err)
			})
		
		
	}

    return (
		<Container component="section" maxWidth="xl">
            <Formik initialValues={formik.initialValues}
					onSubmit={(filtro, { setSubmitting, resetForm }) => {
						setSubmitting(true)
						
						let auxFiltro = {...filtro, owner:getNome()}
						addtask(auxFiltro)
						resetForm()
						setSubmitting(false)
					}}>
					{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => {
						return (
							<Container>
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

									<Button fullWidth disabled={isSubmitting} style={{marginTop:'20px', marginBottom:'20px'}} type="submit" variant="contained" color="primary">
										+
									</Button>
								</form>
							</Container>
						)
					}}
				</Formik>
       	</Container>
    )
}