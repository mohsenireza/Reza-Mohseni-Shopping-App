import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './Products.scss';
import { PageWrapper, ProductCard } from '../../components';
import {
  fetchProducts,
  productsStateCleared,
  selectProductIds,
} from '../../features/products/productsSlice';
import {
  categorySelected,
  selectedCategoryCleared,
} from '../../features/categories/categoriesSlice';
import { getParameterByName } from '../../utils';
import { withRouter } from '../../hoc';

class ProductsComp extends Component {
  constructor(props) {
    super(props);

    // Bind methods
    this.getSelectedCategoryFromUrl =
      this.getSelectedCategoryFromUrl.bind(this);
  }

  componentDidMount() {
    // Get selectedCategory from URL when component mounts
    this.getSelectedCategoryFromUrl();
  }

  componentDidUpdate(prevProps) {
    // Get selectedCategory from URL when URL change
    if (prevProps.router.location !== this.props.router.location) {
      this.getSelectedCategoryFromUrl();
    }
    // Fetch products when category changes
    if (prevProps.selectedCategory !== this.props.selectedCategory) {
      this.props.dispatchFetchProducts();
    }
  }

  componentWillUnmount() {
    // Clear selectedCategory when leaving the page
    this.props.dispatchSelectedCategoryCleared();
    // Clear products state when leaving the page
    this.props.dispatchProductsStateCleared();
  }

  // Fill selectedCategory in store with URL
  // Because we get selectedCategory from URL,
  // even after reloading, our app can hold its old selectedCategory,
  getSelectedCategoryFromUrl() {
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
    const { fetchProductsStatus } = this.props;

    return (
      <PageWrapper
        loading={['idle', 'loading'].includes(fetchProductsStatus)}
        error={fetchProductsStatus === 'failed'}
      >
        <div className="products">
          <div className="container">
            <h2 className="products__categoryName">
              {this.props.selectedCategory}
            </h2>
            <section className="products__productList">
              {this.props.productIds.map((productId) => (
                <div key={productId} className="products__productWrapper">
                  <ProductCard productId={productId} />
                </div>
              ))}
            </section>
          </div>
        </div>
      </PageWrapper>
    );
  }
}

ProductsComp.propTypes = {
  router: PropTypes.object,
  categories: PropTypes.array.isRequired,
  selectedCategory: PropTypes.string,
  productIds: PropTypes.array.isRequired,
  fetchProductsStatus: PropTypes.string.isRequired,
  dispatchFetchProducts: PropTypes.func.isRequired,
  dispatchCategorySelected: PropTypes.func.isRequired,
  dispatchSelectedCategoryCleared: PropTypes.func.isRequired,
  dispatchProductsStateCleared: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  categories: state.categories.categories,
  selectedCategory: state.categories.selectedCategory,
  productIds: selectProductIds(state),
  fetchProductsStatus: state.products.status,
});

const mapDispatchToProps = {
  dispatchFetchProducts: fetchProducts,
  dispatchCategorySelected: categorySelected,
  dispatchSelectedCategoryCleared: selectedCategoryCleared,
  dispatchProductsStateCleared: productsStateCleared,
};

const Products = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProductsComp)
);

export default Products;
