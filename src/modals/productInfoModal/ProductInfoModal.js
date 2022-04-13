import { Component } from 'react';
import PropTypes from 'prop-types';
import './ProductInfoModal.scss';
import { ProductInfo } from '../../components';
import { FocusTrapper } from '../../utils';

class ProductInfoModal extends Component {
  constructor(props) {
    super(props);

    // Initialize focusTrapper
    const modalParent = document.getElementById(this.props.modalId);
    this.focusTrapper = new FocusTrapper(modalParent);
  }

  componentDidMount() {
    // Add focus trapper when component mounts
    this.focusTrapper.add();
  }

  componentWillUnmount() {
    // Delete the focus trapper when component unmounts
    this.focusTrapper.delete();
  }

  render() {
    const { product } = this.props;

    return (
      <ProductInfo
        product={product}
        className="productInfoModal"
        isVerbose={false}
        // Reset focus trapper when <ProductInfo /> rerenders and focusable elements change
        onComponentDidUpdate={this.focusTrapper.reset}
      />
    );
  }
}

ProductInfoModal.propTypes = {
  product: PropTypes.object.isRequired,
  modalId: PropTypes.string.isRequired,
};

export { ProductInfoModal };
