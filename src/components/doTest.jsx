
import React, { Component } from 'react';

const headersList = {
    "Accept": "*/*",
    "Content-Type": "application/json"
}

const dateLocale = "es-ES";
const dateOptions = { timeZone: "Europe/Madrid" };

class doTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiUrl: props.apiUrl,
            convocations: [],
            convocationSelected: null,
            currentTest: null,
            correctAnswers: [],
            checkedAnswers: [],
            errorMessage: null,
            componentBusy: null
        };

        this.handleSelectConvocation = this.handleSelectConvocation.bind(this);
        this.handleStartTest = this.handleStartTest.bind(this);
        this.handleCheckAnswer = this.handleCheckAnswer.bind(this);
        this.handleSubmitTest = this.handleSubmitTest.bind(this);
        this.toggleComponentBusy = this.toggleComponentBusy.bind(this);
    }

    async fetchAPI(path, subpath, objectId, filterParams, options) {
        let requestUrl = `${this.state.apiUrl}/${path}`;
        if (objectId) requestUrl = requestUrl + '/' + objectId;
        if (subpath) requestUrl = requestUrl + '/' + subpath;
        if (filterParams) requestUrl = requestUrl + '?' + filterParams;

        return fetch(requestUrl, options)
            .then(res => res.json())
            .catch(err => this.setErrorMessage(err.message));
    }

    async componentDidMount() {
        this.setErrorMessage(null);
        this.toggleComponentBusy();

        const fetchResult = await this.fetchAPI("convocations", null, null, null, undefined);

        const convocations = fetchResult && fetchResult.data ? fetchResult.data : [];
        this.setState({
            convocations: structuredClone(convocations),
            convocationSelected: null
        });
        this.toggleComponentBusy();
    }

    handleSelectConvocation(event) {
        const target = event.target;
        const value = target.value;

        const convocationSelected = this.state.convocations.find(convocation => convocation._id === value);

        this.setState({ convocationSelected: convocationSelected });
    }

    async handleStartTest(event) {
        this.setErrorMessage(null);
        const options = {
            method: 'POST',
            headers: headersList,
            body: JSON.stringify({ convocationId: this.state.convocationSelected._id })
        };
        this.toggleComponentBusy();

        const fetchResult = await this.fetchAPI('tests', null, null, null, options);
        const newTest = fetchResult && fetchResult.data ? fetchResult.data : null;

        if (newTest) {
            const correctAnswers = newTest.questionList.map(question => {
                return question.answers.findIndex(answer => answer.isCorrect)
            });
            this.setState({ correctAnswers: correctAnswers });
        }

        this.setState({
            currentTest: newTest,
            convocationSelected: null,
            convocations: [],
            checkedAnswers: new Array(newTest.questionList.length)
        });
        this.toggleComponentBusy();
    }

    handleCheckAnswer(event) {
        const target = event.target;
        const questionId = target.name;
        const answerId = target.id;
        
        const questionIndex = 
            this.state.currentTest.questionList.findIndex(question => 
                question._id === questionId
            );

        const answerIndex = 
            this.state.currentTest.questionList[questionIndex].answers.findIndex(answer => 
                answer._id === answerId 
            );

        this.state.checkedAnswers[questionIndex] = Number(answerIndex);
    }

    async handleSubmitTest(event) {
        this.setErrorMessage(null);
        const options = {
            method: 'PATCH',
            headers: headersList,
            body: JSON.stringify({ testResponses: this.state.checkedAnswers })
        };
        this.toggleComponentBusy();

        const fetchResult = await this.fetchAPI('tests', null, this.state.currentTest._id, null, options);
        const finishedTest = fetchResult && fetchResult.data ? fetchResult.data : null;

        this.setState({
            currentTest: finishedTest
        });
        this.toggleComponentBusy();
        console.log(this.state.checkedAnswers)
        console.log(this.state.correctAnswers)
        console.log(finishedTest)
    }

    toggleComponentBusy() {
        this.setState({ componentBusy: this.state.componentBusy ? null : 'componentBusy' });
    }

    setErrorMessage(msg) {
        this.setState({ errorMessage: msg });
    }

    render() {
        return (
            <div>
                <section className={this.state.componentBusy}>
                    <select required
                        disabled={this.state.convocations.length === 0}
                        onChange={this.handleSelectConvocation}>
                        <option>Seleccione una convocatoria...</option>
                        {this.state.convocations.map((convocation) => {
                            return (
                                <option key={convocation._id}
                                    value={convocation._id}>
                                    {convocation.fullName}
                                </option>
                            )
                        })}
                    </select>
                    <div className='warning'>{this.state.errorMessage}</div>
                    <button
                        className="primary"
                        disabled={!this.state.convocationSelected}
                        aria-disabled={!this.state.convocationSelected}
                        onClick={this.handleStartTest}>
                        Comenzar Test
                    </button>
                </section>
                <section hidden={!this.state.currentTest}>
                    <hgroup>
                        <h2 aria-busy={this.state.componentBusy ? true : false}>Test</h2>
                        <h4>
                            {this.state.currentTest ?
                                <p>{new Date(this.state.currentTest.createdAt).toLocaleString(dateLocale, dateOptions)} -
                                   - {this.state.currentTest.questionList.length} preguntas</p>
                                : null
                            }
                        </h4>
                    </hgroup>
                    <form>
                        {this.state.currentTest ?
                            this.state.currentTest.questionList.map((question, questionIndex) => {
                                return (
                                    <article key={question._id} id={question._id}>
                                        <fieldset>
                                            <legend><strong>{questionIndex + 1}. {question.text}:</strong></legend><br></br>
                                            {question.answers.map((answer) => {
                                                return (
                                                    <label htmlFor={answer._id} key={answer._id}>
                                                        <input type="radio"
                                                            id={answer._id}
                                                            name={question._id}
                                                            value={answer.text}
                                                            onClick={this.handleCheckAnswer} />
                                                        {answer.text}
                                                    </label>
                                                )
                                            })}

                                        </fieldset>
                                    </article>
                                )
                            }) : null}
                    </form>
                </section>
                <button
                    className="contrast"
                    disabled={!this.state.currentTest}
                    aria-disabled={!this.state.currentTest}
                    hidden={!this.state.currentTest}
                    onClick={this.handleSubmitTest}>
                    {this.state.currentTest && this.state.currentTest.score < 0 ?
                        "Terminar Test" : "Repetir Test"}
                </button>
                <article hidden={!this.state.currentTest || this.state.currentTest.score === -1}>
                    Puntuación Obtenida: {this.state.currentTest ? this.state.currentTest.score : ''} sobre {this.state.currentTest ? this.state.currentTest.questionList.length : ''}

                </article>
            </div>
        )
    }
}

export default doTest;