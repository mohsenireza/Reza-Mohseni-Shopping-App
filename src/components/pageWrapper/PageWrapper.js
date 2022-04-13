import { Component } from 'react';
import PropTypes from 'prop-types';
import { StatusView } from '../index';

class PageWrapper extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { loading, error, children } = this.props;

    if (loading) {
      return <StatusView type="loading" />;
    }

    if (error) {
      return <StatusView type="error" />;
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
