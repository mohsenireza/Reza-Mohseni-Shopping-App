import { Component } from 'react';
import PropTypes from 'prop-types';
import { StatusView } from '../index';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to the console
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI
      return <StatusView type="error" />;
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.any,
};

export { ErrorBoundary };
