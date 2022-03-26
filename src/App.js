import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Routes } from './Routes';
import { Header } from './components';
import { fetchCategories } from './features/categories/categoriesSlice';
import { fetchCurrencies } from './features/currencies/currenciesSlice';
import { fetchCartProducts } from './features/cart/cartSlice';

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
    this.props.dispatchFetchCartProducts();
  }

  render() {
    const isInitialDataLoaded =
      this.props.areCategoriesLoaded &&
      this.props.areCurrenciesLoaded &&
      this.props.areCartProductsLoaded;

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
  areCartProductsLoaded: PropTypes.bool.isRequired,
  dispatchFetchCategories: PropTypes.func.isRequired,
  dispatchFetchCurrencies: PropTypes.func.isRequired,
  dispatchFetchCartProducts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  areCategoriesLoaded: state.categories.status === 'succeeded',
  areCurrenciesLoaded: state.currencies.status === 'succeeded',
  areCartProductsLoaded: state.cart.status === 'succeeded',
});

const mapDispatchToProps = {
  dispatchFetchCategories: fetchCategories,
  dispatchFetchCurrencies: fetchCurrencies,
  dispatchFetchCartProducts: fetchCartProducts,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
