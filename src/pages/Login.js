import React from 'react'
import { Redirect, Link } from "react-router-dom"
import { Button, FormControlLabel, Checkbox, Grid, Box, Container, Typography, InputAdornment, IconButton, TextField } from '@material-ui/core'
import { Formik, useFormik } from 'formik'
import { Visibility, VisibilityOff } from '@material-ui/icons'

import axiosApi from '../services/api/api'
import { isAuthenticated, setToken, setNome, setEmail } from "../services/api/auth"
import md5 from 'md5'

export default function Login() {
	const formik = useFormik({
		initialValues: { email:'', senha: ''}
	})

	const [exibirSenha, setExibirSenha] = React.useState(false)


	const handleClickExibirSenha = () => {
		setExibirSenha(!exibirSenha)
	}

	const handleOnMouseDownPassword = event => {
		event.preventDefault()
	}
 
	if(isAuthenticated()){
		return <Redirect to='/todo' />
	
	}

	const logar = filtro => {
		if(!filtro.email){
			return
		}

		if(!filtro.senha){
			return
		} else {
			filtro.senha = md5(filtro.senha)
		}

		axiosApi.post('/usuario/login', filtro)
			.then((res) => {
				const { nome, email, token } = res.data
				setNome(nome)
				setEmail(email)
				setToken(token)
				window.location.reload()
			}).catch((err) => {
				console.log(err)
			})
		
		
	}

	return (
		<React.Fragment>
			<Container component="section" maxWidth="xs">
				<Typography variant="h5" align="center">Faça login para continuar.</Typography>
				<Formik initialValues={formik.initialValues}
					onSubmit={(filtro, { setSubmitting, resetForm }) => {
						setSubmitting(true)
						
						logar(filtro)
						resetForm()
						setSubmitting(false)
					}}>
					{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => {
						return (
							<form noValidate onSubmit={handleSubmit}>
								<TextField fullWidth required autoFocus margin="normal" id="email"
									label="Email" name="email" value={values.email}
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
								<Grid  container spacing={2}>
									<Grid item>
										{ "Não tem uma conta? " }
										<Link to= "/cadastro" href="#" variant="body2">{"Cadastre-se"}</Link>
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