import { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './ProductCard.scss';
import cartWithBackground from '../../assets/images/cartWithBackground.svg';

class ProductCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article
        tabIndex="0"
        className={`productCard ${
          this.props.isOutOfStock ? '-outOfStock' : ''
        }`}
      >
        <div className="productCard__imageContainer">
          <Link
            to={`/product/${this.props.id}`}
            className="productCard__imageWrapper"
          >
            <img
              className="productCard__image"
              loading="lazy"
              alt={`Product Image - ${this.props.name}`}
              src={this.props.image}
            />
          </Link>
          {this.props.isOutOfStock ? (
            <span className="productCard__outOfStock">OUT OF STOCK</span>
          ) : (
            <button className="productCard__addToCart">
              <img alt="Add Product to Cart" src={cartWithBackground} />
            </button>
          )}
        </div>
        <Link className="productCard__name" to={`/product/${this.props.id}`}>
          {this.props.name}
        </Link>
        <span tabIndex="0" className="productCard__price">
          {this.props.price}
        </span>
      </article>
    );
  }
}

ProductCard.propTypes = {
  id: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  isOutOfStock: PropTypes.bool.isRequired,
};

PropTypes.defaultProps = {
  isOutOfStock: false,
};

export { ProductCard };
