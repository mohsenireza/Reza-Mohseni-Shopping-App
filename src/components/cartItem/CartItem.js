import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './CartItem.scss';
import { Attribute, Counter } from '../index';
import {
  productEditedInCart,
  productRemovedFromCart,
  selectCartProductById,
} from '../../features/cart/cartSlice';
import { selectSelectedCurrency } from '../../features/currencies/currenciesSlice';

class CartItemComp extends Component {
  constructor(props) {
    super(props);

    // selectedImageIndex determines which image to show
    this.state = {
      selectedImageIndex: 0,
    };

    // Bind methods
    this.handleCartProductRemove = this.handleCartProductRemove.bind(this);
    this.handleCountChange = this.handleCountChange.bind(this);
  }

  handleCartProductRemove() {
    this.props.dispatchProductRemovedFromCart(this.props.id);
  }

  handleCountChange(count) {
    this.props.dispatchProductEditedInCart({
      productId: this.props.id,
      count,
    });
  }

  render() {
    const { id, selectCartProductById, selectedCurrency, size } = this.props;

    const {
      brand,
      name,
      prices,
      attributes,
      selectedAttributes,
      count,
      gallery,
    } = selectCartProductById(id);

    // Select price based on the selected currency
    const price = prices.find(
      (price) => price.currency.label === selectedCurrency.label
    );

    // Determine which image to show
    const selectedImage =
      gallery.length && gallery[this.state.selectedImageIndex];

    return (
      <article className={`cartItem -${size}`}>
        <div className="cartItem__infoContainer">
          <Link to={`/product/${id}`} className="cartItem__brand">
            {brand}
          </Link>
          <Link to={`/product/${id}`} className="cartItem__name">
            {name}
          </Link>
          <span className="cartItem__price">{`${price.currency.symbol}${price.amount}`}</span>
          {attributes.map((attribute) => (
            <Attribute
              key={attribute.id}
              className="cartItem__attribute"
              selectedTextAttributeItemTheme={size === 'big' ? 'dark' : 'light'}
              size={size}
              hasAttributeName={false}
              hasTooltip={false}
              {...attribute}
              selectedItemId={selectedAttributes[attribute.id]}
              isDisabled={true}
              shouldFadeWhenDisabled={false}
            />
          ))}
        </div>
        <div className="cartItem__imageAndCounterContainer">
          <Counter
            alignment="vertical"
            size={size}
            count={count}
            onCountChange={this.handleCountChange}
            onRemove={this.handleCartProductRemove}
          />
          <figure className="cartItem__imageContainer">
            <img className="cartItem__image" src={selectedImage} />
          </figure>
        </div>
      </article>
    );
  }
}

CartItemComp.propTypes = {
  id: PropTypes.string.isRequired,
  selectCartProductById: PropTypes.func.isRequired,
  selectedCurrency: PropTypes.object,
  size: PropTypes.oneOf(['small', 'big']),
  dispatchProductRemovedFromCart: PropTypes.func.isRequired,
  dispatchProductEditedInCart: PropTypes.func.isRequired,
};

CartItemComp.defaultProps = {
  size: 'small',
};

const mapStateToProps = (state) => ({
  selectCartProductById: selectCartProductById.bind(this, state),
  selectedCurrency: selectSelectedCurrency(state),
});

const mapDispatchToProps = {
  dispatchProductRemovedFromCart: productRemovedFromCart,
  dispatchProductEditedInCart: productEditedInCart,
};

const CartItem = connect(mapStateToProps, mapDispatchToProps)(CartItemComp);

export { CartItem };
