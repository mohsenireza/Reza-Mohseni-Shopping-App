import { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './Drawer.scss';
import logo from '../../assets/images/logo.svg';
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
        <button onClick={() => this.handleDrawerToggle()}>Categories</button>
        <section
          className={`drawer ${this.state.isDrawerOpen ? '-open' : '-closed'}`}
        >
          {this.state.isDrawerOpen && (
            <DetectClickOutside
              onClickOutside={() => this.handleDrawerToggle(false)}
              className="drawer__content"
            >
              <div className="drawer__header">
                <button
                  onClick={() => this.handleDrawerToggle(false)}
                  className="drawer__headerCloseButton"
                >
                  Close
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
              <div className="drawer__body">
                {this.props.renderBody(() => this.handleDrawerToggle(false))}
              </div>
            </DetectClickOutside>
          )}
        </section>
      </>
    );
  }
}

Drawer.propTypes = {
  renderBody: PropTypes.func,
};

Drawer.defaultProps = {
  renderBody: () => null,
};

export { Drawer };
