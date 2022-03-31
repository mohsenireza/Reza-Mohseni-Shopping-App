import { Component } from 'react';
import PropTypes from 'prop-types';
import './Button.scss';

class Button extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      title,
      size,
      theme,
      className,
      children,
      shouldDisableHover,
      ...otherProps
    } = this.props;

    return (
      <button
        className={`button -${size} -${theme} ${
          shouldDisableHover ? '-hoverDisabled' : ''
        } ${className}`}
        {...otherProps}
      >
        {children || title}
      </button>
    );
  }
}

Button.propTypes = {
  title: PropTypes.string,
  size: PropTypes.oneOf(['big', 'small']),
  theme: PropTypes.oneOf(['green', 'red', 'dark', 'light', 'white']),
  className: PropTypes.string,
  children: PropTypes.any,
  shouldDisableHover: PropTypes.bool,
};

Button.defaultProps = {
  size: 'big',
  theme: 'green',
  shouldDisableHover: false,
};

export { Button };
