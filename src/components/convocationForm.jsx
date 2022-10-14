import React, { Component } from 'react';

const headersList = {
    "Accept": "*/*",
    "Content-Type": "application/json"
}

class ConvocationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiUrl: props.apiUrl,
            convocation: props.convocation,
            name: null,
            year: null,
            institution: null,
            category: null,
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
            if (this.props.convocation) {     // Editing Convocation
                this.setState({
                    convocation: this.props.convocation,
                    name: true,
                    year: true,
                    institution: true,
                    category: true,
                    editing: true
                });
                return;
            }
            this.setState({
                convocation: null,
                name: null,
                year: true,
                institution: null,
                category: null,
                editing: false
            });
        }
    }

    handleClose() {
        this.setState({ open: false, convocation: null });
        this.props.toggleModalOpen();
    }

    handleCloseConfirm() {
        this.setState({ openConfirm: false, deletionConfirmed: false });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const inputName = target.name;

        let updatedConvocation = this.state.convocation;
        if (!updatedConvocation) {
            updatedConvocation = {
                name: '',
                year: new Date().getFullYear(),
                institution: '',
                category: ''
            }
        }

        if (inputName === 'year' && !value) {
            return;
        }

        updatedConvocation[inputName] = value;
        this.setState({
            convocation: updatedConvocation,
            [inputName]: Boolean(value)
        });

        setTimeout(() => {
            const invalidForm = (
                !this.state.name ||
                !this.state.year ||
                !this.state.institution ||
                !this.state.category
            );
            this.setState({ invalidForm: invalidForm });
        }, 100);
    }

    async handleSubmit() {
        let options = {
            method: 'POST',
            headers: headersList,
            body: JSON.stringify(this.state.convocation)
        };
        let result;
        this.setState({ busySubmit: true });
        if (this.state.editing) {  
            options.method = 'PATCH';
            result = await this.fetchAPI('convocations', null, this.state.convocation._id, null, options);
        } else {
            result = await this.fetchAPI('convocations', null, null, null, options);
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

        const result = await this.fetchAPI('convocations', null, this.state.convocation._id, null, options);

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
        
        if (keyName === "Enter" && !this.state.openConfirm && !this.state.invalidForm ) this.handleSubmit();
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
                        <h3>{this.state.editing ? 'Editando Convocatoria' : 'Nueva Convocatoria'}</h3>
                        <span className='warning'>{this.state.errorMessage}</span>
                        <div className='grid'>
                            <form>
                                <label>
                                    Nombre
                                    <input name="name" type="text" required
                                        placeholder="Nombre de la Convocatoria"
                                        aria-invalid={(this.state.name === null) ? null : !this.state.name}
                                        onChange={this.handleInputChange}
                                        value={this.state.convocation ? this.state.convocation.name : ''} />
                                </label>
                                <label>
                                    Año
                                    <input name="year" type="number" required
                                        placeholder="Año de la Convocatoria"
                                        aria-invalid={(this.state.year === null) ? null : !this.state.year}
                                        onChange={this.handleInputChange}
                                        value={this.state.convocation ? this.state.convocation.year : new Date().getFullYear()} />
                                </label>
                                <label>
                                    Administración
                                    <input name="institution" type="text" required
                                        placeholder="Administración convocante"
                                        aria-invalid={(this.state.institution === null) ? null : !this.state.institution}
                                        onChange={this.handleInputChange}
                                        value={this.state.convocation ? this.state.convocation.institution : ''} />
                                </label>
                                <label>
                                    Categoría
                                    <input name="category" type="text" required
                                        placeholder="Categoría profesional"
                                        aria-invalid={(this.state.category === null) ? null : !this.state.category}
                                        onChange={this.handleInputChange}
                                        value={this.state.convocation ? this.state.convocation.category : ''} />
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
                                disabled={this.state.convocation && this.state.editing ? false : true}
                                onClick={this.handleDeletion}>
                                Eliminar
                            </a>
                            <a href="#confirm"
                                role="button"
                                aria-busy={this.state.busySubmit}
                                disabled={this.state.invalidForm}
                                onClick={this.handleSubmit}>
                                {this.state.editing ? 'Guardar Cambios' : 'Crear Convocatoria'}
                            </a>
                        </footer>
                    </article>

                </dialog>
                <dialog open={this.state.openConfirm}>
                    <article>
                        <h3>Atención</h3>
                        <p>
                            ¿Seguro que quieres borrar la convocatoria "{this.state.convocation ?
                                this.state.convocation.fullName : undefined}"?
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
                                Eliminar Convocatoria
                            </a>
                        </footer>
                    </article>
                </dialog>
            </div>
        )
    }
}

export default ConvocationForm;
