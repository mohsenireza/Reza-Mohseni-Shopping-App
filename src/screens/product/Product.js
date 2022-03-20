import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './Product.scss';
import { Attribute, Button } from '../../components';
import { withRouter } from '../../hoc';
import {
  fetchProduct,
  imageSelected,
} from '../../features/product/productSlice';

class ProductComp extends Component {
  constructor(props) {
    super(props);

    // Bind methods
    this.handleOnImageClick = this.handleOnImageClick.bind(this);
  }

  // Fetch product data
  componentDidMount() {
    const productId = this.props.router.params.id;
    this.props.dispatchFetchProduct(productId);
  }

  // Show the clicked image in the bigger image box
  handleOnImageClick(src) {
    this.props.dispatchImageSelected(src);
  }

  render() {
    // TODO: handle loading
    if (!this.props.product) return null;

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
                      onClick={() => this.handleOnImageClick(src)}
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
                    isDisabled={!inStock}
                  />
                ))}
                <span className="product__priceTitle">PRICE:</span>
                <span className="product__price">{`${price.currency.symbol}${price.amount}`}</span>
                {inStock ? (
                  <Button
                    className="product__addToCartButton"
                    title="ADD TO CART"
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
  selectedCurrency: PropTypes.object.isRequired,
  selectedImage: PropTypes.string,
  dispatchFetchProduct: PropTypes.func.isRequired,
  dispatchImageSelected: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  product: state.product.product,
  selectedCurrency: state.currencies.selectedCurrency,
  selectedImage: state.product.selectedImage,
});

const mapDispatchToProps = {
  dispatchFetchProduct: fetchProduct,
  dispatchImageSelected: imageSelected,
};

const Product = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProductComp)
);

export default Product;
