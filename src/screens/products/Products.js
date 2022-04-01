import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './Products.scss';
import { PageWrapper, ProductCard } from '../../components';
import {
  fetchProducts,
  selectProductIds,
} from '../../features/products/productsSlice';

class ProductsComp extends Component {
  constructor(props) {
    super(props);
  }

  // Fetch products on startup
  componentDidMount() {
    this.props.dispatchFetchProducts();
  }

  // Fetch products when category changes
  componentDidUpdate(prevProps) {
    if (prevProps.selectedCategory !== this.props.selectedCategory) {
      this.props.dispatchFetchProducts();
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
  selectedCategory: PropTypes.string,
  productIds: PropTypes.array.isRequired,
  fetchProductsStatus: PropTypes.string.isRequired,
  dispatchFetchProducts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  selectedCategory: state.categories.selectedCategory,
  productIds: selectProductIds(state),
  fetchProductsStatus: state.products.status,
});

const mapDispatchToProps = {
  dispatchFetchProducts: fetchProducts,
};

const Products = connect(mapStateToProps, mapDispatchToProps)(ProductsComp);

export default Products;
