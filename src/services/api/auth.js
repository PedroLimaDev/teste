import jwt from "jwt-decode"
import axiosApi from './api'

export const TOKEN_KEY = "TokenUsuarioLogado"
export const NOME = "NomeUsuarioLogado"
export const EMAIL = "EmailUsuarioLogado"

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = token => localStorage.setItem(TOKEN_KEY, token)

export const getNome = () => localStorage.getItem(NOME)
export const setNome = nome => localStorage.setItem(NOME, nome)

export const getEmail = () => localStorage.getItem(EMAIL)
export const setEmail = email => localStorage.setItem(EMAIL, email)

export const logout = () => {
	localStorage.removeItem(TOKEN_KEY)
	localStorage.removeItem(NOME)
	localStorage.removeItem(EMAIL)
}

export const isAuthenticated = () => {
	if (getToken()) {
		console.log("AQUI")
		const { exp } = jwt(getToken())
		if (exp) {
			if (Date.now() >= exp * 1000) {
				logout()
				return false
			}
			else
				return true
		} else {
			return true
		}
	}
}

export const refreshToken = () => {
	const user = jwt(getToken())

	axiosApi.post("/usuario/refreshToken", user)
		.then((res) => {
			const { token } = res.data
			setToken(token)
		}).catch((err) => {
			console.log(err)
		})
}