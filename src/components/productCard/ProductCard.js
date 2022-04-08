import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './ProductCard.scss';
import cartWithBackground from '../../assets/images/cartWithBackground.svg';
import { selectProductById } from '../../features/products/productsSlice';
import { modalController } from '../../utils';
import { ProductInfoModal } from '../../modals';
import { selectSelectedCurrency } from '../../features/currencies/currenciesSlice';

class ProductCardComp extends Component {
  constructor(props) {
    super(props);

    // Select the product from store based on its id
    this.product = this.props.selectProductById(this.props.productId);

    // Bind methods
    this.handleCartModalOpen = this.handleCartModalOpen.bind(this);
  }

  handleCartModalOpen() {
    modalController.openModal({
      modalId: 'productInfoModal',
      Component: ProductInfoModal,
      props: {
        product: this.product,
      },
      modalContainerClassName: '-productInfo',
    });
  }

  render() {
    const { id, name, brand, gallery, inStock, prices } = this.product;
    // Get price based on the selected currency
    const price = prices.find(
      (price) => price.currency.label === this.props.selectedCurrency.label
    );

    return (
      <article className={`productCard ${inStock ? '' : '-outOfStock'}`}>
        <div className="productCard__imageContainer">
          <Link to={`/product/${id}`} className="productCard__imageWrapper">
            <img
              className="productCard__image"
              alt={`${brand} - ${name}`}
              src={gallery.length && gallery[0]}
            />
            {!inStock && (
              <span className="productCard__outOfStock">OUT OF STOCK</span>
            )}
          </Link>
          {inStock && (
            <button
              className="productCard__addToCart"
              onClick={this.handleCartModalOpen}
            >
              <img
                alt="Add Product to Cart"
                src={cartWithBackground}
                className="productCard__addToCartImage"
                loading="lazy"
              />
            </button>
          )}
        </div>
        <Link className="productCard__name" to={`/product/${id}`}>
          {`${brand} ${name}`}
        </Link>
        <span className="productCard__price">
          {`${price.currency.symbol}${price.amount}`}
        </span>
      </article>
    );
  }
}

ProductCardComp.propTypes = {
  productId: PropTypes.string.isRequired,
  selectProductById: PropTypes.func.isRequired,
  selectedCurrency: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  selectProductById: selectProductById.bind(this, state),
  selectedCurrency: selectSelectedCurrency(state),
});

const ProductCard = connect(mapStateToProps)(ProductCardComp);

export { ProductCard };
