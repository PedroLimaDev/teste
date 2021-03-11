import React from 'react'
import { Button, FormControlLabel, Checkbox, Grid, Box, Container, Typography, InputAdornment, IconButton, TextField } from '@material-ui/core'
import { Formik, useFormik } from 'formik'
import axiosApi from '../services/api/api'
import { getNome } from '../services/api/auth'
import { Link } from 'react-router-dom'

export default function Alterar(props) {
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
        <div>
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
								<TextField required autoFocus margin="normal" id="nome"
									label="Nome" name="nome" value={values.nome}
									onChange={handleChange} onBlur={handleBlur}
									error={touched.nome && errors.nome} />

								<TextField required id="descricao" margin="normal"
									label="Descricao" name="descricao" 
									value={values.descricao}
									onChange={handleChange} onBlur={handleBlur} 
                                    error={touched.descricao && errors.descricao}/>

								<Button disabled={isSubmitting} style={{marginTop:'30px'}} type="submit" variant="contained" color="primary">
									Alterar
								</Button>
							</form>
						)
					}}

				</Formik>

                <Link to= "/todo" href="#" variant="body2">{"Voltar"}</Link>
        </div>
    )
}