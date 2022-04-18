import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './CartItem.scss';
import { Attribute, Counter } from '../index';
import {
  orderItemRemoved,
  orderItemQuantityEdited,
  selectOrderItemById,
} from '../../features/cart/cartSlice';
import { selectSelectedCurrency } from '../../features/global/globalSlice';
import arrowLeft from '../../assets/images/arrowLeft.svg';
import arrowRight from '../../assets/images/arrowRight.svg';

class CartItemComp extends Component {
  constructor(props) {
    super(props);

    // selectedImageIndex determines which image to show
    this.state = {
      selectedImageIndex: 0,
    };

    // Bind methods
    this.handleOrderItemRemove = this.handleOrderItemRemove.bind(this);
    this.handleOrderItemQuantityEdit =
      this.handleOrderItemQuantityEdit.bind(this);
    this.handleImageShowNext = this.handleImageShowNext.bind(this);
    this.handleImageShowPrev = this.handleImageShowPrev.bind(this);
  }

  handleOrderItemRemove() {
    this.props.dispatchOrderItemRemoved(this.props.id);
  }

  handleOrderItemQuantityEdit(quantity) {
    this.props.dispatchOrderItemQuantityEdited({
      orderItemId: this.props.id,
      quantity,
    });
  }

  // Change selected image
  handleImageShowNext() {
    const { id, selectOrderItemById } = this.props;
    const { gallery } = selectOrderItemById(id);
    const lastImageIndex = gallery.length - 1;
    const { selectedImageIndex } = this.state;
    // Show the first image
    if (selectedImageIndex + 1 > lastImageIndex) {
      this.setState({ selectedImageIndex: 0 });
    }
    // Show the next image
    else {
      this.setState((state) => ({
        selectedImageIndex: state.selectedImageIndex + 1,
      }));
    }
  }

  // Change selected image
  handleImageShowPrev() {
    const { id, selectOrderItemById } = this.props;
    const { gallery } = selectOrderItemById(id);
    const lastImageIndex = gallery.length - 1;
    const { selectedImageIndex } = this.state;
    // Show the last image
    if (selectedImageIndex - 1 < 0) {
      this.setState({ selectedImageIndex: lastImageIndex });
    }
    // Show the prev image
    else {
      this.setState((state) => ({
        selectedImageIndex: state.selectedImageIndex - 1,
      }));
    }
  }

  render() {
    const { id, selectOrderItemById, selectedCurrency, size } = this.props;

    const {
      productId,
      brand,
      name,
      prices,
      attributes,
      selectedAttributes,
      quantity,
      gallery,
    } = selectOrderItemById(id);

    // Select price based on the selected currency
    const price = prices.find(
      (price) => price.currency.label === selectedCurrency.label
    );

    // Determine which image to show
    const selectedImage =
      gallery.length && gallery[this.state.selectedImageIndex];

    // Generate a link to corresponding product page with selected attributes
    const searchParams = [];
    selectedAttributes.forEach((selectedAttribute) => {
      // If selected attribute item is not the first item in array, then add it to searchParams array
      const attribute = attributes.find(
        (attribute) => attribute.id === selectedAttribute.id
      );
      if (attribute.items[0].id !== selectedAttribute.selectedItemId) {
        searchParams.push(
          `${selectedAttribute.id}=${selectedAttribute.selectedItemId}`
        );
      }
    });
    let linkToProductPage = `/product/${productId}`;
    const search = searchParams.join('&');
    if (search) linkToProductPage += `?${search}`;

    return (
      <article className={`cartItem -${size}`}>
        <div className="cartItem__infoContainer">
          <Link
            to={linkToProductPage}
            onClick={this.props.onLinkClick}
            className="cartItem__brand"
          >
            {brand}
          </Link>
          <Link
            to={linkToProductPage}
            onClick={this.props.onLinkClick}
            className="cartItem__name"
          >
            {name}
          </Link>
          <span className="cartItem__price">{`${price.currency.symbol}${price.amount}`}</span>
          {attributes.map((attribute) => (
            <div
              key={attribute.id}
              tabIndex="0"
              className="cartItem__attributeContainer"
            >
              <Attribute
                className="cartItem__attribute"
                selectedTextAttributeItemTheme={
                  size === 'big' ? 'dark' : 'light'
                }
                size={size}
                hasAttributeName={false}
                hasTooltip={false}
                {...attribute}
                selectedItemId={
                  selectedAttributes.find(
                    (selectedAttribute) => selectedAttribute.id === attribute.id
                  ).selectedItemId
                }
                isDisabled={true}
                shouldFadeWhenDisabled={false}
              />
              <span className="cartItem__attributeTooltip">
                {attribute.name}
              </span>
            </div>
          ))}
        </div>
        <div className="cartItem__imageAndCounterContainer">
          <Counter
            alignment="vertical"
            size={size}
            count={quantity}
            onCountChange={this.handleOrderItemQuantityEdit}
            onRemove={this.handleOrderItemRemove}
          />
          <figure className="cartItem__imageContainer">
            {size === 'small' ? (
              <Link
                to={linkToProductPage}
                onClick={this.props.onLinkClick}
                className="cartItem__imageLink"
              >
                <img
                  className="cartItem__image"
                  src={selectedImage}
                  alt={`${brand} - ${name}`}
                />
              </Link>
            ) : (
              <img
                className="cartItem__image"
                src={selectedImage}
                key={selectedImage}
                alt={`${brand} - ${name}`}
              />
            )}
            {size === 'big' && gallery.length > 1 && (
              <>
                <button
                  onClick={this.handleImageShowPrev}
                  className="cartItem__arrowButton -prev"
                >
                  <div className="cartItem__arrowContainer">
                    <img
                      src={arrowLeft}
                      alt="Prev Image"
                      className="cartItem__arrow"
                      loading="lazy"
                    />
                  </div>
                </button>
                <button
                  onClick={this.handleImageShowNext}
                  className="cartItem__arrowButton -next"
                >
                  <div className="cartItem__arrowContainer">
                    <img
                      src={arrowRight}
                      alt="Next Image"
                      className="cartItem__arrow"
                      loading="lazy"
                    />
                  </div>
                </button>
              </>
            )}
          </figure>
        </div>
      </article>
    );
  }
}

CartItemComp.propTypes = {
  id: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'big']),
  onLinkClick: PropTypes.func,
  selectOrderItemById: PropTypes.func.isRequired,
  selectedCurrency: PropTypes.object,
  dispatchOrderItemRemoved: PropTypes.func.isRequired,
  dispatchOrderItemQuantityEdited: PropTypes.func.isRequired,
};

CartItemComp.defaultProps = {
  size: 'small',
  onLinkClick: () => {},
};

const mapStateToProps = (state) => ({
  selectOrderItemById: selectOrderItemById.bind(this, state),
  selectedCurrency: selectSelectedCurrency(state),
});

const mapDispatchToProps = {
  dispatchOrderItemRemoved: orderItemRemoved,
  dispatchOrderItemQuantityEdited: orderItemQuantityEdited,
};

const CartItem = connect(mapStateToProps, mapDispatchToProps)(CartItemComp);

export { CartItem };
