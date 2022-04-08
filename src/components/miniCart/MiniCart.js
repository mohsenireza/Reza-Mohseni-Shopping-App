import { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './MiniCart.scss';
import cartImage from '../../assets/images/cart.svg';
import { CartItem, DetectClickOutside, Button } from '../index';
import {
  selectOrderItemIds,
  selectTotalCartItemQuantity,
  selectTotalPrice,
} from '../../features/cart/cartSlice';
import { withBreakpoint, withRouter } from '../../hoc';
import { FocusTrapper } from '../../utils';

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
    this.handleEscapeKeyDown = this.handleEscapeKeyDown.bind(this);
  }

  componentDidMount() {
    // Initialize focusTrapper
    this.focusTrapper = new FocusTrapper(this.miniCartRef.current);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isOpen !== this.state.isOpen) {
      if (this.state.isOpen) {
        // Add focus trapper when the overlay gets opened
        this.focusTrapper.add();
        // Add event listener for handleEscapeKeyDown
        document.addEventListener('keydown', this.handleEscapeKeyDown);
      } else {
        // Delete focus trapper when the overlay gets closed
        this.focusTrapper.delete();
        // Remove event listener for handleEscapeKeyDown
        document.removeEventListener('keydown', this.handleEscapeKeyDown);
      }
    }

    // Reset the focus trapper if an orderItem gets removed and focusable elements inside <MiniCart />'s overlay change
    if (prevProps.orderItemIds.length !== this.props.orderItemIds.length) {
      if (this.state.isOpen) this.focusTrapper.reset();
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

  // Close <MiniCart />'s overlay when escape key is pressed
  handleEscapeKeyDown(e) {
    if (e.keyCode === 27) {
      this.handleToggle(false);
    }
  }

  render() {
    const { orderItemIds, totalCartItemQuantity, totalPrice } = this.props;

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
                  {orderItemIds.map((orderItemId) => (
                    <CartItem
                      key={orderItemId}
                      id={orderItemId}
                      onLinkClick={() => this.handleToggle(false)}
                    />
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
  orderItemIds: PropTypes.array.isRequired,
  totalCartItemQuantity: PropTypes.number.isRequired,
  totalPrice: PropTypes.string.isRequired,
  router: PropTypes.object.isRequired,
  breakpoint: PropTypes.string,
};

MiniCartComp.defaultProps = {
  orderItemIds: [],
};

const mapStateToProps = (state) => ({
  orderItemIds: selectOrderItemIds(state),
  totalCartItemQuantity: selectTotalCartItemQuantity(state),
  totalPrice: selectTotalPrice(state),
});

const MiniCart = withBreakpoint(
  withRouter(connect(mapStateToProps)(MiniCartComp))
);

export { MiniCart };
