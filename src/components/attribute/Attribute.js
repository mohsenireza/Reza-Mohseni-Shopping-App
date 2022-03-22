import { Component } from 'react';
import PropTypes from 'prop-types';
import './Attribute.scss';
import { Button } from '../index';

class Attribute extends Component {
  constructor(props) {
    super(props);

    // Initialize state
    this.state = { selectedItemId: null };

    // Bind methods
    this.handleOnSelect = this.handleOnSelect.bind(this);
  }

  handleOnSelect(id) {
    !this.props.isDisabled && this.setState({ selectedItemId: id });
  }

  render() {
    const { id, name, type, items, className, isDisabled } = this.props;

    return (
      <div className={`attribute ${className}`}>
        <h3 className="attribute__name">{name}:</h3>
        <ul className="attribute__items">
          {items.map((item) => (
            <li
              key={item.id}
              className={`attribute__itemContainer ${
                isDisabled ? '-disabled' : ''
              }`}
            >
              {/* Text attributes like size, etc... */}
              {type === 'text' && (
                <Button
                  size="small"
                  theme={
                    item.id === this.state.selectedItemId ? 'dark' : 'light'
                  }
                  title={item.value}
                  className="attribute__item -text"
                  onClick={() => this.handleOnSelect(item.id)}
                  tabIndex={isDisabled ? '-1' : '0'}
                />
              )}
              {/* Color attribute */}
              {type === 'swatch' && id === 'Color' && (
                <Button
                  size="small"
                  className="attribute__item -color"
                  onClick={() => this.handleOnSelect(item.id)}
                  style={{ background: item.value }}
                  tabIndex={isDisabled ? '-1' : '0'}
                >
                  <span
                    className={`attribute__itemCheckMark ${
                      item.id === this.state.selectedItemId ? '-show' : ''
                    }`}
                  >
                    👍
                  </span>
                </Button>
              )}
              <span className="attribute__itemTooltip">
                {item.displayValue}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

Attribute.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      displayValue: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  className: PropTypes.string,
  isDisabled: PropTypes.bool,
};

export { Attribute };
