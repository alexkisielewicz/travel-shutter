import styles from './App.module.css';
import NavBar from "./components/NavBar";
import { Route, Switch } from "react-router-dom";
// import SignUpForm from "./pages/auth/SignUpForm";
// import SignInForm from "./pages/auth/SignInForm";

function App() {
  return (
    <div className={styles.App}>
      <Switch>
        <Route exact path="/" render={() => <h1>Home</h1>} />
        <Route exact path="/signin" render={() => <h1>Sign Up</h1>} />
        <Route exact path="/signup" render={() => <h1>Sign Up</h1>} />
        <Route render={() => <h1>Page not found!</h1>}/>
      </Switch>
      <NavBar />
    </div>
  );
}

export default App;