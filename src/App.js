import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Routes } from './Routes';
import { Header } from './components';
import { fetchCategories } from './features/categories/categoriesSlice';
import { fetchCurrencies } from './features/currencies/currenciesSlice';

class App extends Component {
  constructor(props) {
    super(props);

    // Bind methods
    this.fetchInitialData = this.fetchInitialData.bind(this);
  }

  // Fetch initial data on startup
  componentDidMount() {
    this.fetchInitialData();
  }

  fetchInitialData() {
    this.props.dispatchFetchCategories();
    this.props.dispatchFetchCurrencies();
  }

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
      <span>Loading Global Data...</span>
    );
  }
}

App.propTypes = {
  areCategoriesLoaded: PropTypes.bool.isRequired,
  areCurrenciesLoaded: PropTypes.bool.isRequired,
  dispatchFetchCategories: PropTypes.func.isRequired,
  dispatchFetchCurrencies: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  areCategoriesLoaded: state.categories.status === 'succeeded',
  areCurrenciesLoaded: state.currencies.status === 'succeeded',
});

const mapDispatchToProps = {
  dispatchFetchCategories: fetchCategories,
  dispatchFetchCurrencies: fetchCurrencies,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
