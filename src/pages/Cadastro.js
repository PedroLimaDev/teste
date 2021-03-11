import React from 'react'
import { Redirect, Link } from "react-router-dom"
import { Button, FormControlLabel, Checkbox, Grid, Box, Container, Typography, InputAdornment, IconButton, TextField } from '@material-ui/core'
import { Formik, useFormik } from 'formik'
import { Visibility, VisibilityOff } from '@material-ui/icons'


import axiosApi from '../services/api/api'
import { isAuthenticated, setToken, setTipoUsuario, getTipoUsuario } from "../services/api/auth"
import md5 from 'md5'

export default function Cadastro() {
	const formik = useFormik({
		initialValues: { nome: '', email:'', senha: ''}
	})

	const [exibirSenha, setExibirSenha] = React.useState(false)

	const handleClickExibirSenha = () => {
		setExibirSenha(!exibirSenha)
	}

	const handleOnMouseDownPassword = event => {
		event.preventDefault()
	}

	const cadastro = filtro => {
		if(!filtro.nome){		
			return
		}

		if(!filtro.senha){
			return
		} 
		
		else {
			filtro.senha = md5(filtro.senha)
		}
 		
		axiosApi.post('/usuario/cadastro', filtro)
			.then((res) => {
				console.log('Usuário Criado')
			}).catch((err) => {
				console.log(err)
			})
		
	}

	return (
		<React.Fragment>
			<Container component="section" maxWidth="xs">
				<Typography variant="h5" align="center">Cadastro</Typography>
				<Formik initialValues={formik.initialValues}
					onSubmit={(filtro, { setSubmitting, resetForm }) => {
						setSubmitting(true)
						
						cadastro(filtro)
						resetForm()
						setSubmitting(false)
					}}>
					{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => {
						return (
							<form noValidate onSubmit={handleSubmit}>

								<TextField fullWidth required autoFocus margin="normal" id="nome"
									label="Usuário" name="nome" value={values.nome}
									onChange={handleChange} onBlur={handleBlur}
									error={touched.nome && errors.nome}/>

								<TextField fullWidth required autoFocus margin="normal" id="email"
									label="E-mail" name="email" value={values.email}
									onChange={handleChange} onBlur={handleBlur}
									error={touched.email && errors.email}/>

								<TextField fullWidth required id="senha"
									label="Senha" name="senha" 
									value={values.senha} type={exibirSenha ? "text" : "password"}
									onChange={handleChange} onBlur={handleBlur} InputProps={{
										endAdornment: 
										<InputAdornment position="end">
											<IconButton onClick={handleClickExibirSenha}
												onMouseDown={handleOnMouseDownPassword}
												aria-label="Alternar visibilidade da senha">
													{ exibirSenha ? <Visibility/> : <VisibilityOff/> }
											</IconButton>
										</InputAdornment>
									}}/>

								<Button fullWidth disabled={isSubmitting} style={{marginTop:'10px'}} type="submit" variant="contained" color="primary">
									Entrar
								</Button>
								<Grid container spacing={2}>

									<Grid item xs={12} sm={7}>
										<Link to= "/" href="#" variant="body2">{"Voltar"}</Link>
									</Grid>
								</Grid>
							</form>
						)
					}}

				</Formik>
			</Container>
		</React.Fragment>
	)
}