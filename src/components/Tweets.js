import React, { Component } from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import sentiment from 'sentiment-ptbr';

export default class Tweets extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tweets: [],
            tweetsAux: [],
            tweetsArr: [],
            sentimentos: [],
            sentimentosAux: []
        };
        this.getTweets = this.getTweets.bind(this);
        this.getTweetSentiment = this.getTweetSentiment.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    //1-if exists tweets data in session storage, it will get that data and fill the 'tweetsArr' array
    //2-if exists sentimentos data in session storage, it will get that data and fill the 'sentimentosAux' array
    componentWillMount() {
        let tweetsStorage = JSON.parse(sessionStorage.getItem('tweets'));
        let sentimentosStorage = JSON.parse(sessionStorage.getItem('sentimentos'));
        let tweets = this.state.tweetsArr;
        let sentimentos = this.state.sentimentosAux;

        if(tweetsStorage) {
            tweetsStorage.forEach(tweet => {
                tweets.push(tweet);
            });  
        }
        if(sentimentosStorage) {
            sentimentosStorage.forEach(sentimento => {
                sentimentos.push(sentimento);
            });  
        }
    }

    //1- if 'tweetsArr' or 'sentimentos' has data, it cleans the array - to garantee that the table that shows the data is cleaner and user-friendly
    //2- before the twitter's API url, a new link was added - to garantee there is no CORS issues
    //3- in the request header, the authorization bearer token is send to allow access to the API
    //4- get the data from twitter's API, given the choosed theme 'Portugal'
    //5- save the data in 'tweetsArr' array
    //6- at the end of the function, call the getTweetSentiment() function to evaluate the sentiment for each tweet
    async getTweets() {
        while (this.state.tweetsArr.length) {
            this.state.tweetsArr.pop();
            this.state.sentimentos.pop();
        }
        try {
            await axios.get('https://cors-anywhere.herokuapp.com/https://api.twitter.com/2/tweets/search/recent?query=Portugal', {
                headers: {
                    'Authorization': 'Bearer <token>',
                    "Content-Type": "application/json"
                  }
            }).then(data => {   
                data.data.data.forEach(tweet => {
                    if(!this.state.tweetsAux.includes(tweet)) {
                        this.state.tweetsAux.push(tweet);
                    }
                    this.setState({ tweetsArr: this.state.tweetsAux })
                });
            }).catch(erro=> {
                console.log('Erro ao obter os tweets: ' + erro);
            });
        } catch (error) {
            console.error(error);
        }
        this.getTweetSentiment();
    }

    //1-for each movie in 'tweets' array, it will evaluate the sentiment of the tweet from -1 to 1
    //2-depending on the sentiment (<0, =0, >0), it will add a string ("Neutro", "Positivo", "Negativo") to 'sentimentos' array
    //3-it will change the value of sentimentosAux to 'sentimentos' array
    getTweetSentiment() {
        let tweets = this.state.tweetsArr;
        let sentimentos = this.state.sentimentos;
        tweets.forEach(tweet=> {
            let score = sentiment(tweet.text).comparative;
            if(score === 0) {
                sentimentos.push({text: "Neutro"});
            } else if(score < 0) {
                sentimentos.push({text: "Negativo"});
            } else if(score > 0) {
                sentimentos.push({text: "Positivo"});

            }
            this.setState({ sentimentosAux: this.state.sentimentos })
        });
    }
    
    //return to the initial page
    goBack() {
        return window.location.replace("/");
    }

     //will render all the data inside return statement and show it in the page
    render() {
        let tweets = this.state.tweetsArr;
        let sentimentos = this.state.sentimentosAux;
        return (
            <div>
                <h1 className="title_tweets">Análise de sentimento de Tweets sobre Portugal</h1>
                <Button id="backTweets" title="Voltar à página inicial" onClick={this.goBack}>
                      Back
                </Button> 
                <Button id="getTweets" title="Clica quantas vezes quiseres para obteres tweets" onClick={this.getTweets}>
                    Obter Tweets 🇵🇹
                </Button> 
                <table className="tableLayout" id="tableIdTweets">
                        <thead className="cell">
                            <tr>
                                <th>Tweet</th>
                                <th>Sentimento</th>
                            </tr>
                                {tweets.map((tweet, index) => {
                                    sessionStorage.setItem('tweets', JSON.stringify(tweets));
                                    sessionStorage.setItem('sentimentos', JSON.stringify(sentimentos));
                                    return sentimentos.map((sentimento, indice) => {
                                        if(index === indice) {
                                            return(
                                                <tr key={index}>
                                                    <td> {tweet.text} </td>  
                                                    <td> {sentimento.text} </td>  
                                                </tr>
                                        )
                                        }})     
                                }) }        
                        </thead>
                    </table>  
                <br></br><br></br>
            </div>
        )
    }
}