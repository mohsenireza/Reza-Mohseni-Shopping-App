import { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Drawer.scss';
import logo from '../../assets/images/logo.svg';
import { ReactComponent as Back } from '../../assets/images/back.svg';
import { DetectClickOutside } from '../index';
import { FocusTrapper } from '../../utils';

class Drawer extends Component {
  constructor(props) {
    super(props);

    this.state = { isDrawerOpen: false };

    // Refs
    this.drawerRef = createRef();

    // Bind methods
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.handleEscapeKeyDown = this.handleEscapeKeyDown.bind(this);
    this.disableBodyScrolling = this.disableBodyScrolling.bind(this);
    this.enableBodyScrolling = this.enableBodyScrolling.bind(this);
  }

  componentDidMount() {
    // Initialize focusTrapper
    this.focusTrapper = new FocusTrapper(this.drawerRef.current);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isDrawerOpen !== this.state.isDrawerOpen) {
      if (this.state.isDrawerOpen) {
        // Add focus trapper when the drawer gets opened
        this.focusTrapper.add();
        // Add event listener for handleEscapeKeyDown
        document.addEventListener('keydown', this.handleEscapeKeyDown);
      } else {
        // Delete focus trapper when the drawer gets closed
        this.focusTrapper.delete();
        // Remove event listener for handleEscapeKeyDown
        document.removeEventListener('keydown', this.handleEscapeKeyDown);
      }
    }
  }

  componentWillUnmount() {
    this.enableBodyScrolling();
    // Delete focus trapper when viewport's width becomes bigger and <Drawer /> gets unmounted
    this.focusTrapper.delete();
    // Remove event listener for handleEscapeKeyDown when viewport's width becomes bigger and <Drawer /> gets unmounted
    document.removeEventListener('keydown', this.handleEscapeKeyDown);
  }

  handleDrawerOpen() {
    this.setState({ isDrawerOpen: true });
    this.disableBodyScrolling();
  }

  handleDrawerClose() {
    this.setState({ isDrawerOpen: false });
    this.enableBodyScrolling();
  }

  // Close drawer when escape key is pressed
  handleEscapeKeyDown(e) {
    // 'Esc' is for IE, 'Escape' is for other browsers
    if (e.key === 'Escape' || e.key === 'Esc') {
      this.handleDrawerClose();
    }
  }

  disableBodyScrolling() {
    // Disable scrolling of body
    document.querySelector('body').style.overflow = 'hidden';
  }

  enableBodyScrolling() {
    // Enable scrolling of body
    document.querySelector('body').style.overflow = 'auto';
  }

  render() {
    const { renderToggler, renderDrawerBody } = this.props;

    return (
      <>
        {/* Toggler */}
        {renderToggler && renderToggler(this.handleDrawerOpen)}
        {/* Drawer */}
        <section
          ref={this.drawerRef}
          className={`drawer ${this.state.isDrawerOpen ? '-open' : '-closed'}`}
        >
          {this.state.isDrawerOpen && (
            <DetectClickOutside
              onClickOutside={this.handleDrawerClose}
              className="drawer__content"
            >
              {/* Drawer header */}
              <div data-testid="drawerHeader" className="drawer__header">
                <button
                  data-testid="drawerHeaderCloseButton"
                  onClick={this.handleDrawerClose}
                  className="drawer__headerCloseButton"
                >
                  <Back
                    fill="#a6a6a6"
                    className="drawer__headerCloseButtonImage"
                  />
                </button>
                <Link
                  onClick={this.handleDrawerClose}
                  className="drawer__headerLogo"
                  to="/products"
                >
                  <figure>
                    <img src={logo} alt="Logo" loading="lazy" />
                  </figure>
                </Link>
              </div>
              {/* Drawer body */}
              <div className="drawer__body">
                {renderDrawerBody && renderDrawerBody(this.handleDrawerClose)}
              </div>
            </DetectClickOutside>
          )}
        </section>
      </>
    );
  }
}

Drawer.propTypes = {
  renderToggler: PropTypes.func,
  renderDrawerBody: PropTypes.func,
};

export { Drawer };
