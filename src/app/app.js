import React, {useState} from "react"
import { Exercise1 } from "../exercises/exercise1"
import { Exercise2 } from "../exercises/exercise2"
import {Home} from  "./home"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";


export const App = () => {
    const [ejercicio, setEjercicio] = useState("")

    const goTo = (url) => {
        setEjercicio(url)
    }

    return <div className="mango">
        <h1>Mango</h1>
        <Router>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/exercise1" component={Exercise1} />
                <Route path="/exercise2" component={Exercise2} />
                <Redirect to="/" />
            </Switch>
        </Router>
        {/* {
            ejercicio === "exercise1" ? <Exercise1  onChange={goTo} /> : 
            ejercicio === "exercise2" ? <Exercise2  onChange={goTo} /> : 
             <Home  onChange={goTo} />
           
        } */}
        
    
    </div>
}