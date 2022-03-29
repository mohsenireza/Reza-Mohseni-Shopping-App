import { Component } from 'react';
import PropTypes from 'prop-types';
import './ModalContainer.scss';

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
      <section className={`modalContainer ${this.props.className}`}>
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
              className="modalContainer__contentHeaderCloseButton"
              onClick={this.handleModalClose}
            >
              Close
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
