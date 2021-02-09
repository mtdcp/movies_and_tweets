import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

export default class InitialPage extends Component {
    render() {
          return (
              <div id="div1">
                  <div id="buttons">
                  <Button id="moviesButton" component={Link} to="/movies">
                      Filmes
                  </Button> 
                  <Button id="tweetsButton" component={Link} to="/tweets">
                      Tweets
                  </Button>
                  </div>
              </div>
          );
      }
}