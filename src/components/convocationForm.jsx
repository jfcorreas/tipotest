import React, { Component } from 'react';

class ConvocationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiUrl: props.apiUrl,
            open: false,
            convocationId: props.convocationId,
            busy: false,
            query: '',
        };

        this.handleClose = this.handleClose.bind(this);
    }

    handleClose(event) {
        this.setState({ open: false });
    }

    componentDidUpdate(prevProps) {
        if (this.props.open !== prevProps.open && this.props.open === true ){
            this.setState({ open: true, convocationId: this.props.convocationId });
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
                    <h3>Confirm your action!</h3>
                    <p>
                        {this.props.convocationId}
                    </p>
                    <footer>
                        <a href="#cancel"
                            role="button"
                            className="secondary"
                            onClick={this.handleClose}>
                            Cancel
                        </a>
                        <a href="#confirm"
                            role="button">
                            Confirm
                        </a>
                    </footer>
                </article>
            </dialog>
        )
    }
}

export default ConvocationForm;
