import React, { Component } from 'react';
import axios from 'axios';
import pptxgen from "pptxgenjs";
import Button from '@material-ui/core/Button';

export default class Movies extends Component {

    constructor(props) {
        super(props);
        this.state = {
            movies: [],
            moviesArr: [],
            moviesAux: []
        };
        this.getMovies = this.getMovies.bind(this);
        this.exportToPPT = this.exportToPPT.bind(this); 
        this.goBack = this.goBack.bind(this);
    }

    //1- if 'moviesArr' has data, clean the array - to garantee that the table that shows the data is cleaner and user-friendly
    //2- get movie name from 'themoviedb' API based on the search box input text (actor or director name)
    //3- get the rest of the data from 'omdbapi' API, given the movie name
    //4- save movie data in moviesAux array
    getMovies() {
        while (this.state.moviesArr.length) {
            this.state.moviesArr.pop();
        }

        axios.get('https://api.themoviedb.org/3/search/person?api_key=<your_apiKey>&query=' + document.getElementById("txtbusca").value).then(data => {   
            this.setState({ movies: data.data.results })

            this.state.movies.forEach(movie => {
                movie.known_for.forEach(subMovie => {
                    axios.get('http://www.omdbapi.com/?t=' + subMovie.title + '&apikey=<your_apiKey>').then(data => {   
                        if(!this.state.moviesArr.includes(data.data)) {
                            this.state.moviesAux.push(data.data);
                        }
                        this.setState({ moviesArr: this.state.moviesAux })
                        
                    }).catch(erro=> {
                        console.log('Erro ao obter os filmes: ' + erro);
                    });
                });
            });
        }).catch(erro=> {
            console.log('Erro ao obter os filmes: ' + erro);
        });
    }

    //if exists movies data in session storage, it will get that data and fill the 'movies' array
    componentWillMount() {
        let moviesStorage = JSON.parse(sessionStorage.getItem('movies'));
        let movies = this.state.moviesArr;

        if(moviesStorage) {
            moviesStorage.forEach(mov => {
                movies.push(mov);
            });  
        }
    }

    //1- create an instance of pptxgen
    //2- for each movie in 'moviesArr', it will add a slide to the powerpoint, create a row with the movie data and add the row to the slide
    //3- it will return the powerPoint file
    exportToPPT() {
        const pptx = new pptxgen();
        let rows = [];

        this.state.moviesArr.forEach(movie => {
                const slide = pptx.addSlide();
                rows = [["Nome do filme: " + JSON.stringify(movie.Title)], ["Ano de lançamento " + JSON.stringify(movie.Year)], ["Realizador: " + JSON.stringify(movie.Director)]];
                slide.addTable(rows, { w: 9, rowH: 1, align: "center", fontFace: "Arial" });
        });
        return pptx.writeFile("movies_info.pptx");
    }

    //return to the initial page
    goBack() {
       return window.location.replace("/");
    }

    //will render all the data inside return statement and show it in the page
    render() {
        let movies = this.state.moviesArr;

        return (
            <div>   
                <h1 className="title">Filmes</h1>
                <Button id="back" title="Voltar à página inicial" onClick={this.goBack}>
                      Back
                </Button> 
                <Button id="export" title="Exportar a tabela abaixo para PowerPoint" onClick={this.exportToPPT}>
                      Exportar para PowerPoint
                </Button> 
                <div id="busca">
                    <input id="txtbusca" name="q" type="text" defaultValue="" placeholder="Insere o nome de um ator ou realizador" />
                    <button id="btnBusca" type="submit"  onClick={this.getMovies}>Pesquisar</button>
                </div><br></br><br></br><br></br>
                <div >
                    <table className="tableLayout" id="tableId">
                        <thead className="cell">
                            <tr>
                                <th>Nome do filme</th>
                                <th>Ano de lançamento</th>
                                <th>Realizador</th>
                                <th>Protagonistas</th>
                            </tr>
                                {movies.map((movie, index) => {
                                    sessionStorage.setItem('movies', JSON.stringify(movies));
                                    return(
                                        <tr key={index}>
                                            <td> {movie.Title} </td>
                                            <td> {movie.Year} </td>
                                            <td> {movie.Director} </td>            
                                            <td> {movie.Actors} </td>              
                                        </tr>
                                ) }) }
                        </thead>
                    </table><br></br>    
                </div>
            </div>
        );
    }
}