import { Component } from 'react';
import PropTypes from 'prop-types';
import './StatusView.scss';
import spinner from '../../assets/images/spinner.svg';

class StatusView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { type } = this.props;

    switch (type) {
      case 'loading':
        return (
          <section className="statusView">
            <img
              alt="Loading Spinner"
              src={spinner}
              className="statusView__loadingImage"
            />
          </section>
        );
      case 'error':
        return (
          <section className="statusView">
            <h1 className="statusView__error">Please Try Again Later</h1>
          </section>
        );
      default:
        return null;
    }
  }
}

StatusView.propTypes = {
  type: PropTypes.string.isRequired,
};

export { StatusView };
