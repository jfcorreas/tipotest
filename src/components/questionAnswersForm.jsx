import React, { Component } from 'react';

const headersList = {
    "Accept": "*/*",
    "Content-Type": "application/json"
}

class QuestionAnswersForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiUrl: props.apiUrl,
            question: props.question,
            selectedAnswer: null,
            answerToAdd: null,
            errorMessage: null,
            open: false,
            busyDelete: false
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleDeleteAnswer = this.handleDeleteAnswer.bind(this);
        this.handleNewAnswerChange = this.handleNewAnswerChange.bind(this);
        this.handleNewAnswerSubmit = this.handleNewAnswerSubmit.bind(this);
    }

    async fetchAPI(path, subpath, objectId, subObjectId, filterParams, options) {
        let requestUrl = `${this.state.apiUrl}/${path}`;
        if (objectId) requestUrl = requestUrl + '/' + objectId;
        if (subpath) requestUrl = requestUrl + '/' + subpath;
        if (subObjectId) requestUrl = requestUrl + '/' + subObjectId;
        if (filterParams) requestUrl = requestUrl + '?' + filterParams;

        return fetch(requestUrl, options)
            .then(res => res.json())
            .catch(err => this.setState({ errorMessage: err.message }))
    }

    componentDidUpdate(prevProps) {
        if (this.props.open !== prevProps.open &&
            this.props.open === true &&
            this.props.question) {

            this.setState({
                question: structuredClone(this.props.question),
                open: true,
                errorMessage: false
            });
        }
    }

    handleClose(event) {
        this.setState({
            question: null,
            selectedAnswer: null,
            answerToAdd: null,
            errorMessage: null,
            open: false,
            busyDelete: false
        });
        this.props.refreshParent();
    }

    handleRowClick(event) {
        const target = event.currentTarget;
        const answerId = target.id;

        const selectedAnswer = this.state.question.answers.filter(answer => answer._id === answerId)[0];

        this.setState({
            selectedAnswer: selectedAnswer
        });
    }

    async handleDeleteAnswer(event) {
        let options = {
            method: 'DELETE',
            headers: headersList,
            body: JSON.stringify(this.state.question)
        };

        let result;
        this.setState({ busyDelete: true });
        result = await this.fetchAPI('questions', 'answers', this.state.question._id, this.state.selectedAnswer._id, null, options);
        this.setState({ busyDelete: false });

        if (result && result.status === "FAILED") {
            this.setState({ errorMessage: result.data.error })
            return;
        }

        const questionModified = result.data;

        this.setState({
            question: questionModified,
            selectedAnswer: null
        });
    }

    handleNewAnswerChange(event) {
        const target = event.target;
        const newAnswerId = target.value;

        this.setState({
            answerToAdd: newTopicId
        });
    }

    handleNewAnswerSubmit(event) {
        this.state.question.answers.push(answerToAdd);
        this.setState({
            answerToAdd: null,
            invalidForm: false
        });
    }

    render() {
        return (
            <div>
                <dialog open={this.state.open}>

                    <article>
                        <a href="#close"
                            aria-label="Close"
                            className="close"
                            onClick={this.handleClose}>
                        </a>
                        <h3>Respuestas de la pregunta:</h3>
                        <p>{this.state.question ? this.state.question.text : ""}</p>
                        <span className='warning'>{this.state.errorMessage}</span>
                        <div className='grid'>
                            <table>
                                <tbody>
                                    {this.state.question &&
                                        this.state.question.answers.map((answer) => {
                                            return (
                                                <tr key={answer._id}
                                                    id={answer._id}
                                                    title="Haga click para seleccionar"
                                                    className={this.state.selectedAnswer &&
                                                        this.state.selectedAnswer._id === answer._id ?
                                                        "selected" : null}
                                                    onClick={this.handleRowClick}>
                                                    <td scope="row">
                                                        <input type="checkbox"
                                                            readOnly
                                                            checked={this.state.selectedAnswer &&
                                                                this.state.selectedAnswer._id === answer._id ?
                                                                true : false}
                                                        />
                                                    </td>
                                                    <td>{answer.text}</td>
                                                    <td>{answer.isCorrect ? "✅" : ""}</td>
                                                </tr>
                                            )
                                        })}
                                </tbody>
                            </table>
                            <button
                                className="contrast"
                                disabled={!this.state.selectedAnswer}
                                aria-busy={this.state.busyDelete}
                                onClick={this.handleDeleteAnswer}>
                                Eliminar Respuesta
                            </button>
                        </div>
                        <footer>
                            <section className='grid'>
                                <label htmlFor="availableTopics">
                                    Introducir nueva respuesta

                                    <button
                                        className="contrast outline"
                                        disabled={!this.state.answerToAdd}
                                        onClick={this.handleNewAnswerSubmit}>
                                        Añadir Respuesta
                                    </button>
                                </label>
                            </section>
                            <section>
                                <a href="#end"
                                    role="button"
                                    className="secondary"
                                    onClick={this.handleClose}>
                                    Terminar
                                </a>
                            </section>

                        </footer>
                    </article>

                </dialog>
            </div>
        )
    }
}

export default QuestionAnswersForm;
