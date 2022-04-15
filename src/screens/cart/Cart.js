import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './Cart.scss';
import {
  selectOrderItemIds,
  selectTotalPrice,
} from '../../features/cart/cartSlice';
import { Button, CartItem } from '../../components';
import { domHelper } from '../../utils';

class CartComp extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    domHelper.resetWindowScroll();
  }

  render() {
    const { orderItemIds, totalPrice } = this.props;

    return (
      <div className="cart">
        <div className="cart__container container">
          {orderItemIds.length ? (
            // If cart is not empty
            <>
              <h1 className="cart__title">CART</h1>
              {orderItemIds.map((orderItemId) => (
                <CartItem key={orderItemId} id={orderItemId} size="big" />
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
  orderItemIds: PropTypes.array.isRequired,
  totalPrice: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  orderItemIds: selectOrderItemIds(state),
  totalPrice: selectTotalPrice(state),
});

const Cart = connect(mapStateToProps)(CartComp);

export default Cart;
