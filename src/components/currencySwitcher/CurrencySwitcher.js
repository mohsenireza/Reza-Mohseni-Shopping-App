import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './CurrencySwitcher.scss';
import arrowDown from '../../assets/images/arrowDown.svg';
import { DetectClickOutside } from '..';
import {
  currencySelected,
  selectSelectedCurrency,
} from '../../features/global/globalSlice';
import { storage } from '../../utils';

class CurrencySwitcherComp extends Component {
  constructor(props) {
    super(props);

    // isOpen state defines whether the CurrencySwitcher is open or closed
    this.state = { isOpen: false };

    // Bind event handlers
    this.handleToggle = this.handleToggle.bind(this);
    this.handleCurrencyClick = this.handleCurrencyClick.bind(this);
  }

  componentDidMount() {
    // Check if a valid currency exists in localStorage
    const savedCurrency = storage.load('currency');
    const isSavedCurrencyValid =
      savedCurrency &&
      this.props.currencies.some(
        (currency) => currency.label === savedCurrency.label
      );
    // If a valid currency exists in localStorage, then put it inside store as selectedCurrency
    if (isSavedCurrencyValid) {
      this.props.dispatchCurrencySelected(savedCurrency);
    }
    // If a valid currency doesn't exist in localStorage, then get the first currency item from store and save it as selectedCurrency in store
    else {
      const defaultCurrency = this.props.currencies[0];
      this.props.dispatchCurrencySelected(defaultCurrency);
    }
  }

  // Show and hide available currencies
  handleToggle({ shouldOpen, shouldClose, auto }) {
    shouldOpen && this.setState({ isOpen: true });
    shouldClose && this.setState({ isOpen: false });
    auto && this.setState((state) => ({ isOpen: !state.isOpen }));
  }

  // Puts selected currency in store and localstorage
  handleCurrencyClick(currency) {
    this.props.dispatchCurrencySelected(currency);
    storage.save('currency', currency);
    this.handleToggle({ shouldClose: true });
  }

  render() {
    const { currencies, selectedCurrency } = this.props;

    // Render currencies based on the store
    const renderedCurrencies = currencies.map((currency) => (
      <li
        key={currency.label}
        className={`currencySwitcher__currencyItem ${
          selectedCurrency && selectedCurrency.label === currency.label
            ? '-selected'
            : ''
        }`}
      >
        <button
          className="currencySwitcher__currency"
          onClick={() => this.handleCurrencyClick(currency)}
        >
          {currency.symbol} {currency.label}
        </button>
      </li>
    ));

    return (
      <DetectClickOutside
        onClickOutside={() => this.handleToggle({ shouldClose: true })}
        className={`currencySwitcher ${this.state.isOpen ? '-open' : ''}`}
      >
        <button
          data-testid="currencySwitcherHeader"
          onClick={() => this.handleToggle({ auto: true })}
          className="currencySwitcher__header"
        >
          <span className="currencySwitcher__symbol">
            {selectedCurrency ? selectedCurrency.symbol : ''}
          </span>
          <img
            loading="lazy"
            alt="Currency Arrow Icon"
            className="currencySwitcher__arrowIcon"
            src={arrowDown}
          />
        </button>
        {this.state.isOpen && (
          <ul className="currencySwitcher__content">{renderedCurrencies}</ul>
        )}
      </DetectClickOutside>
    );
  }
}

CurrencySwitcherComp.propTypes = {
  currencies: PropTypes.array.isRequired,
  selectedCurrency: PropTypes.object,
  dispatchCurrencySelected: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  currencies: state.global.currencies,
  selectedCurrency: selectSelectedCurrency(state),
});

const mapDispatchToProps = {
  dispatchCurrencySelected: currencySelected,
};

const CurrencySwitcher = connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrencySwitcherComp);

export { CurrencySwitcher };
