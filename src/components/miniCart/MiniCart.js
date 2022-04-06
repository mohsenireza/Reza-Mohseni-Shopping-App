import { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './MiniCart.scss';
import cartImage from '../../assets/images/cart.svg';
import { CartItem, DetectClickOutside, Button } from '../index';
import {
  selectCartProductIds,
  selectTotalCartItemQuantity,
  selectTotalPrice,
} from '../../features/cart/cartSlice';
import { withBreakpoint, withRouter } from '../../hoc';
import { domHelper } from '../../utils';

class MiniCartComp extends Component {
  constructor(props) {
    super(props);

    // isOpen state defines whether the miniCart is open or closed
    // overlayTop defines the minicard's overlay top
    this.state = { isOpen: false, overlayTop: 0 };

    // Refs
    this.miniCartRef = createRef();

    // Bind methods
    this.handleToggle = this.handleToggle.bind(this);
    this.handleCartPageNavigate = this.handleCartPageNavigate.bind(this);
    this.handleMiniCartHeaderClick = this.handleMiniCartHeaderClick.bind(this);
    this.addFocusTrapper = this.addFocusTrapper.bind(this);
    this.deleteFocusTrapper = this.deleteFocusTrapper.bind(this);
    this.resetFocusTrapper = this.resetFocusTrapper.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // Add or delete focus trapper when the miniCart gets closed or opened
    if (prevState.isOpen !== this.state.isOpen) {
      if (this.state.isOpen) this.addFocusTrapper();
      else this.deleteFocusTrapper();
    }

    // Reset the focus trapper if a cartProduct gets removed and focusable elements inside <MiniCart />'s overlay change
    if (prevProps.cartProductIds.length != this.props.cartProductIds.length) {
      if (this.state.isOpen) this.resetFocusTrapper();
    }

    // If <MiniCart />'s overlay is open, and viewport's width gets smaller up to a certain point
    // then call this.handleToggle(false). it will set this.state.isOpen to false and closes the overlay
    // in this case componentDidUpdate will run again, and focus trapper will be deleted
    if (prevProps.breakpoint !== this.props.breakpoint) {
      const prevShouldRenderOverlay = !['xxxsm', 'xxsm', 'xsm', 'sm'].includes(
        prevProps.breakpoint
      );
      const shouldRenderOverlay = !['xxxsm', 'xxsm', 'xsm', 'sm'].includes(
        this.props.breakpoint
      );
      if (prevShouldRenderOverlay === true && shouldRenderOverlay === false) {
        if (this.state.isOpen) this.handleToggle(false);
      }
    }
  }

  // Show and hide miniCart overlay
  handleToggle(shouldOpen) {
    if (shouldOpen) {
      // Disable body's scroll when the overlay is open
      document.body.style.overflow = 'hidden';
      // Calculate the overlay's top
      const headerElement = document.getElementById('header');
      const { bottom: headerBottomToViewportDistance } =
        headerElement.getBoundingClientRect();
      const overlayTop =
        headerBottomToViewportDistance < 0 ? 0 : headerBottomToViewportDistance;
      // Update state
      this.setState({ isOpen: true, overlayTop });
    } else {
      // Enable body's scroll when the overlay is closed
      document.body.style.overflow = 'auto';
      // Update state
      this.setState({ isOpen: false, overlayTop: 0 });
    }
  }

  handleCartPageNavigate() {
    // Navigate to /cart
    this.props.router.navigate('/cart');
    // Close miniCart
    this.handleToggle(false);
  }

  handleMiniCartHeaderClick(e) {
    // Don't render miniCart overlay in screens smaller than 'sm'
    const shouldRenderOverlay = !['xxxsm', 'xxsm', 'xsm', 'sm'].includes(
      this.props.breakpoint
    );
    if (shouldRenderOverlay) {
      // Prevent <DetectClickOutside /> to get the click event and close the overlay after opening it
      e.stopPropagation();
      this.handleToggle(!this.state.isOpen);
    } else {
      // Navigate to /cart
      this.props.router.navigate('/cart');
    }
  }

  // Add focus trapper
  addFocusTrapper({ isResetting = false } = {}) {
    const miniCartElement = this.miniCartRef.current;
    // Calculate elementToRevertFocusTo just once
    if (!isResetting) {
      this.elementToRevertFocusTo = document.activeElement;
    }
    this.untrapFocus = domHelper.trapFocus({
      elementToTrapFocusIn: miniCartElement,
      elementToRevertFocusTo: this.elementToRevertFocusTo,
      startFocusingFrom: isResetting ? document.activeElement : null,
    });
  }

  // Delete focus trapper
  deleteFocusTrapper({ isResetting = false } = {}) {
    if (!this.untrapFocus) return;
    this.untrapFocus({ shouldRevertFocusedElement: !isResetting });
    this.untrapFocus = null;
    if (!isResetting) this.elementToRevertFocusTo = null;
  }

  // Reset focus trapper when <MiniCart />'s overlay rerenders and focusable elements change
  resetFocusTrapper() {
    this.deleteFocusTrapper({ isResetting: true });
    this.addFocusTrapper({ isResetting: true });
  }

  render() {
    const { cartProductIds, totalCartItemQuantity, totalPrice } = this.props;

    const renderedHeaderContent = (
      <div className="miniCart__iconContainer">
        <img
          loading="lazy"
          alt="Cart Icon"
          src={cartImage}
          className="miniCart__icon"
        />
        {totalCartItemQuantity > 0 && (
          <span className="miniCart__badge">{totalCartItemQuantity}</span>
        )}
      </div>
    );

    return (
      <div data-testid="miniCart" ref={this.miniCartRef} className="miniCart">
        {/* MiniCart header */}
        <button
          data-testid="miniCartHeader"
          className="miniCart__header"
          onClick={this.handleMiniCartHeaderClick}
        >
          {renderedHeaderContent}
        </button>
        {/* MiniCart content */}
        {this.state.isOpen && (
          <section
            data-testid="miniCartOverlay"
            className="miniCart__overlay"
            style={{ top: this.state.overlayTop }}
          >
            <div className="miniCart__contentContainer container">
              <DetectClickOutside
                className="miniCart__content"
                onClickOutside={() => this.handleToggle(false)}
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

MiniCartComp.defaultProps = {
  cartProductIds: [],
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
