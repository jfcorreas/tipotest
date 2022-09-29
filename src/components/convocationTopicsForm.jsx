import React, { Component } from 'react';

const headersList = {
    "Accept": "*/*",
    "Content-Type": "application/json"
}

class ConvocationTopicsForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiUrl: props.apiUrl,
            convocation: props.convocation,
            selectableTopics: [],
            errorMessage: null,
            open: false,
            busySubmit: false,
            invalidForm: true
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async fetchAPI(path, subpath, objectId, filterParams, options) {
        let requestUrl = `${this.state.apiUrl}/${path}`;
        if (subpath) requestUrl = requestUrl + '/' + subpath;
        if (objectId) requestUrl = requestUrl + '/' + objectId;
        if (filterParams) requestUrl = requestUrl + '?' + filterParams;

        return fetch(requestUrl, options)
            .then(res => res.json())
            .catch(err => this.setState({ errorMessage: err.message }))
    }

    async componentDidUpdate(prevProps) {
        if (this.props.open !== prevProps.open &&
            this.props.open === true &&
            this.props.convocation ) {
            const fetchResult = await this.fetchAPI('topics');
            const allTopics = fetchResult && fetchResult.data ? fetchResult.data : [];
            console.log(this.props.convocation);
            const selectableTopics = allTopics.filter((topic) => !this.props.convocation.topicList.includes(topic));
            this.props.toggleParentBusy();
            this.setState({
                convocation: this.props.convocation,
                selectableTopics: selectableTopics,
                open: true,
                errorMessage: false
            });
        }
    }

    handleClose() {
        this.setState({ open: false, convocation: null });
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
                        <h3>Editando Temario</h3>
                        <span className='warning'>{this.state.errorMessage}</span>
                        <div className='grid'>

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
                                aria-busy={this.state.busySubmit}
                                disabled={this.state.invalidForm}
                                onClick={this.handleSubmit}>
                                Guardar Cambios
                            </a>
                        </footer>
                    </article>

                </dialog>
            </div>
        )
    }
}

export default ConvocationTopicsForm;
