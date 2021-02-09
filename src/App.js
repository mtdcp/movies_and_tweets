import Movies from "./components/Movies";
import Tweets from "./components/Tweets";
import InitialPage from "./components/InitialPage";
import './App.css';
import React from 'react';
import { Switch, Route, BrowserRouter} from 'react-router-dom';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path={'/'} exact component={InitialPage} />
          <Route path={'/movies'} exact component={Movies} /> 
          <Route path={'/tweets'} exact component={Tweets} /> 
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
