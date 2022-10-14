import React, { Component } from 'react';

const headersList = {
    "Accept": "*/*",
    "Content-Type": "application/json"
}

class TopicForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiUrl: props.apiUrl,
            topic: props.topic,
            shorthand: null,
            title: null,
            errorMessage: null,
            open: false,
            openConfirm: false,
            busySubmit: false,
            busyDelete: false,
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

    componentDidUpdate(prevProps) {
        if (this.props.open !== prevProps.open && this.props.open === true) {
            this.setState({
                open: true,
                errorMessage: false,
                invalidForm: true
            });
            if (this.props.topic) {     // Editing Topic
                this.setState({
                    topic: this.props.topic,
                    shorthand: true,
                    title: true,
                    editing: true
                });
                return;
            }
            this.setState({
                topic: null,
                shorthand: null,
                title: null,
                editing: false
            });
        }
    }

    handleClose() {
        this.setState({ open: false, topic: null });
        this.props.toggleModalOpen();
    }

    handleCloseConfirm() {
        this.setState({ openConfirm: false, deletionConfirmed: false });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const inputName = target.name;

        let updatedTopic = this.state.topic;
        if (!updatedTopic) {
            updatedTopic = {
                shorthand: '',
                title: '',
                fullTitle: ''
            }
        }
        updatedTopic[inputName] = value;
        this.setState({
            topic: updatedTopic,
            [inputName]: Boolean(value)
        });

        setTimeout(() => {
            const invalidForm = (
                !this.state.shorthand ||
                !this.state.title
            );
            this.setState({ invalidForm: invalidForm });
        }, 100);
    }

    async handleSubmit() {
        let options = {
            method: 'POST',
            headers: headersList,
            body: JSON.stringify(this.state.topic)
        };
        let result;
        this.setState({ busySubmit: true });
        if (this.state.editing) {  
            options.method = 'PATCH';
            result = await this.fetchAPI('topics', null, this.state.topic._id, null, options);
        } else {
            result = await this.fetchAPI('topics', null, null, null, options);
        }
        this.setState({ busySubmit: false });
        if (result && result.status === "FAILED") {
            this.setState({ errorMessage: result.data.error })
            return;
        }
        this.props.refreshParent();
        this.handleClose();
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

        const result = await this.fetchAPI('topics', null, this.state.topic._id, null, options);

        this.setState({ busyDelete: false });

        this.handleCloseConfirm();
        if (result && result.status === "FAILED") {
            this.setState({ errorMessage: result.data.error })
            return;
        }
        this.props.refreshParent();
        this.handleClose();
    }

    handleKeyDown(event) {
        const keyName = event.key;

        if (keyName === "Escape") this.handleClose();
        if (!this.state.invalidForm && keyName === "Enter") this.handleSubmit();
    }

    render() {
        return (
            <div tabIndex="0"
                onKeyDown={this.state.open && !this.state.openConfirm?  this.handleKeyDown : null}>
                <dialog open={this.state.open}>

                    <article>
                        <a href="#close"
                            aria-label="Close"
                            className="close"
                            onClick={this.handleClose}>
                        </a>
                        <h3>{this.state.editing ? 'Editando Tema' : 'Nuevo Tema'}</h3>
                        <span className='warning'>{this.state.errorMessage}</span>
                        <div className='grid'>
                            <form>
                                <label>
                                    Abreviatura
                                    <input name="shorthand" type="text" required
                                        placeholder="Abreviatura del Título del Tema"
                                        aria-invalid={(this.state.shorthand === null) ? null : !this.state.shorthand}
                                        onChange={this.handleInputChange}
                                        value={this.state.topic ? this.state.topic.shorthand : ''} />
                                </label>
                                <label>
                                    Título
                                    <input name="title" type="text" required
                                        placeholder="Título del Tema"
                                        aria-invalid={(this.state.title === null) ? null : !this.state.title}
                                        onChange={this.handleInputChange}
                                        value={this.state.topic ? this.state.topic.title : ''} />
                                </label>
                                <label>
                                    Título Completo
                                    <textarea name="fullTitle"
                                        placeholder="Detalle de Todos los Conceptos del Tema"
                                        onChange={this.handleInputChange}
                                        value={this.state.topic ? this.state.topic.fullTitle : ''} />
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
                                disabled={this.state.topic && this.state.editing ? false : true}
                                onClick={this.handleDeletion}>
                                Eliminar
                            </a>
                            <a href="#confirm"
                                role="button"
                                aria-busy={this.state.busySubmit}
                                disabled={this.state.invalidForm}
                                onClick={this.handleSubmit}>
                                {this.state.editing ? 'Guardar Cambios' : 'Crear Tema'}
                            </a>
                        </footer>
                    </article>

                </dialog>
                <dialog open={this.state.openConfirm}>
                    <article>
                        <h3>Atención</h3>
                        <p>
                            ¿Seguro que quieres borrar el tema "{this.state.topic ?
                                this.state.topic.title : undefined}"?
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
                                Eliminar Tema
                            </a>
                        </footer>
                    </article>
                </dialog>
            </div>
        )
    }
}

export default TopicForm;
