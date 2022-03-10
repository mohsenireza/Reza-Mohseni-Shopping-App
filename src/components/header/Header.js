import { Component } from 'react';
import { Link } from 'react-router-dom';
import './Header.scss';
import logo from '../../assets/images/logo.svg';
import cart from '../../assets/images/cart.svg';
import { CurrencySwitcher } from '..';

class Header extends Component {
  render() {
    return (
      <header className="header">
        <div className="header__container container">
          <div className="header__column header__categoriesContainer">
            <ul className="header__categories">
              <li className="header__category">
                <Link
                  to="/products?category=1"
                  className="header__categoryLink -active"
                >
                  WOMEN
                </Link>
              </li>
              <li className="header__category">
                <Link
                  to="/products?category=2"
                  className="header__categoryLink"
                >
                  MEN
                </Link>
              </li>
              <li className="header__category">
                <Link
                  to="/products?category=3"
                  className="header__categoryLink"
                >
                  KIDS
                </Link>
              </li>
            </ul>
          </div>
          <Link to="/" className="header__column header__logoContainer">
            <img alt="Logo" className="header__logo" src={logo} />
          </Link>
          <div className="header__column header__cartAndCurrencyContainer">
            <CurrencySwitcher />
            <button className="header__cart">
              <div className="header__cartIconContainer">
                <img alt="Cart Icon" src={cart} />
                <span className="header__cartBadge">2</span>
              </div>
            </button>
          </div>
        </div>
      </header>
    );
  }
}

export { Header };
