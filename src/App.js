import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Routes } from './Routes';
import { Header } from './components';

class App extends Component {
  render() {
    const isInitialDataLoaded =
      this.props.areCategoriesLoaded && this.props.areCurrenciesLoaded;

    // Render the app after initial data gets loaded, otherwise render a loading component
    return isInitialDataLoaded ? (
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
  areCurrenciesLoaded: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  areCategoriesLoaded: state.categories.status === 'succeeded',
  areCurrenciesLoaded: state.currencies.status === 'succeeded',
});

export default connect(mapStateToProps)(App);
