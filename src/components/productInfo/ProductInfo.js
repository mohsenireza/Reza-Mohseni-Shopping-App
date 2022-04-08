import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './ProductInfo.scss';
import { Attribute, Button, Counter } from '../index';
import {
  orderItemAdded,
  orderItemQuantityEdited,
  orderItemRemoved,
  selectOrderItemByProduct,
} from '../../features/cart/cartSlice';
import { selectSelectedCurrency } from '../../features/currencies/currenciesSlice';
import { jsonDeepClone } from '../../utils';

class ProductInfoComp extends Component {
  constructor(props) {
    super(props);

    // Save selected attribute items in this format:
    // selectedAttributes: [
    //   {id: 'Size', selectedItemId: '40'},
    //   {id: 'Color', selectedItemId: 'blue'}
    // ]
    this.state = {
      selectedAttributes: [],
    };

    // Bind methods
    this.initializeAttributes = this.initializeAttributes.bind(this);
    this.handleAttributeSelect = this.handleAttributeSelect.bind(this);
    this.getAttributeSelectedItemId =
      this.getAttributeSelectedItemId.bind(this);
    this.handleOrderItemAdd = this.handleOrderItemAdd.bind(this);
    this.handleOrderItemRemove = this.handleOrderItemRemove.bind(this);
    this.handleOrderItemQuantityEdit =
      this.handleOrderItemQuantityEdit.bind(this);
  }

  componentDidMount() {
    this.initializeAttributes();
  }

  componentDidUpdate() {
    this.props.onComponentDidUpdate();
  }

  // Initialize state.selectedAttributes
  initializeAttributes() {
    // If a product is out of stock, then attributes should not be selected
    if (!this.props.product.inStock) return;

    // For each attribute, select the first item as default
    const selectedAttributes = this.props.product.attributes.map(
      (attribute) => ({
        id: attribute.id,
        selectedItemId: attribute.items[0].id,
      })
    );

    // Set selectedAttributes in the state
    this.setState({ selectedAttributes });
  }

  handleAttributeSelect({ attributeId, attributeSelectedItemId }) {
    // Save selected attributes in the state
    const selectedAttributes = jsonDeepClone(this.state.selectedAttributes);
    const modifiedAttribute = selectedAttributes.find(
      (attribute) => attribute.id === attributeId
    );
    modifiedAttribute.selectedItemId = attributeSelectedItemId;
    this.setState({ selectedAttributes });
  }

  // Return selected item id for a specific attribute
  getAttributeSelectedItemId(attributeId) {
    const attribute = this.state.selectedAttributes.find(
      (attribute) => attribute.id === attributeId
    );
    if (attribute) return attribute.selectedItemId;
  }

  // Add the product to cart
  handleOrderItemAdd() {
    const { id, ...otherProps } = this.props.product;
    const orderItem = {
      productId: id,
      ...otherProps,
      selectedAttributes: this.state.selectedAttributes,
    };
    this.props.dispatchOrderItemAdded(orderItem);
  }

  handleOrderItemRemove() {
    const orderItem = this.props.selectOrderItemByProduct({
      productId: this.props.product.id,
      selectedAttributes: this.state.selectedAttributes,
    });
    this.props.dispatchOrderItemRemoved(orderItem.id);
  }

  handleOrderItemQuantityEdit(quantity) {
    const orderItem = this.props.selectOrderItemByProduct({
      productId: this.props.product.id,
      selectedAttributes: this.state.selectedAttributes,
    });
    this.props.dispatchOrderItemQuantityEdited({
      orderItemId: orderItem.id,
      quantity,
    });
  }

  render() {
    const {
      className,
      isVerbose,
      selectedCurrency,
      selectOrderItemByProduct,
      product: { id, name, brand, attributes, prices, description, inStock },
    } = this.props;

    // Select price based on the selected currency
    const price = prices.find(
      (price) => price.currency.label === selectedCurrency.label
    );

    // Check if the product is in the cart or not
    const orderItem = selectOrderItemByProduct({
      productId: id,
      selectedAttributes: this.state.selectedAttributes,
    });
    const isProductAddedToCard = Boolean(orderItem);

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
              count={orderItem.quantity}
              onCountChange={this.handleOrderItemQuantityEdit}
              onRemove={this.handleOrderItemRemove}
            />
          </>
        )}
        {inStock && !isProductAddedToCard ? (
          <Button
            className="productInfo__cartButton"
            title="ADD TO CART"
            onClick={this.handleOrderItemAdd}
          />
        ) : inStock && isProductAddedToCard ? (
          <Button
            theme="red"
            className="productInfo__cartButton"
            title="Remove From Cart"
            onClick={this.handleOrderItemRemove}
          />
        ) : (
          <span className="productInfo__outOfStock">OUT OF STOCK</span>
        )}
        {isVerbose && (
          <div
            data-testid="productInfoDescription"
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
  product: PropTypes.object.isRequired,
  isVerbose: PropTypes.bool,
  onComponentDidUpdate: PropTypes.func,
  selectedCurrency: PropTypes.object,
  selectOrderItemByProduct: PropTypes.func.isRequired,
  dispatchOrderItemAdded: PropTypes.func.isRequired,
  dispatchOrderItemQuantityEdited: PropTypes.func.isRequired,
  dispatchOrderItemRemoved: PropTypes.func.isRequired,
};

ProductInfoComp.defaultProps = {
  className: '',
  isVerbose: true,
  onComponentDidUpdate: () => {},
};

const mapStateToProps = (state) => ({
  selectedCurrency: selectSelectedCurrency(state),
  selectOrderItemByProduct: selectOrderItemByProduct.bind(this, state),
});

const mapDispatchToProps = {
  dispatchOrderItemAdded: orderItemAdded,
  dispatchOrderItemQuantityEdited: orderItemQuantityEdited,
  dispatchOrderItemRemoved: orderItemRemoved,
};

const ProductInfo = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductInfoComp);

export { ProductInfo };
