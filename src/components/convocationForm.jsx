import React, { Component } from 'react';

const headersList = {
    "Accept": "*/*",
    "Content-Type": "application/json"
   }

class ConvocationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorText: null,
            apiUrl: props.apiUrl,
            open: false,
            convocationId: props.convocationId,
            convocation: null,
            busy: false,
            query: '',
            name: null,
            year: null,
            institution: null,
            category: null,
            invalidForm: true
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // TODO: Handle API errors and refactor Fetchs
    async fetchConvocations(convocationQuery) {
        return fetch(`${this.state.apiUrl}/convocations/${convocationQuery}`)
            .then(res => res.json())
            .catch(err => console.error(err))
    }

    async updateConvocation(convocationId, options) {
        return fetch(`${this.state.apiUrl}/convocations/${convocationId}`, options)
        .then(res => res.json())
        .catch(err => console.error(err)) 
    }

    async newConvocation(options) {
        return fetch(`${this.state.apiUrl}/convocations`, options)
        .then(res => res.json())
        .catch(err => console.error(err)) 
    }

    async componentDidUpdate(prevProps) {
        if (this.props.open !== prevProps.open && this.props.open === true) {
            if (this.props.convocationId) {     // Editing Convocation
                this.setState({ busy: true });
                const res = await this.fetchConvocations(this.props.convocationId);
                if (res.status === 'OK') {
                    this.setState({
                        open: true,
                        convocationId: this.props.convocationId,
                        convocation: res.data,
                        busy: false,
                        name: true,
                        year: true,
                        institution: true,
                        category: true,
                        invalidForm: true
                    });
                }
                this.props.cursorBusyHandler();
                return;
            }
            this.setState({
                open: true,
                convocationId: null,
                convocation: null,
                name: null,
                year: true,
                institution: null,
                category: null,
                invalidForm: true
            });
            this.props.cursorBusyHandler();
        }
    }

    handleClose() {
        this.setState({ open: false });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        let updatedConvocation = this.state.convocation;
        if (!updatedConvocation) {
            updatedConvocation = {
                name: '',
                year: new Date().getFullYear(),
                institution: '',
                category: ''
            }
        }

        if (name === 'year' && !value) {
            return;
        }

        updatedConvocation[name] = value;
        this.setState({
            convocation: updatedConvocation,
            [name]: Boolean(value)
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
        this.setState({ busy: true });
        if (this.state.convocationId) {     // Editing Convocation
            options.method= 'PATCH';
            await this.updateConvocation(this.state.convocationId,options);
        } else {
            await this.newConvocation(options);
        }
        this.setState({ busy: false });
        this.props.refreshParent();
        this.handleClose();
    }

    render() {
        return (
            <dialog open={this.state.open}>

                <article>
                    <a href="#close"
                        aria-label="Close"
                        className="close"
                        onClick={this.handleClose}>
                    </a>
                    <h3>{this.state.convocationId ? 'Editando Convocatoria' : 'Nueva Convocatoria'}</h3>
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
                            <label> Temario

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
                        <a href="#confirm"
                            role="button"
                            aria-busy={this.state.busy}
                            disabled={this.state.invalidForm}
                            onClick={this.handleSubmit}>
                            {this.state.convocationId ? 'Guardar Cambios' : 'Crear Convocatoria'}
                        </a>
                    </footer>
                </article>
            </dialog>
        )
    }
}

export default ConvocationForm;
