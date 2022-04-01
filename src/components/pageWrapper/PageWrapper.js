import { Component } from 'react';
import PropTypes from 'prop-types';
import './PageWrapper.scss';
import spinner from '../../assets/images/spinner.svg';

class PageWrapper extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { loading, error, children } = this.props;

    if (loading) {
      return (
        <section className="pageWrapper__loadingContainer">
          <img
            alt="loading-spinner"
            src={spinner}
            className="pageWrapper__loadingImage"
          />
        </section>
      );
    }

    if (error) {
      return (
        <section className="pageWrapper__errorContainer">
          <h1 className="pageWrapper__error">Please Try Again Later</h1>
        </section>
      );
    }

    return children;
  }
}

PageWrapper.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.bool,
  children: PropTypes.element,
};

export { PageWrapper };
