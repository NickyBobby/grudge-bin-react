const React = require('react');
const ReactDOM = require('react-dom');
const store = require('./data-store');

require('./reset.css');
require('./style.scss');

class GrudgeBin extends React.Component {
  constructor() {
    super();
    this.state = {
      grudges: store.all(),
    };
  }

  componenetDidMount() {
    store.on('change', grudges => {
      this.setState({ grudges });
    });
  }

  render() {
    const activeGrudge = this.state.grudges.find( grudge => grudge.active );

    return (
      <div className="GrudgeBin">
        <section className="sidebar">
          <header>
            <h1>{this.props.title}</h1>
            <CreateGrudge/>
            <GrudgesList grudges={this.state.grudges}/>
          </header>
        </section>
        <section className="main-content">
          <ActiveGrudge grudge={activeGrudge}/>
        </section>
      </div>
    );
  }
}

class CreateGrudge extends React.Component {
  constructor() {
    super();
    this.state = {
      person: '',
      reason: '',
    };
  }

  updateProperties(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  createGrudge(e) {
    e.preventDefault();
    store.create(this.state);
    this.setState({ person: '', reason: '' });
  }

  render() {
    return (
      <div className="CreateGrudge">
        <input className="CreateGrudge-person"
               name="person"
               placeholder="Who hurt you?"
               value={this.state.person}
               onChange={(e) => this.updateProperties(e)}
        />
        <textarea className="CreateGrudge-reason"
                  name="reason"
                  placeholder="How did they hurt you?"
                  value={this.state.reason}
                  onChange={(e) => this.updateProperties(e)}
        />
        <input className="CreateGrudge-submit"
               type="submit"
               onClick={(e) => this.createGrudge(e)}
        />
      </div>
    );
  }
}

const GrudgesList = ({ grudges }) => {
  return (
    <div className="GrudgesList">
      {grudges.map(grudge => <GrudgesListItem {...grudge} key={grudge.id}/>)}
    </div>
  );
};

const GrudgesListItem = ({ id, person, reason, active }) => {
  return (
    <div className={active ? 'GrudgesListItem is-active' : 'GrudgesListItem'}>
      <h3 className="GrudgesListItem-person">{person}</h3>
      <div className="GrudgesListItem-reason">{reason}</div>
      <div className="GrudgesListItem-buttons">
        <button onClick={() => store.forgive(id)}>Forgive</button>
        <button onClick={() => store.unforgive(id)}>Back to shit the list!</button>
      </div>
    </div>
  );
};

const ActiveGrudge = ({ grudge }) => {
  if (!grudge) { return <p className="ActiveGrudge">Please select a grudge!</p>; }

  const updateGrudge = (e) => {
    const { name, value } = e.target;
    store.update(grudge.id, Object.assign(grudge, { [name]: value }));
  };

  return (
    <div className="ActiveGrudge">
      <input className="ActiveGrudge-person"
             name="person"
             value={grudge.person}
             onChange={updateGrudge}
      />
      <textarea className="ActiveGrudge-reason"
                name="reason"
                value={grudge.reason}
                onChange={updateGrudge}
      />
    </div>
  )
}

ReactDOM.render(<GrudgeBin person="Who hurt you?"/>, document.querySelector('.application'));
