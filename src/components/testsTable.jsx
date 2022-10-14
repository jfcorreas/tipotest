
import React, { Component } from 'react';

const headersList = {
    "Accept": "*/*",
    "Content-Type": "application/json"
}

class TestsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiUrl: props.apiUrl,
            tests: [],
            testSelected: null,
            errorMessage: null,
            componentBusy: null,
            busyDelete: false,
            openConfirm: false,
            deletionConfirmed: false
        };

        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleCloseConfirm = this.handleCloseConfirm.bind(this);
        this.handleDeletion = this.handleDeletion.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
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
        await this.handleRefresh();
    }

    async handleRefresh() {
        this.setErrorMessage(null);
        this.toggleComponentBusy();

        const fetchResult = await this.fetchAPI('tests');

        const tests = fetchResult && fetchResult.data ? fetchResult.data : [];
        this.setState({
            tests: tests,
            testSelected: null,
            openConfirm: false,
            deletionConfirmed: false
        });
        this.toggleComponentBusy();
    }

    handleRowClick(event) {
        this.setErrorMessage(null);

        const test = this.state.tests.find(test => test._id === event.currentTarget.id)

        this.setState({
            testSelected: test
        });
    }

    handleCloseConfirm() {
        this.setState({ openConfirm: false, deletionConfirmed: false });
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

        const result = await this.fetchAPI('tests', null, this.state.testSelected._id, null, options);

        this.setState({ busyDelete: false });

        this.handleCloseConfirm();
        if (result && result.status === "FAILED") {
            this.setState({ errorMessage: result.data.error })
            return;
        }
        this.handleRefresh();
    }

    handleKeyDown(event) {
        const keyName = event.key;

        if (keyName === "Enter" && this.state.testSelected) this.handleDeletion();
        if (keyName === "Escape" && this.state.openConfirm) this.handleCloseConfirm();
        if (keyName === "Escape" && !this.state.openConfirm) this.handleRefresh();
    }

    toggleComponentBusy() {
        this.setState({ componentBusy: this.state.componentBusy ? null : 'componentBusy' });
    }

    setErrorMessage(msg) {
        this.setState({ errorMessage: msg });
    }

    render() {
        return (
            <div tabIndex="0" onKeyDown={this.handleKeyDown}>
                <h4 aria-busy={this.state.componentBusy ? true : false}>
                    Tests Realizados ({this.state.tests.length})
                </h4>
                <section className={this.state.componentBusy}>
                    <div className='warning'>{this.state.errorMessage}</div>
                    <a href="#" onClick={this.handleRefresh}>🔁 Actualizar</a>
                    <table>
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">Fecha de Realización</th>
                                <th scope="col">#Preguntas</th>
                                <th scope="col">Puntuación Obtenida</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.tests.map((test) => {
                                return (
                                    <tr key={test._id}
                                        id={test._id}
                                        title="Haga click para seleccionar"
                                        className={this.state.testSelected &&
                                            this.state.testSelected._id === test._id ?
                                            "selected" : null}
                                        onClick={this.handleRowClick}>
                                        <td scope="row">
                                            <input type="checkbox"
                                                readOnly
                                                checked={this.state.testSelected &&
                                                    this.state.testSelected._id === test._id ?
                                                    true : false}
                                            />
                                        </td>
                                        <td>{test.submitted ? test.updatedAt : "Sin completar"}</td>
                                        <td>{test.questionList.length}</td>
                                        <td>{test.score}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <a href="#delete"
                        role="button"
                        className='primary outline'
                        disabled={!this.state.testSelected}
                        onClick={this.handleDeletion}>
                        Eliminar
                    </a>
                </section>
                <dialog open={this.state.openConfirm}>
                    <article>
                        <h3>Atención</h3>
                        <p>
                            ¿Seguro que quieres borrar el test seleccionado?
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
                                Eliminar Test
                            </a>
                        </footer>
                    </article>
                </dialog>
            </div>
        )
    }
}

export default TestsTable;