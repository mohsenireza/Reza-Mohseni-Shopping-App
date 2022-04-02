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
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
  }

  handleDrawerToggle(isDrawerOpen = null) {
    // Toggle automatically
    if (isDrawerOpen === null) {
      this.setState((state) => ({ isDrawerOpen: !state.isDrawerOpen }));
    }
    // Toggle based on the parameter
    else {
      this.setState({ isDrawerOpen });
    }
  }

  render() {
    return (
      <>
        {/* Toggler */}
        {this.props.renderToggler(this.handleDrawerToggle)}
        {/* Drawer */}
        <section
          className={`drawer ${this.state.isDrawerOpen ? '-open' : '-closed'}`}
        >
          {this.state.isDrawerOpen && (
            <DetectClickOutside
              onClickOutside={() => this.handleDrawerToggle(false)}
              className="drawer__content"
            >
              {/* Drawer header */}
              <div className="drawer__header">
                <button
                  data-testid="drawerHeaderCloseButton"
                  onClick={() => this.handleDrawerToggle(false)}
                  className="drawer__headerCloseButton"
                >
                  <Back
                    fill="#a6a6a6"
                    className="drawer__headerCloseButtonImage"
                  />
                </button>
                <Link
                  onClick={() => this.handleDrawerToggle(false)}
                  className="drawer__headerLogo"
                  to="/products"
                >
                  <figure>
                    <img src={logo} />
                  </figure>
                </Link>
              </div>
              {/* Drawer body */}
              <div className="drawer__body">
                {this.props.renderDrawerBody(this.handleDrawerToggle)}
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

Drawer.defaultProps = {
  renderToggler: () => null,
  renderDrawerBody: () => null,
};

export { Drawer };
