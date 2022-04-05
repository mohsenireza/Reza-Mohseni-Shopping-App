import { Component } from 'react';
import PropTypes from 'prop-types';
import './ProductInfoModal.scss';
import { ProductInfo } from '../../components';
import { domHelper } from '../../utils';

class ProductInfoModal extends Component {
  constructor(props) {
    super(props);

    // Bind methods
    this.addFocusTrapper = this.addFocusTrapper.bind(this);
    this.deleteFocusTrapper = this.deleteFocusTrapper.bind(this);
    this.resetFocusTrapper = this.resetFocusTrapper.bind(this);
  }

  // Add focus trapper when component mounts
  componentDidMount() {
    this.addFocusTrapper({ isResetting: false });
  }

  // Delete the focus trapper when component unmounts
  componentWillUnmount() {
    this.deleteFocusTrapper({ isResetting: false });
  }

  // Add focus trapper
  addFocusTrapper({ isResetting }) {
    const modalParent = document.getElementById(this.props.modalId);
    // Calculate elementToRevertFocusTo just once
    if (!isResetting) {
      this.elementToRevertFocusTo = document.activeElement;
    }
    this.untrapFocus = domHelper.trapFocus({
      elementToTrapFocusIn: modalParent,
      elementToRevertFocusTo: this.elementToRevertFocusTo,
      startFocusingFrom: isResetting ? document.activeElement : null,
    });
  }

  // Delete focus trapper
  deleteFocusTrapper({ isResetting }) {
    if (!this.untrapFocus) return;
    this.untrapFocus({ shouldRevertFocusedElement: !isResetting });
    this.untrapFocus = null;
  }

  // Reset focus trapper when <ProductInfo /> rerenders and focusable elements change
  resetFocusTrapper() {
    this.deleteFocusTrapper({ isResetting: true });
    this.addFocusTrapper({ isResetting: true });
  }

  render() {
    const { product } = this.props;

    return (
      <ProductInfo
        product={product}
        className="productInfoModal"
        isVerbose={false}
        onComponentDidUpdate={this.resetFocusTrapper}
      />
    );
  }
}

ProductInfoModal.propTypes = {
  product: PropTypes.object.isRequired,
  modalId: PropTypes.string.isRequired,
};

export { ProductInfoModal };
