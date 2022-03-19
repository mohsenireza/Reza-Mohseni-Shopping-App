import { Component } from 'react';
import './Product.scss';
import { Button } from '../../components';

class Product extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="product">
        <div className="container">
          <main className="product__content">
            <section className="product__gallery">
              <aside className="product__gallerySmallImagesContainer">
                <figure className="product__gallerySmallImageContainer">
                  <img
                    className="product__gallerySmallImage"
                    src="image"
                    alt="image"
                  />
                </figure>
                <figure className="product__gallerySmallImageContainer">
                  <img
                    className="product__gallerySmallImage"
                    src="image"
                    alt="image"
                  />
                </figure>
                <figure className="product__gallerySmallImageContainer">
                  <img
                    className="product__gallerySmallImage"
                    src="image"
                    alt="image"
                  />
                </figure>
              </aside>
              <figure className="product__galleryMainImageContainer">
                <img
                  className="product__galleryMainImage"
                  src="image"
                  alt="image"
                />
              </figure>
            </section>
            <section className="product__infoContainer">
              <div className="product__info">
                <span className="product__name">Apollo</span>
                <span className="product__brand">Running Short</span>
                <span className="produc__attribute">ATTRIBUTE</span>
                <span className="product__priceTitle">PRICE:</span>
                <span className="product__price">$50.00</span>
                <Button
                  className="product__addToCartButton"
                  title="ADD TO CART"
                />
                <p className="product__description">
                  Description description description description description
                  description description description description description
                  description description description description
                </p>
              </div>
            </section>
          </main>
        </div>
      </div>
    );
  }
}

export default Product;
