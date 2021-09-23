import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Landing from './Components/Landing';
import Container from "react-bootstrap/Container";
import FieldContainer from './Components/Container';

function App() {
  return (
    <Router id='main-container'>
      <Container id='main-container'>
        <Route exact={true} path='/' render={() => (
          <>
            <Landing />
          </>
        )} />
        <Route exact={true} path='/container' render={() => (
          <>
            <FieldContainer />
          </>
        )} />
      </Container>
    </Router>
  );
}

export default App;
