
import React, { Component } from 'react';

class TestsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiUrl: props.apiUrl,
            tests: [],
            testSelected: null,
            errorMessage: null,
            componentBusy: null
        };

        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
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
            testSelected: null
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

    toggleComponentBusy() {
        this.setState({ componentBusy: this.state.componentBusy ? null : 'componentBusy' });
    }

    setErrorMessage(msg) {
        this.setState({ errorMessage: msg });
    }

    render() {
        return (
            <div>
                    <h4 aria-busy={this.state.componentBusy ? true : false}>
                        Tests Realizados 
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
                                            "selected" : null }
                                        onClick={this.handleRowClick}>
                                        <td scope="row">
                                            <input type="checkbox" 
                                                readOnly
                                                checked={this.state.testSelected && 
                                                    this.state.testSelected._id === test._id ? 
                                                    true : false }
                                            />
                                        </td>
                                        <td>{test.submitted? test.updatedAt : "Sin completar"}</td>
                                        <td>{test.questionList.length}</td>
                                        <td>{test.score}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
            </section>
            </div>
        )
    }
}

export default TestsTable;