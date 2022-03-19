import { Component } from 'react';
import PropTypes from 'prop-types';
import './Button.scss';

class Button extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { title, size, theme, className, onClick } = this.props;

    return (
      <button
        className={`button -${size} -${theme} ${className}`}
        onClick={onClick}
      >
        {title}
      </button>
    );
  }
}

Button.propTypes = {
  title: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['big', 'small']),
  theme: PropTypes.oneOf(['green', 'dark', 'light']),
  className: PropTypes.string,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  size: 'big',
  theme: 'green',
  onClick: () => {},
};

export { Button };
