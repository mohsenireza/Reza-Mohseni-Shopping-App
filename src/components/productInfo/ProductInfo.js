import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './ProductInfo.scss';
import { Attribute, Button, Counter } from '../index';
import {
  productAddedToCart,
  productEditedInCart,
  productRemovedFromCart,
  selectCartProductById,
} from '../../features/cart/cartSlice';

class ProductInfoComp extends Component {
  constructor(props) {
    super(props);

    // Save selected attribute items in this format:
    // selectedAttributes: {
    //   [attribute.id]: attributeItem.id
    // }
    this.state = {
      selectedAttributes: {},
    };

    // Bind methods
    this.initializeAttributes = this.initializeAttributes.bind(this);
    this.handleAttributeSelect = this.handleAttributeSelect.bind(this);
    this.getAttributeSelectedItemId =
      this.getAttributeSelectedItemId.bind(this);
    this.handleCartProductAdd = this.handleCartProductAdd.bind(this);
    this.handleCartProductRemove = this.handleCartProductRemove.bind(this);
    this.handleCartProductEdit = this.handleCartProductEdit.bind(this);
  }

  componentDidMount() {
    this.initializeAttributes();
  }

  // Initialize state.selectedAttributes
  initializeAttributes() {
    // If a product is out of stock, then attributes should not be selected
    if (!this.props.product.inStock) return;
    // Check if the product is added to cart
    const correspondingCartProduct = this.props.selectCartProductById(
      this.props.product.id
    );
    let selectedAttributes = {};

    // If the product is already added to cart, then get initial attributes from there
    if (correspondingCartProduct) {
      selectedAttributes = correspondingCartProduct.selectedAttributes;
    }
    // If the product is not added to cart, then for each attribute, select the first item as default
    else {
      this.props.product.attributes.forEach((attribute) => {
        selectedAttributes[attribute.id] = attribute.items[0].id;
      });
    }

    // Set selectedAttributes in the state
    this.setState((state) => ({
      ...state,
      selectedAttributes,
    }));
  }

  handleAttributeSelect({ attributeId, attributeSelectedItemId }) {
    // Save selected attributes in the state
    this.setState((state) => ({
      ...state,
      selectedAttributes: {
        ...state.selectedAttributes,
        [attributeId]: attributeSelectedItemId,
      },
    }));
    // If the product is in cart, then update the cart;
    const correspondingCartProduct = this.props.selectCartProductById(
      this.props.product.id
    );
    const isProductAddedToCard = Boolean(correspondingCartProduct);
    if (isProductAddedToCard) {
      this.handleCartProductEdit({ attributeId, attributeSelectedItemId });
    }
  }

  // Return selected item id for a specific attribute
  getAttributeSelectedItemId(attributeId) {
    return this.state.selectedAttributes[attributeId];
  }

  // Add the product to cart
  handleCartProductAdd() {
    const product = {
      ...this.props.product,
      selectedAttributes: this.state.selectedAttributes,
      count: 1,
    };
    this.props.dispatchProductAddedToCart(product);
  }

  handleCartProductRemove() {
    this.props.dispatchProductRemovedFromCart(this.props.product.id);
  }

  handleCartProductEdit({ count, attributeId, attributeSelectedItemId }) {
    this.props.dispatchProductEditedInCart({
      productId: this.props.product.id,
      count,
      attributeId,
      attributeSelectedItemId,
    });
  }

  render() {
    const {
      className,
      isVerbose,
      selectedCurrency,
      selectCartProductById,
      product: { id, name, brand, attributes, prices, description, inStock },
    } = this.props;

    // Select price based on the selected currency
    const price = prices.find(
      (price) => price.currency.label === selectedCurrency.label
    );

    // Check if the product is in the cart or not
    const correspondingCartProduct = selectCartProductById(id);
    const isProductAddedToCard = Boolean(correspondingCartProduct);

    return (
      <div className={`productInfo ${className}`}>
        <span className="productInfo__brand">{brand}</span>
        <span className="productInfo__name">{name}</span>
        {attributes.map((attribute) => (
          <Attribute
            key={attribute.id}
            {...attribute}
            className="productInfo__attribute"
            onAttributeSelect={this.handleAttributeSelect}
            selectedItemId={this.getAttributeSelectedItemId(attribute.id)}
            isDisabled={!inStock}
          />
        ))}
        <span className="productInfo__sectionTitle productInfo__priceTitle">
          PRICE:
        </span>
        <span className="productInfo__price">{`${price.currency.symbol}${price.amount}`}</span>
        {isProductAddedToCard && (
          <>
            <span className="productInfo__sectionTitle">Count:</span>
            <Counter
              className="productInfo__count"
              count={correspondingCartProduct.count}
              onCountChange={(count) => this.handleCartProductEdit({ count })}
              onRemove={this.handleCartProductRemove}
            />
          </>
        )}
        {inStock && !isProductAddedToCard ? (
          <Button
            className="productInfo__cartButton"
            title="ADD TO CART"
            onClick={this.handleCartProductAdd}
          />
        ) : inStock && isProductAddedToCard ? (
          <Button
            theme="red"
            className="productInfo__cartButton"
            title="Remove From Cart"
            onClick={this.handleCartProductRemove}
          />
        ) : (
          <span className="productInfo__outOfStock">OUT OF STOCK</span>
        )}
        {isVerbose && (
          <div
            className="productInfo__description"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </div>
    );
  }
}

ProductInfoComp.propTypes = {
  className: PropTypes.string,
  product: PropTypes.object,
  isVerbose: PropTypes.bool,
  selectedCurrency: PropTypes.object,
  selectCartProductById: PropTypes.func.isRequired,
  dispatchProductAddedToCart: PropTypes.func.isRequired,
  dispatchProductEditedInCart: PropTypes.func.isRequired,
  dispatchProductRemovedFromCart: PropTypes.func.isRequired,
};

ProductInfoComp.defaultProps = {
  className: '',
  isVerbose: true,
};

const mapStateToProps = (state) => ({
  product: state.product.product,
  selectedCurrency: state.currencies.selectedCurrency,
  selectCartProductById: selectCartProductById.bind(this, state),
});

const mapDispatchToProps = {
  dispatchProductAddedToCart: productAddedToCart,
  dispatchProductEditedInCart: productEditedInCart,
  dispatchProductRemovedFromCart: productRemovedFromCart,
};

const ProductInfo = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductInfoComp);

export { ProductInfo };
