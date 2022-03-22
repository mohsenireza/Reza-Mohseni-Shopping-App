import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './Header.scss';
import logo from '../../assets/images/logo.svg';
import cart from '../../assets/images/cart.svg';
import { CurrencySwitcher } from '..';
import { categorySelected } from '../../features/categories/categoriesSlice';
import { withRouter } from '../../hoc';

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
  // like selected category and currency
  getDataFromUrl() {
    const queryString = this.props.router.location.search;
    // TODO: support URLSearchParams in IE
    const selectedCategoryFromQueryString = new URLSearchParams(
      queryString
    ).get('category');
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
    const renderedCategories = this.props.categories.map((category) => {
      // If the selected category from store is equal to thi category Item
      // the it means this category is the selected one
      // so we add '-selected' className to make it highlighted
      const isCategorySelected = this.props.selectedCategory === category;
      return (
        <li key={category} className="header__category">
          <Link
            to={`/products?category=${category}`}
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
            <ul className="header__categories">{renderedCategories}</ul>
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
            <button className="header__cart">
              <div className="header__cartIconContainer">
                <img loading="lazy" alt="Cart Icon" src={cart} />
                {/* <span className="header__cartBadge">2</span> */}
              </div>
            </button>
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
};

const mapStateToProps = (state) => ({
  categories: state.categories.categories,
  selectedCategory: state.categories.selectedCategory,
});

const mapDispatchToProps = {
  dispatchCategorySelected: categorySelected,
};

const Header = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HeaderComp)
);

export { Header };
