
import React, {Component} from 'react';

const config = {
    apiurl: "http://localhost:3080/api/v1"
};

const fetchInfo = (apiPath) => {
    return fetch(`${config.apiurl}/${apiPath}`)
        .then(res => res.json())
        .catch(err => console.error(err))
}

class APIForm extends Component {
    constructor(props) {
        super(props);
        this.state = {busy: false, content: "Consulta la API"};

        this.handleClick = this.handleClick.bind(this);
    }

    async handleClick() {
        this.setState(prevState => ({ busy: !prevState.busy }));
        const fetchResult = await fetchInfo('convocations');  
        const convocations = fetchResult && fetchResult.data? fetchResult.data : [];
        
        this.setState(prevState => ({ busy: !prevState.busy , content: convocations[0].name}));
    }

    render() {
        return (
            <button onClick={this.handleClick} aria-busy={this.state.busy}>{this.state.content}</button>
        )
    }
}

export default APIForm;