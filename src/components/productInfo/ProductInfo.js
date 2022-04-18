import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './ProductInfo.scss';
import { Attribute, Button, Counter } from '../index';
import {
  orderItemAdded,
  orderItemQuantityEdited,
  orderItemRemoved,
  selectOrderItemByProduct,
} from '../../features/cart/cartSlice';
import { selectSelectedCurrency } from '../../features/global/globalSlice';
import { getSearchParam, jsonDeepClone } from '../../utils';

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
    this.updateSelectedAttributes = this.updateSelectedAttributes.bind(this);
    this.handleAttributeSelect = this.handleAttributeSelect.bind(this);
    this.addAttributeToUrl = this.addAttributeToUrl.bind(this);
    this.getAttributeSelectedItemId =
      this.getAttributeSelectedItemId.bind(this);
    this.handleOrderItemAdd = this.handleOrderItemAdd.bind(this);
    this.handleOrderItemRemove = this.handleOrderItemRemove.bind(this);
    this.handleOrderItemQuantityEdit =
      this.handleOrderItemQuantityEdit.bind(this);
  }

  // Initialize state.selectedAttributes when component mounts
  componentDidMount() {
    this.updateSelectedAttributes();
  }

  componentDidUpdate(prevProps) {
    this.props.onComponentDidUpdate();

    // Update state.selectedAttributes when URL changes
    if (prevProps.location !== this.props.location) {
      this.props.shouldAddAttributesToUrl && this.updateSelectedAttributes();
    }
  }

  updateSelectedAttributes() {
    const { shouldAddAttributesToUrl, product } = this.props;
    // If a product is out of stock, then attributes should not be selected
    if (!product.inStock) return;
    const selectedAttributes = product.attributes.map((attribute) => {
      // Check if attributes are saved in URL and the attribute exists in the URL
      const attributeItemIdFromUrl = getSearchParam(attribute.id);
      if (shouldAddAttributesToUrl && attributeItemIdFromUrl) {
        const isAttributeItemIdFromUrlValid = attribute.items.some(
          (item) => item.id === attributeItemIdFromUrl
        );
        // If the attributeItemId from URL is valid, then get it as the selected attribute item
        if (isAttributeItemIdFromUrlValid) {
          return {
            id: attribute.id,
            selectedItemId: attributeItemIdFromUrl,
          };
        }
      }
      // If attributes are not saved in URL or
      // attribute doesn't exist in URL or
      // attributeSelectedItemId from URL is not valid,
      // then get the first attributeItem as the selected attribute item
      return {
        id: attribute.id,
        selectedItemId: attribute.items[0].id,
      };
    });
    // Set selectedAttributes in the state
    this.setState({ selectedAttributes });
  }

  handleAttributeSelect({ attributeId, attributeSelectedItemId }) {
    // If shouldAddAttributesToUrl is true, add the attribute to the URL
    // then state.selectedAttributes will be updated in componentDidUpdate
    if (this.props.shouldAddAttributesToUrl) {
      this.addAttributeToUrl({ attributeId, attributeSelectedItemId });
    }
    // If shouldAddAttributesToUrl is false, update the state directly from here
    else {
      const selectedAttributes = jsonDeepClone(this.state.selectedAttributes);
      const modifiedAttribute = selectedAttributes.find(
        (attribute) => attribute.id === attributeId
      );
      modifiedAttribute.selectedItemId = attributeSelectedItemId;
      this.setState({ selectedAttributes });
    }
  }

  addAttributeToUrl({ attributeId, attributeSelectedItemId }) {
    const { product, history } = this.props;
    const searchParams = [];
    // Loop through all product attributes to create a sorted searchParams array
    product.attributes.forEach((attribute) => {
      const attributeItemIdFromUrl = getSearchParam(attribute.id);
      // If the product attribute in the loop is the attribute that we are adding to the URL
      if (attribute.id === attributeId) {
        // And if the selected attribute item is not the first one in the array, push it to the searchParams array
        if (attribute.items[0].id !== attributeSelectedItemId) {
          searchParams.push(`${attribute.id}=${attributeSelectedItemId}`);
        }
        // Else If the attribute is already added to the URL, then push it to the searchParams array
      } else if (attributeItemIdFromUrl) {
        searchParams.push(`${attribute.id}=${attributeItemIdFromUrl}`);
      }
    });
    history.replace({ search: searchParams.join('&') });
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
            title="REMOVE FROM CART"
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
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  className: PropTypes.string,
  shouldAddAttributesToUrl: PropTypes.bool,
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
  shouldAddAttributesToUrl: false,
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

const ProductInfo = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProductInfoComp)
);

export { ProductInfo };
