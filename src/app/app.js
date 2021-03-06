import { Examples, Exercise1, Exercise2 } from "../exercises"
import {Home} from  "./home"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom"

export const App = () => {
    return <div className="container">
        <div className="mango">
            <h1>Mango</h1>
            <Router>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/exercise1" component={Exercise1} />
                    <Route path="/exercise2" component={Exercise2} />
                    <Route path="/examples" component={Examples} />
                    <Redirect to="/" />
                </Switch>
            </Router>
        </div>
        <p className="poweredby">powered by <a title="Miguel Hernández Von Hartmann" href="https://hernandezmiguel.es" rel="follow" target="_blank">hernandezmiguel.es</a></p>
    </div>
}