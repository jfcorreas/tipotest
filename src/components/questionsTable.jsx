
import React, { Component } from 'react';
import QuestionForm from './questionForm';

class QuestionsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiUrl: props.apiUrl,
            questions: [],
            questionSelected: null,
            errorMessage: null,
            componentBusy: null,
            moreInfoBusy: null,
            open: false,
            formOpen: false
        };

        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleDetailsClick = this.handleDetailsClick.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleNewButton = this.handleNewButton.bind(this);
        this.handleEditButton = this.handleEditButton.bind(this);
        this.toggleComponentBusy = this.toggleComponentBusy.bind(this);
        this.toggleMoreInfoBusy = this.toggleMoreInfoBusy.bind(this);
    }

    async fetchAPI(path, subpath, objectId, filterParams, options) {
        let requestUrl = `${this.state.apiUrl}/${path}`;
        if (subpath) requestUrl = requestUrl + '/' + subpath;
        if (objectId) requestUrl = requestUrl + '/' + objectId;
        if (filterParams) requestUrl = requestUrl + '?' + filterParams;

        return fetch(requestUrl, options)
            .then(res => res.json())
            .catch(err => this.setErrorMessage(err.message));
    }

    async handleRefresh() {
        this.setErrorMessage(null);
        this.toggleComponentBusy();

        const fetchResult = await this.fetchAPI('questions');

        const questions = fetchResult && fetchResult.data ? fetchResult.data : [];
        this.setState({
            questions: questions,
            questionSelected: null
        });
        this.toggleComponentBusy();
    }

    async handleDetailsClick(event) {
        event.preventDefault();
        if (this.state.open) {
            this.setState(() => ({ open: false }));
            return;
        }
        await this.handleRefresh();
        this.setState({ open: true });
    }

    async handleRowClick(event) {
        this.setErrorMessage(null);
        this.toggleMoreInfoBusy();
        this.setState({ moreInfoBusy: true });

        const fetchResult = await this.fetchAPI('questions', null, event.currentTarget.id);
        const question = fetchResult && fetchResult.data ? fetchResult.data : null;
        this.setState({
            questionSelected: question,
            moreInfoBusy: false
        });
        this.toggleMoreInfoBusy();
    }

    handleNewButton(event) {
        this.setState({
            formOpen: true,
            questionSelected: null
        });
        setTimeout(() => { this.setState({ formOpen: false }) }, 100);
    }

    handleEditButton(event) {
        this.setState({ formOpen: true });
        setTimeout(() => { this.setState({ formOpen: false }) }, 100);
    }

    toggleComponentBusy() {
        this.setState({ componentBusy: this.state.componentBusy ? null : 'componentBusy' });
    }

    toggleMoreInfoBusy() {
        this.setState({ moreInfoBusy: !this.state.moreInfoBusy });
    }

    setErrorMessage(msg) {
        this.setState({ errorMessage: msg });
    }

    render() {
        return (
            <section>
                <details open={this.state.open} className={this.state.componentBusy}>
                    <summary role='button' className='primary outline'
                        onClick={this.handleDetailsClick}
                        aria-busy={this.state.componentBusy ? true : false}>
                        Preguntas
                    </summary>
                    <span className='warning'>{this.state.errorMessage}</span>
                    <a href="#" onClick={this.handleRefresh}>🔁 Actualizar</a>
                    <table role="grid">
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">Texto</th>
                                <th scope="col">#Respuestas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.questions.map((question) => {
                                return (
                                    <tr key={question._id}
                                        id={question._id}
                                        title="Haga click para seleccionar"
                                        className={this.state.questionSelected &&
                                            this.state.questionSelected._id === question._id ?
                                            "selected" : null}
                                        onClick={this.handleRowClick}>
                                        <th scope="row">
                                            <input type="checkbox"
                                                readOnly
                                                checked={this.state.questionSelected &&
                                                    this.state.questionSelected._id === question._id ?
                                                    true : false}
                                            />
                                        </th>
                                        <td>{question.text}</td>
                                        <td>{question.answers.length}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <a href="#"
                        role="button"
                        className="primary"
                        onClick={this.handleNewButton}>
                        Nueva Pregunta
                    </a>
                    <a href="#"
                        role="button"
                        className="primary outline"
                        disabled={this.state.questionSelected ? false : true}
                        onClick={this.handleEditButton}>
                        Editar Pregunta
                    </a>
                    <h5 aria-busy={this.state.moreInfoBusy}>
                        Tema
                    </h5>
                    {this.state.questionSelected ?
                        <p>{this.state.questionSelected.topic.title}</p> :
                        "Seleccione una Pregunta ⬆️"}
                    <ul>
                    {this.state.questionSelected ?
                        this.state.questionSelected.answers.map((answer) => {
                            return (
                                <li id={answer._id}
                                    key={answer._id}
                                    className={answer.isCorrect? 'trueQuestion' : null}>
                                    {answer.text}
                                </li>
                            )
                        }) : null}
                    </ul>
                </details>
                <QuestionForm apiUrl={this.state.apiUrl}
                    open={this.state.formOpen}
                    question={this.state.questionSelected}
                    refreshParent={this.handleRefresh}>
                </QuestionForm>
            </section>
        )
    }
}

export default QuestionsTable;