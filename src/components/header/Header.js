import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './Header.scss';
import logo from '../../assets/images/logo.svg';
import { ReactComponent as Menu } from '../../assets/images/menu.svg';
import { CurrencySwitcher, MiniCart, Drawer } from '../index';
import { categorySelected } from '../../features/categories/categoriesSlice';
import { withBreakpoint, withRouter } from '../../hoc';
import { getParameterByName } from '../../utils';

class HeaderComp extends Component {
  constructor(props) {
    super(props);

    // Bind methods
    this.getDataFromUrl = this.getDataFromUrl.bind(this);
  }

  // Fill store with URL on startup
  componentDidMount() {
    this.getDataFromUrl();
  }

  // Fill store with URL on every URL change
  componentDidUpdate(prevProps) {
    if (prevProps.router.location !== this.props.router.location) {
      this.getDataFromUrl();
    }
  }

  // Fill store with URL
  // Because we get store data from URL,
  // even after reloading, our app can hold its old state,
  // like selected category
  getDataFromUrl() {
    const selectedCategoryFromQueryString = getParameterByName('category');
    const categories = this.props.categories;
    // If the category from URL exists in the store, we can use it as the selected category
    if (categories.includes(selectedCategoryFromQueryString)) {
      this.props.dispatchCategorySelected(selectedCategoryFromQueryString);
    }
    // Otherwise we select the first category Item in store as the selected category
    else if (categories.length) {
      const defaultCategory = categories[0];
      this.props.dispatchCategorySelected(defaultCategory);
    }
  }

  render() {
    // Render drawer in screens smaller than 'sm'
    const shouldRenderDrawer = ['xxxsm', 'xxsm', 'xsm', 'sm'].includes(
      this.props.breakpoint
    );

    const renderCategories = (onLinkClick = () => {}) =>
      this.props.categories.map((category) => {
        // If the selected category from store is equal to thi category Item
        // the it means this category is the selected one
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
      <header className="header">
        <div className="header__container container">
          <div className="header__column header__categoriesContainer">
            {shouldRenderDrawer ? (
              <Drawer
                renderToggler={(toggleDrawer) => (
                  <button
                    className="header__drawerToggler"
                    onClick={toggleDrawer}
                  >
                    <Menu
                      className="header__drawerTogglerImage"
                      fill="#1d1f22"
                    />
                  </button>
                )}
                renderDrawerBody={(toggleDrawer) => (
                  <ul className="header__categories">
                    {renderCategories(() => toggleDrawer(false))}
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
  dispatchCategorySelected: PropTypes.func.isRequired,
  router: PropTypes.object,
  breakpoint: PropTypes.string,
};

const mapStateToProps = (state) => ({
  categories: state.categories.categories,
  selectedCategory: state.categories.selectedCategory,
});

const mapDispatchToProps = {
  dispatchCategorySelected: categorySelected,
};

const Header = withBreakpoint(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderComp))
);

export { Header };
