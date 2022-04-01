import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './Cart.scss';
import {
  selectCartProductIds,
  selectTotalPrice,
} from '../../features/cart/cartSlice';
import { Button, CartItem } from '../../components';

class CartComp extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { cartProductIds, totalPrice } = this.props;

    return (
      <div className="cart">
        <div className="cart__container container">
          {cartProductIds.length ? (
            // If cart is not empty
            <>
              <h1 className="cart__title">CART</h1>
              {cartProductIds.map((cartProductId) => (
                <CartItem key={cartProductId} id={cartProductId} size="big" />
              ))}
              <div className="cart__totalPriceContainer">
                <span className="cart__totalPriceTitle">Total</span>
                <span className="cart__totalPrice">{totalPrice}</span>
              </div>
              <Button
                className="cart__checkoutButton"
                title="CHECKOUT"
                theme="green"
              />
            </>
          ) : (
            // If cart is empty
            <h1 className="cart__emptyMessage">CART IS EMPTY</h1>
          )}
        </div>
      </div>
    );
  }
}

CartComp.propTypes = {
  cartProductIds: PropTypes.array.isRequired,
  totalPrice: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  cartProductIds: selectCartProductIds(state),
  totalPrice: selectTotalPrice(state),
});

const Cart = connect(mapStateToProps)(CartComp);

export default Cart;
