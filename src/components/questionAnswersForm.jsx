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
            busyDelete: false,
            busyNew: false,
            busyEdit: false,
            invalidNew: true,
            invalidEdit: true
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleRowDoubleClick = this.handleRowDoubleClick.bind(this);
        this.handleDeleteAnswer = this.handleDeleteAnswer.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleNewAnswer = this.handleNewAnswer.bind(this);
        this.handleEditAnswer = this.handleEditAnswer.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
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
            busyDelete: false,
            busyNew: false,
            busyEdit: false,
            invalidNew: true,
            invalidEdit: true
        });
        this.props.refreshParent();
        this.props.toggleModalOpen();
    }

    handleRowClick(event) {
        const target = event.currentTarget;
        const answerId = target.id;

        const selectedAnswer = this.state.question.answers.filter(answer => answer._id === answerId)[0];

        this.setState({
            selectedAnswer: selectedAnswer,
            answerToAdd: structuredClone(selectedAnswer),
            invalidEdit: true,
            invalidNew: true,
            errorMessage: null
        });
    }

    handleRowDoubleClick(event) {
        const target = event.currentTarget;
        const answerId = target.id;

        const selectedAnswer = this.state.question.answers.find(answer => answer._id === answerId);
        selectedAnswer.isCorrect = !selectedAnswer.isCorrect;

        this.setState({
            selectedAnswer: selectedAnswer,
            answerToAdd: structuredClone(selectedAnswer),
            errorMessage: null
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
            selectedAnswer: null,
            answerToAdd: null,
            errorMessage: null,
            invalidNew: true,
            invalidEdit: true
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const inputName = target.name;

        let updatedAnswer = this.state.answerToAdd;
        if (!updatedAnswer) {
            updatedAnswer = {
                text: '',
                isCorrect: false
            }
        }
        updatedAnswer[inputName] = value;
        this.setState({
            answerToAdd: updatedAnswer
        });

        const validEdit = this.state.selectedAnswer && 
            (this.state.selectedAnswer.text !== updatedAnswer.text ||
                this.state.selectedAnswer.isCorrect !== updatedAnswer.isCorrect);

        setTimeout(() => {
            const invalidForm = (
                !this.state.answerToAdd.text
            );
            this.setState((prevState) => 
                ({
                invalidNew: invalidForm,
                invalidEdit: !validEdit || invalidForm
             }));
        }, 100);
    }

    async handleNewAnswer(event) {
        let options = {
            method: 'POST',
            headers: headersList,
            body: JSON.stringify(this.state.answerToAdd)
        };

        let result;
        this.setState({ busyNew: true });
        result = await this.fetchAPI('questions', 'answers', this.state.question._id, null, null, options);
        this.setState({ busyNew: false });

        if (result && result.status === "FAILED") {
            this.setState({ errorMessage: result.data.error })
            return;
        }

        const answerAdded = result.data;
        
        this.state.question.answers.push(answerAdded);
        
        this.setState({
            selectedAnswer: null,
            answerToAdd: null,
            errorMessage: null,
            invalidNew: true,
            invalidEdit: true
        });
    }

    async handleEditAnswer(event) {
        let options = {
            method: 'PATCH',
            headers: headersList,
            body: JSON.stringify(this.state.answerToAdd)
        };

        let result;
        this.setState({ busyEdit: true });
        result = await this.fetchAPI('questions', 'answers', this.state.question._id, this.state.selectedAnswer._id, null, options);
        this.setState({ busyEdit: false });

        if (result && result.status === "FAILED") {
            this.setState({ errorMessage: result.data.error })
            return;
        }

        const answerEdited = result.data;

        const answerIndex = this.state.question.answers.findIndex((answer) => answer._id === answerEdited._id);
        this.state.question.answers.splice(answerIndex, 1, answerEdited);
        
        this.setState({
            selectedAnswer: null,
            answerToAdd: null,
            errorMessage: null,
            invalidNew: true,
            invalidEdit: true
        });
    }

    handleKeyDown(event) {
        const keyName = event.key;

        if (keyName === "Enter") {
            event.preventDefault();
            if (!this.state.selectedAnswer && this.state.answerToAdd && !this.state.invalidNew) this.handleNewAnswer();
            if (this.state.selectedAnswer && !this.state.invalidEdit) this.handleEditAnswer();
        } 
        if (keyName === "Escape" ) this.handleClose();

    }    

    render() {
        return (
            <div tabIndex="0"
                onKeyDown={this.state.open?  this.handleKeyDown : null}>
                <dialog open={this.state.open}>

                    <article>
                        <a href="#close"
                            aria-label="Close"
                            className="close"
                            onClick={this.handleClose}>
                        </a>
                        <h3>Respuestas de la pregunta:</h3>
                        <p>{this.state.question ? this.state.question.text : ""}:</p>
                        <div>
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
                                                    onClick={this.handleRowClick}
                                                    onDoubleClick={this.handleRowDoubleClick}>
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
                            <section>
                                <label>
                                    <h4>Gestionar la Respuesta:</h4>
                                    <form>
                                        <input name="text" type="text" required
                                            placeholder="Selecciona una Respuesta o escribe una nueva"
                                            aria-invalid={!(this.state.answerToAdd && this.state.answerToAdd.text)}
                                            onChange={this.handleInputChange}
                                            value={this.state.answerToAdd ? this.state.answerToAdd.text : ''} />
                                        <label>
                                            ¿La Respuesta es correcta?
                                            <input name="isCorrect" type="checkbox"
                                                title="¿Es una Respuesta correcta?"
                                                onChange={this.handleInputChange}
                                                checked={this.state.answerToAdd ? this.state.answerToAdd.isCorrect : false} />
                                        </label>
                                    </form>

                                    <a href="#editAnswer"
                                        role="button"
                                        className="contrast outline"
                                        disabled={this.state.invalidEdit}
                                        aria-busy={this.state.busyEdit}
                                        onClick={this.handleEditAnswer}>
                                        Modificar
                                    </a>
                                    <a href="#delAnswer"
                                        role="button"
                                        className="contrast"
                                        disabled={!this.state.selectedAnswer}
                                        aria-busy={this.state.busyDelete}
                                        onClick={this.handleDeleteAnswer}>
                                        Eliminar
                                    </a>
                                    </label>
                            </section>
                            <span className='warning'>{this.state.errorMessage}</span>
                            <button
                                className="primary outline"
                                disabled={this.state.invalidNew}
                                aria-busy={this.state.busyNew}
                                onClick={this.handleNewAnswer}>
                                Añadir Nueva
                            </button>
                        </div>
                        <footer>
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
