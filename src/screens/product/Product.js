import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './Product.scss';
import { PageWrapper, ProductInfo } from '../../components';
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
    this.fetchProduct = this.fetchProduct.bind(this);
  }

  // Fetch product data when component mounts
  componentDidMount() {
    window.scrollTo(0, 0);
    this.fetchProduct();
  }

  // Fetch product data when URL changes
  componentDidUpdate(prevProps) {
    if (prevProps.router.params.id !== this.props.router.params.id) {
      this.fetchProduct();
    }
  }

  // Clear the product state
  componentWillUnmount() {
    this.props.dispatchProductStateCleared();
  }

  // Fetch product's data based on the URL
  fetchProduct() {
    const productId = this.props.router.params.id;
    this.props.dispatchFetchProduct(productId);
  }

  // Show the clicked image in the bigger image box
  handleImageClick(src) {
    this.props.dispatchImageSelected(src);
  }

  render() {
    const { fetchProductStatus, selectedImage, product } = this.props;

    return (
      <PageWrapper
        loading={['idle', 'loading'].includes(fetchProductStatus)}
        error={fetchProductStatus === 'failed'}
      >
        <div className="product">
          <div className="container">
            <main className="product__content">
              <section className="product__gallery">
                {product?.gallery.length > 1 && (
                  <aside className="product__galleryImagesContainer">
                    {product?.gallery.map((src) => (
                      <button
                        key={src}
                        className="product__galleryImageButton"
                        onClick={() => this.handleImageClick(src)}
                      >
                        <figure className="product__galleryImageContainer">
                          <img
                            className="product__galleryImage"
                            src={src}
                            alt={`${product?.brand} - ${product?.name}`}
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
                    alt={`${product?.brand} - ${product?.name}`}
                  />
                </figure>
              </section>
              <section className="product__infoContainer">
                <ProductInfo
                  product={product}
                  className="product__productInfo"
                  shouldAddAttributesToUrl={true}
                />
              </section>
            </main>
          </div>
        </div>
      </PageWrapper>
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
