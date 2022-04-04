import { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Drawer.scss';
import logo from '../../assets/images/logo.svg';
import { ReactComponent as Back } from '../../assets/images/back.svg';
import { DetectClickOutside } from '../index';

class Drawer extends Component {
  constructor(props) {
    super(props);

    this.state = { isDrawerOpen: false };

    // Bind methods
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
  }

  handleDrawerOpen() {
    this.setState({ isDrawerOpen: true });
  }

  handleDrawerClose() {
    this.setState({ isDrawerOpen: false });
  }

  render() {
    const { renderToggler, renderDrawerBody } = this.props;

    return (
      <>
        {/* Toggler */}
        {renderToggler &&
          renderToggler(() => setTimeout(this.handleDrawerOpen, 0))}
        {/* Drawer */}
        <section
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
