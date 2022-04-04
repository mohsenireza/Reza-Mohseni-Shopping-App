import { Component } from 'react';
import PropTypes from 'prop-types';
import './ProductInfoModal.scss';
import { ProductInfo } from '../../components';

class ProductInfoModal extends Component {
  constructor(props) {
    super(props);
  }

  // Add focus trapper
  componentDidMount() {
    const { modalId, trapFocus } = this.props;
    const modalParent = document.getElementById(modalId);
    this.removeFocusTrapper = trapFocus(modalParent);
  }

  // Remove focus trapper
  componentWillUnmount() {
    this.removeFocusTrapper();
  }

  render() {
    const { product } = this.props;

    return (
      <ProductInfo
        product={product}
        className="productInfoModal"
        isVerbose={false}
      />
    );
  }
}

ProductInfoModal.propTypes = {
  product: PropTypes.object.isRequired,
  trapFocus: PropTypes.func.isRequired,
  modalId: PropTypes.string.isRequired,
};

export { ProductInfoModal };
