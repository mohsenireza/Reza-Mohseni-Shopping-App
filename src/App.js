import { Component } from 'react';
import { Routes } from './Routes';
import { Header } from './components';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        {/* Render screens based on routes */}
        <Routes />
      </div>
    );
  }
}

export default App;
