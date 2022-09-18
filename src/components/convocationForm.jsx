import React, { Component } from 'react';

class ConvocationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiUrl: props.apiUrl,
            open: false,
            convocationId: props.convocationId,
            convocation: null,
            busy: false,
            query: ''
        };

        this.handleClose = this.handleClose.bind(this);
    }

    async fetchConvocations(convocationQuery) {
        return fetch(`${this.state.apiUrl}/convocations/${convocationQuery}`)
            .then(res => res.json())
            .catch(err => console.error(err))
    }

    handleClose(event) {
        this.setState({ open: false });
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
                        busy: false
                    });
                }
                this.props.cursorBusyHandler();
                return;
            }
            this.setState({
                open: true,
                convocationId: null,
                convocation: null
            });
            this.props.cursorBusyHandler();
        }
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
                    <h3 aria-busy={this.state.busy}>{this.state.convocationId ? 'Editando Convocatoria' : 'Nueva Convocatoria'}</h3>
                    <div className='grid'>
                        <form>
                            <label>
                                Nombre
                                <input name="name" type="text" required placeholder="Nombre de la Convocatoria"
                                    defaultValue={this.state.convocation ? this.state.convocation.name : ''} />
                            </label>
                            <label>
                                Año
                                <input name="year" type="number" required placeholder="Año de la Convocatoria"
                                    defaultValue={this.state.convocation ? this.state.convocation.year : new Date().getFullYear() } />
                            </label>
                            <label>
                                Administración
                                <input name="institution" type="text" required placeholder="Administración convocante"
                                    defaultValue={this.state.convocation ? this.state.convocation.institution : ''} />
                            </label>
                            <label>
                                Categoría
                                <input name="category" type="text" required placeholder="Categoría profesional"
                                    defaultValue={this.state.convocation ? this.state.convocation.category : ''} />
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
                            role="button">
                            {this.state.convocationId ? 'Guardar Cambios' : 'Crear Convocatoria'}
                        </a>
                    </footer>
                </article>
            </dialog>
        )
    }
}

export default ConvocationForm;
