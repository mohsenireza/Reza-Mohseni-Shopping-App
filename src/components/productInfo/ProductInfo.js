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
import { withRouter } from '../../hoc';
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
    if (prevProps.router.location !== this.props.router.location) {
      this.props.shouldAddAttributesToUrl && this.updateSelectedAttributes();
    }
  }

  updateSelectedAttributes() {
    const {
      shouldAddAttributesToUrl,
      product,
      router: { searchParams },
    } = this.props;

    // If a product is out of stock, then attributes should not be selected
    if (!product.inStock) return;

    const selectedAttributes = product.attributes.map((attribute) => {
      // Check if attributes are saved in URL and the attribute exists in the URL
      if (shouldAddAttributesToUrl && searchParams.has(attribute.id)) {
        const attributeItemIdFromUrl = searchParams.get(attribute.id);
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
    const {
      product,
      router: { searchParams, setSearchParams },
    } = this.props;

    searchParams.set(attributeId, attributeSelectedItemId);

    // Sort search params
    let sortedSearchParams = [];
    [...searchParams.entries()].forEach(([key, value]) => {
      // Remove items from the searchParams object, to make it clear,
      // and fill it with sorted search params after the loop
      searchParams.delete(key);
      const attributeIndex = product.attributes.findIndex(
        (attribute) => attribute.id === key
      );
      const attribute = product.attributes.find(
        (attribute) => attribute.id === key
      );
      // If the first attributeItem is selected, don't add it to URL
      if (attribute.items[0].id === value) return;
      sortedSearchParams[attributeIndex] = { key, value };
    });

    // Remove empty array items
    sortedSearchParams = sortedSearchParams.filter(Boolean);

    // Add sortedSearchParams to the searchParams object
    sortedSearchParams.forEach((searchParam) => {
      searchParams.set(searchParam.key, searchParam.value);
    });

    // Change the URL's search params
    setSearchParams(searchParams, { replace: true });
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
  router: PropTypes.object.isRequired,
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
