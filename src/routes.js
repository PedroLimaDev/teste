import React from "react"
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom"

import Login from "./pages/Login"
import Cadastro from "./pages/Cadastro"
import TodoApp from "./pages/TodoApp"
import Alterar from "./pages/Alterar"

import { isAuthenticated } from "./services/api/auth"


const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route {...rest}
		render={props =>
			isAuthenticated() ? (
				<Component {...props} />
			) : (
					<Redirect to={{ pathname: "/", state: { from: props.location } }} />
				)} />
)

export default function Routes() {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/" component={Login} />
				<Route exact path="/cadastro" component={Cadastro} />
				<PrivateRoute path="/todo" component={TodoApp} />
				<PrivateRoute path="/alterar/:id" component={Alterar} />
				<Route path="*" component={() => <h1>Page not found</h1>} />
			</Switch>
		</BrowserRouter>
	)
}