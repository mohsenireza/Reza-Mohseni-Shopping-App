import { Component } from 'react';
import PropTypes from 'prop-types';
import './ModalContainer.scss';
import { ReactComponent as Cross } from '../../assets/images/cross.svg';

class ModalContainer extends Component {
  constructor(props) {
    super(props);

    // Bind methods
    this.handleModalClose = this.handleModalClose.bind(this);
  }

  // Close the modal
  handleModalClose() {
    this.props.onModalClose();
  }

  render() {
    return (
      <section
        data-testid="modalContainer"
        className={`modalContainer ${this.props.className}`}
      >
        {/* Overlay */}
        <div
          className="modalContainer__overlay"
          onClick={this.handleModalClose}
        ></div>
        {/* Modal Content */}
        <main className="modalContainer__content container">
          {/* Modal Content Header */}
          <header className="modalContainer__contentHeader">
            <button
              data-testid="modalContainerContentHeaderCloseButton"
              className="modalContainer__contentHeaderCloseButton"
              onClick={this.handleModalClose}
            >
              <Cross
                fill="#ff0000"
                className="modalContainer__contentHeaderCloseButtonImage"
              />
            </button>
            <h1 className="modalContainer__contentHeaderTitle">
              {this.props.title}
            </h1>
          </header>
          {/* Modal Content Body */}
          <div className="modalContainer__contentBody">
            {this.props.children}
          </div>
        </main>
      </section>
    );
  }
}

ModalContainer.propTypes = {
  children: PropTypes.element,
  onModalClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
};

ModalContainer.defaultProps = {
  className: '',
};

export { ModalContainer };
