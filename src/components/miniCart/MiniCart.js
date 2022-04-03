import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './MiniCart.scss';
import cartImage from '../../assets/images/cart.svg';
import { CartItem, DetectClickOutside, Button } from '../index';
import {
  selectCartProductIds,
  selectTotalCartItemQuantity,
  selectTotalPrice,
} from '../../features/cart/cartSlice';
import { withBreakpoint, withRouter } from '../../hoc';

class MiniCartComp extends Component {
  constructor(props) {
    super(props);

    // isOpen state defines whether the miniCart is open or closed
    this.state = { isOpen: false };

    // Bind methods
    this.handleToggle = this.handleToggle.bind(this);
    this.handleCartPageNavigate = this.handleCartPageNavigate.bind(this);
  }

  // Show and hide miniCart overlay
  handleToggle({ isOpen }) {
    // Update state
    this.setState({ isOpen });
    // Disable body's scroll when the overlay is open
    if (isOpen) document.body.style.overflow = 'hidden';
    // Enable body's scroll when the overlay is closed
    else document.body.style.overflow = 'auto';
  }

  handleCartPageNavigate() {
    // Navigate to /cart
    this.props.router.navigate('/cart');
    // Close miniCart
    this.handleToggle({ isOpen: false });
  }

  render() {
    // Don't render miniCart overlay in screens smaller than 'sm'
    const shouldRenderOverlay = !['xxxsm', 'xxsm', 'xsm', 'sm'].includes(
      this.props.breakpoint
    );
    const { cartProductIds, totalCartItemQuantity, totalPrice } = this.props;

    const renderedHeaderContent = (
      <div className="miniCart__iconContainer">
        <img loading="lazy" alt="Cart Icon" src={cartImage} />
        {totalCartItemQuantity > 0 && (
          <span className="miniCart__badge">{totalCartItemQuantity}</span>
        )}
      </div>
    );

    return (
      <div data-testid="miniCart" className="miniCart">
        {/* MiniCart header */}
        {shouldRenderOverlay ? (
          <button
            data-testid="miniCartHeader"
            className="miniCart__header"
            onMouseDown={() => {
              // DetectClickOutside's onclick and miniCart__header's onClick have interference
              // I used setTimeout(()=>{...}, 0), to run the operation on the next tick, and prevent the interference

              // When miniCart is open, miniCart__header's onClick should run first,
              // then DetectClickOutside's onclick should run second to have the final effect
              if (this.state.isOpen) {
                this.handleToggle({ isOpen: true });
              }
              // When miniCard is closed, DetectClickOutside's onclick should run first,
              // then miniCart__header's onClick should run second to have the final effect
              else {
                setTimeout(() => this.handleToggle({ isOpen: true }), 0);
              }
            }}
          >
            {renderedHeaderContent}
          </button>
        ) : (
          <Link to="/cart" className="miniCart__header">
            {renderedHeaderContent}
          </Link>
        )}
        {/* MiniCart content */}
        {shouldRenderOverlay && this.state.isOpen && (
          <section className="miniCart__overlay">
            <div className="miniCart__contentContainer container">
              <DetectClickOutside
                className="miniCart__content"
                onClickOutside={() => this.handleToggle({ isOpen: false })}
              >
                <h3 className="miniCart__title">
                  My Bag
                  <span className="miniCart__count">
                    , {totalCartItemQuantity} item
                    {totalCartItemQuantity > 1 ? 's' : ''}
                  </span>
                </h3>

                <div className="miniCart__cartItems">
                  {cartProductIds.map((cartProductId) => (
                    <CartItem key={cartProductId} id={cartProductId} />
                  ))}
                </div>

                <div className="miniCart__totalPriceContainer">
                  <span className="miniCart__totalPriceTitle">Total</span>
                  <span className="miniCart__totalPrice">{totalPrice}</span>
                </div>

                {totalCartItemQuantity > 0 && (
                  <div className="miniCart__buttons">
                    <Button
                      onClick={this.handleCartPageNavigate}
                      className="miniCart__button"
                      title="VIEW BAG"
                      theme="white"
                    />
                    <Button
                      className="miniCart__button"
                      title="CHECKOUT"
                      theme="green"
                    />
                  </div>
                )}
              </DetectClickOutside>
            </div>
          </section>
        )}
      </div>
    );
  }
}

MiniCartComp.propTypes = {
  cartProductIds: PropTypes.array.isRequired,
  totalCartItemQuantity: PropTypes.number.isRequired,
  totalPrice: PropTypes.string.isRequired,
  router: PropTypes.object.isRequired,
  breakpoint: PropTypes.string,
};

const mapStateToProps = (state) => ({
  cartProductIds: selectCartProductIds(state),
  totalCartItemQuantity: selectTotalCartItemQuantity(state),
  totalPrice: selectTotalPrice(state),
});

const MiniCart = withBreakpoint(
  withRouter(connect(mapStateToProps)(MiniCartComp))
);

export { MiniCart };
