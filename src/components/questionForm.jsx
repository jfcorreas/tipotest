import React, { Component } from 'react';

const headersList = {
    "Accept": "*/*",
    "Content-Type": "application/json"
}

class QuestionForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiUrl: props.apiUrl,
            question: props.question,
            topics: props.topics,
            text: null,
            topic: props.topicFilter,
            selectedAnswer: null,
            errorMessage: null,
            open: false,
            openConfirm: false,
            busySubmit: false,
            busyDelete: false,
            busyTopics: false,
            editing: false,
            invalidForm: true
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleCloseConfirm = this.handleCloseConfirm.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDeletion = this.handleDeletion.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    async fetchAPI(path, subpath, objectId, filterParams, options) {
        let requestUrl = `${this.state.apiUrl}/${path}`;
        if (objectId) requestUrl = requestUrl + '/' + objectId;
        if (subpath) requestUrl = requestUrl + '/' + subpath;
        if (filterParams) requestUrl = requestUrl + '?' + filterParams;

        return fetch(requestUrl, options)
            .then(res => res.json())
            .catch(err => this.setState({ errorMessage: err.message }))
    }

    async componentDidUpdate(prevProps) {
        if (this.props.open !== prevProps.open && this.props.open === true) {

            this.setState({
                topics: this.props.topics,
                selectedAnswer: null,
                open: true,
                errorMessage: false,
                invalidForm: true
            });
            if (this.props.question) {     // Editing Question
                this.setState({
                    question: this.props.question,
                    text: true,
                    topic: true,
                    editing: true
                });
                return;
            }
            this.setState({
                question: null,
                text: null,
                topic: this.props.topicFilter,
                editing: false
            });
        }
    }

    handleClose(event, isSubmit) {
        this.setState({ open: false, question: null, selectedAnswer: null });
        if (isSubmit) this.props.refreshParent();
        this.props.toggleModalOpen();
    }

    handleCloseConfirm() {
        this.setState({ openConfirm: false, deletionConfirmed: false });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const inputName = target.name;

        let updatedQuestion = this.state.question;
        if (!updatedQuestion) {
            updatedQuestion = {
                text: '',
                topic: this.state.topic
            }
        }
        updatedQuestion[inputName] = value;
        this.setState({
            question: updatedQuestion,
            [inputName]: Boolean(value)
        });

        setTimeout(() => {
            const invalidForm = (
                !this.state.text ||
                !this.state.topic
            );
            this.setState({ invalidForm: invalidForm });
        }, 100);
    }

    async handleSubmit() {
        let options = {
            method: 'POST',
            headers: headersList,
            body: JSON.stringify(this.state.question)
        };
        let result;
        this.setState({ busySubmit: true });
        if (this.state.editing) {
            options.method = 'PATCH';
            result = await this.fetchAPI('questions', null, this.state.question._id, null, options);
        } else {
            result = await this.fetchAPI('questions', null, null, null, options);
        }
        this.setState({ busySubmit: false });
        if (result && result.status === "FAILED") {
            this.setState({ errorMessage: result.data.error })
            return;
        }
        this.handleClose(null, true);
    }

    async handleDeletion() {

        if (!this.state.deletionConfirmed) {
            this.setState({ openConfirm: true, deletionConfirmed: true })
            return;
        }

        let options = {
            method: 'DELETE',
            headers: headersList
        };
        this.setState({ busyDelete: true });

        const result = await this.fetchAPI('questions', null, this.state.question._id, null, options);

        this.setState({ busyDelete: false });

        this.handleCloseConfirm();
        if (result && result.status === "FAILED") {
            this.setState({ errorMessage: result.data.error })
            return;
        }
        this.handleClose(null, true);
    }

    handleKeyDown(event) {
        const keyName = event.key;
        
        if (keyName === "Enter") {
            event.preventDefault();
            if (!this.state.openConfirm && !this.state.invalidForm ) this.handleSubmit();  
            if (this.state.openConfirm) this.handleDeletion();
        }
        if (keyName === "Escape" && this.state.openConfirm ) this.handleCloseConfirm();
        if (keyName === "Escape" && !this.state.openConfirm) this.handleClose();

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
                        <h3>{this.state.editing ? 'Editando Pregunta' : 'Nueva Pregunta'}</h3>
                        <span className='warning'>{this.state.errorMessage}</span>
                        <div className='grid'>
                            <form>
                                <label>
                                    Texto
                                    <input name="text" type="text" required
                                        placeholder="Texto de la Pregunta"
                                        aria-invalid={(this.state.text === null) ? null : !this.state.text}
                                        onChange={this.handleInputChange}
                                        value={this.state.question ? this.state.question.text : ''} />
                                </label>
                                <label>
                                    Tema
                                    <select name="topic" type="text" required
                                        placeholder="Tema al que Corresponde la Pregunta"
                                        aria-invalid={(this.state.topic === null) ? null : !this.state.topic}
                                        onChange={this.handleInputChange}
                                        value={
                                            this.state.question && this.state.question.topic ? this.state.question.topic._id : 
                                                this.state.topic ? this.state.topic : ""}>
                                        {this.state.question && this.state.question.topic ? null :
                                            <option value="">Seleccione un Tema...</option>
                                        }
                                        {this.state.topics ? this.state.topics.map((topic) => {
                                            return (
                                                <option key={topic._id} value={topic._id}>{topic.title}</option>
                                            )
                                        }) : null}
                                    </select>
                                </label>
                            </form>
                        </div>
                        <footer>
                            <a href="#cancel"
                                role="button"
                                className="secondary"
                                onClick={this.handleClose}>
                                Cancelar
                            </a>
                            <a href="#delete"
                                role="button"
                                className='primary outline'
                                disabled={this.state.question && this.state.editing ? false : true}
                                onClick={this.handleDeletion}>
                                Eliminar
                            </a>
                            <a href="#confirm"
                                role="button"
                                aria-busy={this.state.busySubmit}
                                disabled={this.state.invalidForm}
                                onClick={this.handleSubmit}>
                                {this.state.editing ? 'Guardar Cambios' : 'Crear Pregunta'}
                            </a>
                        </footer>
                    </article>

                </dialog>
                <dialog open={this.state.openConfirm}>
                    <article>
                        <h3>Atención</h3>
                        <p>
                            ¿Seguro que quieres borrar la pregunta "{this.state.question ?
                                this.state.question.text : undefined}"?
                        </p>
                        <footer>
                            <a href="#cancel"
                                role="button"
                                className="secondary"
                                onClick={this.handleCloseConfirm}>
                                Cancelar
                            </a>
                            <a href="#confirmDeletion"
                                role="button"
                                aria-busy={this.state.busyDelete}
                                onClick={this.handleDeletion}>
                                Eliminar Pregunta
                            </a>
                        </footer>
                    </article>
                </dialog>
            </div>
        )
    }
}

export default QuestionForm;
