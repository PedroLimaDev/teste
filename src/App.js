import React from 'react'
import Routes from "./routes"

import { Provider } from "react-redux";
import store from "./redux/store";


export default function App(){
  return (
    <React.Fragment>
      <Provider store={store}>
        <Routes />
      </Provider>
    </React.Fragment>
  )
}