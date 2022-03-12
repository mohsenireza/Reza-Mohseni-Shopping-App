import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './Header.scss';
import logo from '../../assets/images/logo.svg';
import cart from '../../assets/images/cart.svg';
import { CurrencySwitcher } from '..';
import { history } from '../../config';
import { categorySelected } from '../../features/categories/categoriesSlice';

class HeaderComp extends Component {
  constructor(props) {
    super(props);

    // Bind methods
    this.handleOnCategorySelect = this.handleOnCategorySelect.bind(this);
    this.getDataFromUrl = this.getDataFromUrl.bind(this);
  }

  // Fill store with URL on startup and on every URL change
  componentDidMount() {
    this.getDataFromUrl();
    this.unlistenHistory = history.listen(this.getDataFromUrl);
  }

  componentWillUnmount() {
    this.unlistenHistory();
  }

  // Fill store with URL
  // Because we get store data from URL,
  // even after reloading, our app can hold its old state,
  // like selected category and currency
  getDataFromUrl() {
    const queryString = history.location.search;
    // TODO: support URLSearchParams in IE
    const selectedCategoryFromQueryString = new URLSearchParams(
      queryString
    ).get('category');
    const categories = this.props.categories;
    if (!categories.length) return;
    // If the category from URL exists in the store, we can use it as the selected category
    if (categories.includes(selectedCategoryFromQueryString)) {
      this.props.dispatchCategorySelected(selectedCategoryFromQueryString);
    }
    // Otherwise we select the first category Item in store as the selected category
    else {
      const defaultCategory = categories[0];
      this.props.dispatchCategorySelected(defaultCategory);
    }
  }

  handleOnCategorySelect(category) {
    history.push(`/products?category=${category}`);
  }

  render() {
    const renderedCategories = this.props.categories.map((category) => {
      // If the selected category from store is equal to thi category Item
      // the it means this category is the selected one
      // so we add '-selected' className to make it highlighted
      const isCategorySelected = this.props.selectedCategory === category;
      return (
        <li key={category} className="header__category">
          <button
            onClick={() => this.handleOnCategorySelect(category)}
            className={`header__categoryLink ${
              isCategorySelected ? '-selected' : ''
            }`}
          >
            {category}
          </button>
        </li>
      );
    });

    return (
      <header className="header">
        <div className="header__container container">
          <div className="header__column header__categoriesContainer">
            <ul className="header__categories">{renderedCategories}</ul>
          </div>
          <button
            onClick={() => history.push('/products')}
            className="header__column header__logoContainer"
          >
            <img alt="Logo" className="header__logo" src={logo} />
          </button>
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

HeaderComp.propTypes = {
  categories: PropTypes.array.isRequired,
  selectedCategory: PropTypes.string,
  dispatchCategorySelected: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  categories: state.categories.categories,
  selectedCategory: state.categories.selectedCategory,
});

const mapDispatchToProps = {
  dispatchCategorySelected: categorySelected,
};

const Header = connect(mapStateToProps, mapDispatchToProps)(HeaderComp);

export { Header };
