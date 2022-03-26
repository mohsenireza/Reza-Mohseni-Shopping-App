import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './Product.scss';
import { Attribute, Button, Counter } from '../../components';
import { withRouter } from '../../hoc';
import {
  fetchProduct,
  imageSelected,
} from '../../features/product/productSlice';
import {
  productAddedToCart,
  productEditedInCart,
  productRemovedFromCart,
  selectCartProductById,
} from '../../features/cart/cartSlice';

class ProductComp extends Component {
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
    this.handleImageClick = this.handleImageClick.bind(this);
    this.initializeAttributes = this.initializeAttributes.bind(this);
    this.handleAttributeSelect = this.handleAttributeSelect.bind(this);
    this.getAttributeSelectedItemId =
      this.getAttributeSelectedItemId.bind(this);
    this.handleCartProductAdd = this.handleCartProductAdd.bind(this);
    this.handleCartProductRemove = this.handleCartProductRemove.bind(this);
    this.handleCartProductEdit = this.handleCartProductEdit.bind(this);
  }

  // Fetch product data
  componentDidMount() {
    const productId = this.props.router.params.id;
    this.props
      .dispatchFetchProduct(productId)
      .unwrap()
      .then(this.initializeAttributes)
      .catch(() => {});
  }

  // Show the clicked image in the bigger image box
  handleImageClick(src) {
    this.props.dispatchImageSelected(src);
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

  handleCartProductEdit({ count, attributeId, attributeSelectedItemId }) {
    this.props.dispatchProductEditedInCart({
      productId: this.props.product.id,
      count,
      attributeId,
      attributeSelectedItemId,
    });
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

  render() {
    // TODO: handle loading
    const status = this.props.fetchProductStatus;
    if (status === 'idle' || status === 'loading')
      return <h1>Loading product...</h1>;

    const {
      selectedCurrency,
      selectedImage,
      product: {
        name,
        brand,
        attributes,
        prices,
        description,
        gallery,
        inStock,
      },
    } = this.props;

    // Select price based on the selected currency
    const price = prices.find(
      (price) => price.currency.label === selectedCurrency.label
    );

    // Check if the product is in the cart or not
    const correspondingCartProduct = this.props.selectCartProductById(
      this.props.product.id
    );
    const isProductAddedToCard = Boolean(correspondingCartProduct);

    return (
      <div className="product">
        <div className="container">
          <main className="product__content">
            <section className="product__gallery">
              {gallery.length > 1 && (
                <aside className="product__galleryImagesContainer">
                  {gallery.map((src) => (
                    <button
                      key={src}
                      className="product__galleryImageButton"
                      onClick={() => this.handleImageClick(src)}
                    >
                      <figure className="product__galleryImageContainer">
                        <img
                          className="product__galleryImage"
                          src={src}
                          alt={`${brand} - ${name}`}
                          loading="lazy"
                        />
                      </figure>
                    </button>
                  ))}
                </aside>
              )}
              <figure className="product__gallerySelectedImageContainer">
                <img
                  data-testid="productGallerySelectedImage"
                  className="product__gallerySelectedImage"
                  src={selectedImage}
                  alt={`${brand} - ${name}`}
                  loading="lazy"
                />
              </figure>
            </section>
            <section className="product__infoContainer">
              <div className="product__info">
                <span className="product__brand">{brand}</span>
                <span className="product__name">{name}</span>
                {attributes.map((attribute) => (
                  <Attribute
                    key={attribute.id}
                    {...attribute}
                    className="produc__attribute"
                    onAttributeSelect={this.handleAttributeSelect}
                    selectedItemId={this.getAttributeSelectedItemId(
                      attribute.id
                    )}
                    isDisabled={!inStock}
                  />
                ))}
                <span className="product__sectionTitle product__priceTitle">
                  PRICE:
                </span>
                <span className="product__price">{`${price.currency.symbol}${price.amount}`}</span>
                {isProductAddedToCard && (
                  <>
                    <span className="product__sectionTitle">Count:</span>
                    <Counter
                      className="product__count"
                      count={correspondingCartProduct.count}
                      onCountChange={(count) =>
                        this.handleCartProductEdit({ count })
                      }
                      onRemove={this.handleCartProductRemove}
                    />
                  </>
                )}
                {inStock && !isProductAddedToCard ? (
                  <Button
                    className="product__cartButton"
                    title="ADD TO CART"
                    onClick={this.handleCartProductAdd}
                  />
                ) : inStock && isProductAddedToCard ? (
                  <Button
                    theme="red"
                    className="product__cartButton"
                    title="Remove From Cart"
                    onClick={this.handleCartProductRemove}
                  />
                ) : (
                  <span className="product__outOfStock">OUT OF STOCK</span>
                )}
                <div
                  className="product__description"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>
            </section>
          </main>
        </div>
      </div>
    );
  }
}

ProductComp.propTypes = {
  router: PropTypes.object.isRequired,
  product: PropTypes.object,
  fetchProductStatus: PropTypes.string.isRequired,
  selectedCurrency: PropTypes.object,
  selectedImage: PropTypes.string,
  selectCartProductById: PropTypes.func.isRequired,
  dispatchFetchProduct: PropTypes.func.isRequired,
  dispatchImageSelected: PropTypes.func.isRequired,
  dispatchProductAddedToCart: PropTypes.func.isRequired,
  dispatchProductEditedInCart: PropTypes.func.isRequired,
  dispatchProductRemovedFromCart: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  product: state.product.product,
  fetchProductStatus: state.product.status,
  selectedCurrency: state.currencies.selectedCurrency,
  selectedImage: state.product.selectedImage,
  selectCartProductById: selectCartProductById.bind(this, state),
});

const mapDispatchToProps = {
  dispatchFetchProduct: fetchProduct,
  dispatchImageSelected: imageSelected,
  dispatchProductAddedToCart: productAddedToCart,
  dispatchProductEditedInCart: productEditedInCart,
  dispatchProductRemovedFromCart: productRemovedFromCart,
};

const Product = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProductComp)
);

export default Product;
