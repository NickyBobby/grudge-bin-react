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
    return (
      <div className="GrudgeBin">
          <header>
            <h1>The Shit List</h1>
            <h2>You may get forgiven, but never forgotten...</h2>
            <GrudgesListStats grudges={this.state.grudges}/>
            <CreateGrudge/>
            <GrudgesList grudges={this.state.grudges}/>
          </header>
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

const GrudgesListItem = (grudge) => {
  const updateGrudgeStatus = (e) => {
    let updatedStatus = "forgiven";
    if (grudge.status !== "unforgiven") {
      updatedStatus = "unforgiven";
    }
    store.update(grudge.id, {status: updatedStatus});
  }

  return (
    <div className={grudge.status === "unforgiven" ? 'GrudgesListItem unforgiven' : 'GrudgesListItem forgiven'}>
      <h3 className="GrudgesListItem-person">{grudge.person}</h3>
      <div className="GrudgesListItem-reason">{grudge.reason}</div>
      <br/>
      <div>Status: {grudge.status}</div>
      <div className="GrudgesListItem-buttons">
        <button onClick={updateGrudgeStatus}>{grudge.status === "unforgiven" ? "You really want to forgive " + grudge.person + "?" : grudge.person + " is back on the shit list!"}</button>
      </div>
    </div>
  );
};

const GrudgesListStats = ({ grudges }) => {
  const total = grudges.length;
  const unforgiven = grudges.filter(function(grudge) { return grudge.status === "unforgiven"}).length;
  const forgiven = grudges.filter(function(grudge) { return grudge.status === "forgiven"}).length;
  return (
    <div className="main-content">
      <h3>Total Grudges: {total}</h3>
      <h3>Total Unforgiven: {unforgiven}</h3>
      <h3>Total Forgiven: {forgiven}</h3>
    </div>
  );
};

ReactDOM.render(<GrudgeBin/>, document.querySelector('.application'));
