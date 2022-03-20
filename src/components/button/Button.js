import { Component } from 'react';
import PropTypes from 'prop-types';
import './Button.scss';

class Button extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { title, size, theme, className, children, ...otherProps } =
      this.props;

    return (
      <button
        className={`button -${size} -${theme} ${className}`}
        {...otherProps}
      >
        {children || title}
      </button>
    );
  }
}

Button.propTypes = {
  title: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['big', 'small']),
  theme: PropTypes.oneOf(['green', 'dark', 'light']),
  className: PropTypes.string,
  children: PropTypes.any,
};

Button.defaultProps = {
  size: 'big',
  theme: 'green',
};

export { Button };
