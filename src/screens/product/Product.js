import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './Product.scss';
import { ProductInfo } from '../../components';
import { withRouter } from '../../hoc';
import {
  fetchProduct,
  imageSelected,
  productStateCleared,
} from '../../features/product/productSlice';

class ProductComp extends Component {
  constructor(props) {
    super(props);

    // Bind methods
    this.handleImageClick = this.handleImageClick.bind(this);
  }

  // Fetch product data
  componentDidMount() {
    const productId = this.props.router.params.id;
    this.props.dispatchFetchProduct(productId);
  }

  // Clear the product state
  componentWillUnmount() {
    this.props.dispatchProductStateCleared();
  }

  // Show the clicked image in the bigger image box
  handleImageClick(src) {
    this.props.dispatchImageSelected(src);
  }

  render() {
    // TODO: handle loading
    const status = this.props.fetchProductStatus;
    if (status === 'idle' || status === 'loading')
      return <h1>Loading product...</h1>;

    const {
      selectedImage,
      product: { name, brand, gallery },
    } = this.props;

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
              <ProductInfo className="product__productInfo" />
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
  selectedImage: PropTypes.string,
  dispatchFetchProduct: PropTypes.func.isRequired,
  dispatchImageSelected: PropTypes.func.isRequired,
  dispatchProductStateCleared: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  product: state.product.product,
  fetchProductStatus: state.product.status,
  selectedImage: state.product.selectedImage,
});

const mapDispatchToProps = {
  dispatchFetchProduct: fetchProduct,
  dispatchImageSelected: imageSelected,
  dispatchProductStateCleared: productStateCleared,
};

const Product = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProductComp)
);

export default Product;
