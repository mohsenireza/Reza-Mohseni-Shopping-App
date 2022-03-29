import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './ProductCard.scss';
import cartWithBackground from '../../assets/images/cartWithBackground.svg';
import { selectProductById } from '../../features/products/productsSlice';
import { modalController } from '../../utils';
import { ProductInfoModal } from '../../modals';

class ProductCardComp extends Component {
  constructor(props) {
    super(props);

    // Select the product from store based on its id
    this.product = this.props.selectProductById(this.props.productId);

    // Bind methods
    this.handleCartProductAdd = this.handleCartProductAdd.bind(this);
  }

  handleCartProductAdd() {
    modalController.openModal({
      modalId: 'productInfoModal',
      Component: ProductInfoModal,
      props: {
        productId: this.product.id,
      },
      modalContainerClassName: '-productInfo',
    });
  }

  render() {
    const { id, name, gallery, inStock, prices } = this.product;
    // Get price based on the selected currency
    const price = prices.find(
      (price) => price.currency.label === this.props.selectedCurrency.label
    );

    return (
      <article
        tabIndex="0"
        className={`productCard ${inStock ? '' : '-outOfStock'}`}
      >
        <div className="productCard__imageContainer">
          <Link to={`/product/${id}`} className="productCard__imageWrapper">
            <img
              className="productCard__image"
              loading="lazy"
              alt={name}
              src={gallery.length && gallery[0]}
            />
            {!inStock && (
              <span className="productCard__outOfStock">OUT OF STOCK</span>
            )}
          </Link>
          {inStock && (
            <button
              className="productCard__addToCart"
              onClick={this.handleCartProductAdd}
            >
              <img alt="Add Product to Cart" src={cartWithBackground} />
            </button>
          )}
        </div>
        <Link className="productCard__name" to={`/product/${id}`}>
          {name}
        </Link>
        <span tabIndex="0" className="productCard__price">
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
  selectedCurrency: state.currencies.selectedCurrency,
});

const ProductCard = connect(mapStateToProps)(ProductCardComp);

export { ProductCard };
