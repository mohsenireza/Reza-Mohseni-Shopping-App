import { Component } from 'react';
import './Products.scss';
import { ProductCard } from '../../components';

class Products extends Component {
  render() {
    return (
      <div className="products">
        <div className="container">
          <h2 className="products__categoryName">Category name</h2>
          <section className="products__productList">
            {[...new Array(5)].map((_, index) => (
              <div key={index} className="products__productWrapper">
                <ProductCard
                  isOutOfStock={index === 2}
                  name="Apollo Running Short"
                  price="$50.00"
                  image="https://5.imimg.com/data5/BA/TB/JT/ANDROID-6873479/product-jpeg-500x500.jpg"
                />
              </div>
            ))}
          </section>
        </div>
      </div>
    );
  }
}

export default Products;
