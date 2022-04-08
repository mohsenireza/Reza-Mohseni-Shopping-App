import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './Header.scss';
import logo from '../../assets/images/logo.svg';
import { ReactComponent as Menu } from '../../assets/images/menu.svg';
import { CurrencySwitcher, MiniCart, Drawer } from '../index';
import { withBreakpoint } from '../../hoc';

class HeaderComp extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // Render drawer in screens smaller than 'sm'
    const shouldRenderDrawer = ['xxxsm', 'xxsm', 'xsm', 'sm'].includes(
      this.props.breakpoint
    );

    const renderCategories = (onLinkClick = () => {}) =>
      this.props.categories.map((category) => {
        // If the selected category from store is equal to this category Item
        // then it means this category is the selected one
        // so we add '-selected' className to make it highlighted
        const isCategorySelected = this.props.selectedCategory === category;
        return (
          <li key={category} className="header__category">
            <Link
              to={`/products?category=${category}`}
              onClick={onLinkClick}
              className={`header__categoryLink ${
                isCategorySelected ? '-selected' : ''
              }`}
            >
              {category}
            </Link>
          </li>
        );
      });

    return (
      <header id="header" className="header">
        <div className="header__container container">
          <div className="header__column header__categoriesContainer">
            {shouldRenderDrawer ? (
              <Drawer
                renderToggler={(onDrawerOpen) => (
                  <button
                    data-testid="headerDrawerToggler"
                    className="header__drawerToggler"
                    onClick={(e) => {
                      // Prevent <DetectClickOutside /> to get the click event and close the drawer after opening it
                      e.stopPropagation();
                      onDrawerOpen();
                    }}
                  >
                    <Menu
                      className="header__drawerTogglerImage"
                      fill="#1d1f22"
                    />
                  </button>
                )}
                renderDrawerBody={(onDrawerClose) => (
                  <ul className="header__categories">
                    {renderCategories(onDrawerClose)}
                  </ul>
                )}
              />
            ) : (
              <ul className="header__categories">{renderCategories()}</ul>
            )}
          </div>
          <Link to="/products" className="header__column header__logoContainer">
            <img
              loading="lazy"
              alt="Logo"
              className="header__logo"
              src={logo}
            />
          </Link>
          <div className="header__column header__cartAndCurrencyContainer">
            <CurrencySwitcher />
            <MiniCart />
          </div>
        </div>
      </header>
    );
  }
}

HeaderComp.propTypes = {
  categories: PropTypes.array.isRequired,
  selectedCategory: PropTypes.string,
  breakpoint: PropTypes.string,
};

const mapStateToProps = (state) => ({
  categories: state.categories.categories,
  selectedCategory: state.categories.selectedCategory,
});

const Header = withBreakpoint(connect(mapStateToProps)(HeaderComp));

export { Header };
