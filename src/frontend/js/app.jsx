/* global document */
import React, { PureComponent } from 'react';
import { ipcRenderer } from 'electron';
import ProperCombo from 'react-propercombo';
import Words from './words';

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      connected: false,
      tables: [],
      schemas: [],
      selectedSchemas: [],
      words: {},
    };
  }

  componentWillMount() {
    // Listen for db connected
    ipcRenderer.on('db-conected', (e, results) => {
      const schemasSet = new Set();
      const schemas = [];

      const tables = results.map((record) => {
        if (!schemasSet.has(record.TABLE_SCHEMA)) {
          schemas.push(record.TABLE_SCHEMA);
          schemasSet.add(record.TABLE_SCHEMA);
        }
        
        return record.TABLE_NAME;
      });

      this.setState({
        connected: true,
        tables,
        schemas,
      });
    });
  }

  onDBFormSubmit(e) {
    e.preventDefault();
    const port = document.getElementById('db-port').value;
    const host = document.getElementById('db-host').value || '127.0.0.1';
    const user = document.getElementById('db-user').value;
    const password = document.getElementById('db-pass').value;

    // Send db connection
    ipcRenderer.send('db-conection', { host, port, user, password });
  }

  onGenerateSQL(e) {
    console.log('generate', e);
  }

  buildDbCredentialsForm() {
    return !this.state.connected ? (
      <form onSubmit={this.onDBFormSubmit}>
        <div className="form-group">
          <label htmlFor="db-host">Host</label>
          <input
            id="db-host"
            className="form-control"
            placeholder="127.0.0.1"
            aria-describedby="hostHelp"
          />
          <small id="hostHelp" className="form-text text-muted">Mysql db host.</small>
        </div>
        <div className="form-group">
          <label htmlFor="db-port">Port</label>
          <input
            id="db-port"
            className="form-control"
            placeholder="Port"
            aria-describedby="portHelp"
          />
          <small id="portHelp" className="form-text text-muted">Mysql db port.</small>
        </div>
        <div className="form-group">
          <label htmlFor="db-user">Username</label>
          <input
            id="db-user"
            className="form-control"
            placeholder="User"
            aria-describedby="userHelp"
          />
          <small id="userHelp" className="form-text text-muted">Mysql db user.</small>
        </div>
        <div className="form-group">
          <label htmlFor="db-pass">Password</label>
          <input
            type="password"
            className="form-control"
            id="db-pass"
            placeholder="Password"
            aria-describedby="passHelp"
          />
          <small id="passHelp" className="form-text text-muted">Mysql db password.</small>
        </div>
        <button type="submit" className="btn btn-primary">Connect!</button>
      </form>
    ) : null;
  }

  buildSelectors() {
    return this.state.connected ? (
      <div className="selectors">
        <h3>Schemas</h3>
        <ProperCombo
          data={this.state.schemas.map(sch => ({ value: sch, label: sch }))}
          multiSelect
          afterSelect={(data, selection) => {
            this.setState({ selectedSchemas: selection });
          }}
        />
        <h3>Words</h3>
        <Words
          words={this.state.words}
          onAdd={() => {
            const words = Object.assign({}, this.state.words);
            words.new = '';
            this.setState({ words });
          }}
          onRemove={(word) => {
            const words = Object.assign({}, this.state.words);
            delete words[word];
            this.setState({ words });
          }}
        />
      </div>
    ) : null;
  }

  render() {
    const creditForm = this.buildDbCredentialsForm();
    const selectors = this.buildSelectors();

    return (
      <div className="container-fluid">
        <div className="row col-12 col-md-12">
          {creditForm}
        </div>
        <div className="row col-12 col-md-12">
          {selectors}
        </div>
        <div className="row col-12 col-md-12">
          <button
            type="button"
            className="btn btn-outline-success"
            onClick={this.onGenerateSQL}
          >
            Generate SQL
          </button>
        </div>
      </div>
    );
  }
}
