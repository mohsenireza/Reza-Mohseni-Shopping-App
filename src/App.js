import { Component } from 'react';
import { Routes } from './Routes';

class App extends Component {
  render() {
    return (
      <div className="App">
        {/* Render screens based on routes */}
        <Routes />
      </div>
    );
  }
}

export default App;
