import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Routes } from './Routes';
import { Header } from './components';

class App extends Component {
  render() {
    // Render the app after initial data gets loaded, otherwise render a loading component
    return this.props.areCategoriesLoaded ? (
      <div className="App">
        <Header />
        {/* Render screens based on routes */}
        <Routes />
      </div>
    ) : (
      <div>Loading Global Data...</div>
    );
  }
}

App.propTypes = {
  areCategoriesLoaded: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  areCategoriesLoaded: state.categories.status === 'succeeded',
});

export default connect(mapStateToProps)(App);
