import { Component } from 'react';
import './CurrencySwitcher.scss';
import arrowDown from '../../assets/images/arrowDown.svg';
import { DetectClickOutside } from '..';

class CurrencySwitcher extends Component {
  constructor(props) {
    super(props);

    // isOpen state defines whether the CurrencySwitcher is open or closed
    this.state = { isOpen: false };

    // Bind event handlers
    this.handleOnToggle = this.handleOnToggle.bind(this);
    this.handleOnCurrencyClick = this.handleOnCurrencyClick.bind(this);
  }

  // Show and hide available currencies
  handleOnToggle({ shouldOpen, shouldClose, auto }) {
    shouldOpen && this.setState({ isOpen: true });
    shouldClose && this.setState({ isOpen: false });
    auto && this.setState((state) => ({ isOpen: !state.isOpen }));
  }

  // Will fire when user selects a currency
  handleOnCurrencyClick() {
    alert('Clicked');
    this.handleOnToggle({ shouldClose: true });
  }

  render() {
    return (
      <DetectClickOutside
        onClickOutside={() => this.handleOnToggle({ shouldClose: true })}
        className={`currencySwitcher ${this.state.isOpen ? '-open' : ''}`}
      >
        <button
          onClick={() => this.handleOnToggle({ auto: true })}
          className="currencySwitcher__header"
        >
          <span className="currencySwitcher__symbol">$</span>
          {/* TODO: Use icomoon instead of img for icons */}
          <img
            alt="Currency Arrow Icon"
            className="currencySwitcher__arrowIcon"
            src={arrowDown}
          />
        </button>
        {this.state.isOpen && (
          <ul className="currencySwitcher__content">
            <li className="currencySwitcher__currencyItem">
              <button
                className="currencySwitcher__currency"
                onClick={this.handleOnCurrencyClick}
              >
                $ USD
              </button>
            </li>
            <li className="currencySwitcher__currencyItem">
              <button
                className="currencySwitcher__currency"
                onClick={this.handleOnCurrencyClick}
              >
                € EUR
              </button>
            </li>
            <li className="currencySwitcher__currencyItem">
              <button
                className="currencySwitcher__currency"
                onClick={this.handleOnCurrencyClick}
              >
                ¥ JPY
              </button>
            </li>
          </ul>
        )}
      </DetectClickOutside>
    );
  }
}

export { CurrencySwitcher };
