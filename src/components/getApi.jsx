
let busy = false;

const Form = () => {
    function handleSubmit(e) {
        e.preventDefault();
        busy = true;
        console.log('You clicked submit.');
    }

    return (
        <form onSubmit={handleSubmit}>
            <label> Consulta en la API TipoTest
                <input required id="input" type="text" placeholder="Introduce aquí el path a consultar en la API" />
                <small>Por ejemplo: convocations</small>
            </label>
            <button type="submit" aria-busy={busy}>Consulta la API</button>
        </form>
    );
};

export default Form;