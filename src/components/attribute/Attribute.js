import { Component } from 'react';
import PropTypes from 'prop-types';
import './Attribute.scss';
import { Button } from '../index';

class Attribute extends Component {
  constructor(props) {
    super(props);

    // Bind methods
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(itemId) {
    if (this.props.isDisabled) return;
    // Save selected attribute item id in <Product />'s state
    this.props.onAttributeSelect({
      attributeId: this.props.id,
      attributeSelectedItemId: itemId,
    });
  }

  render() {
    const {
      id,
      name,
      type,
      items,
      className,
      selectedItemId,
      isDisabled,
      shouldFadeWhenDisabled,
      hasAttributeName,
      hasTooltip,
      size,
      selectedTextAttributeItemTheme,
    } = this.props;

    return (
      <div className={`attribute -${size} ${className}`}>
        {hasAttributeName && (
          <h3 className="attribute__name">{name.toUpperCase()}:</h3>
        )}
        <ul className="attribute__items">
          {items.map((item) => (
            <li
              key={item.id}
              className={`
                attribute__itemContainer 
                ${isDisabled ? '-disabled' : ''}
                ${isDisabled && shouldFadeWhenDisabled ? '-fade' : ''}
              `}
            >
              {/* Text attributes like size, etc... */}
              {type === 'text' && (
                <Button
                  size="small"
                  theme={
                    item.id === selectedItemId
                      ? selectedTextAttributeItemTheme
                      : 'white'
                  }
                  shouldDisableHover={true}
                  title={item.value}
                  className="attribute__item -text"
                  onClick={() => this.handleSelect(item.id)}
                  tabIndex={isDisabled ? '-1' : '0'}
                />
              )}
              {/* Color attribute */}
              {type === 'swatch' && id === 'Color' && (
                <Button
                  size="small"
                  className="attribute__item -color"
                  onClick={() => this.handleSelect(item.id)}
                  style={{ background: item.value }}
                  tabIndex={isDisabled ? '-1' : '0'}
                >
                  <span
                    className={`attribute__itemCheckMark ${
                      item.id === selectedItemId ? '-show' : ''
                    }`}
                  >
                    👍
                  </span>
                </Button>
              )}
              {hasTooltip && (
                <span className="attribute__itemTooltip">
                  {item.displayValue}
                </span>
              )}
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
  onAttributeSelect: PropTypes.func,
  selectedItemId: PropTypes.string,
  isDisabled: PropTypes.bool,
  shouldFadeWhenDisabled: PropTypes.bool,
  hasAttributeName: PropTypes.bool,
  hasTooltip: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'big']),
  selectedTextAttributeItemTheme: PropTypes.oneOf(['dark', 'light']),
};

Attribute.defaultProps = {
  onAttributeSelect: () => {},
  shouldFadeWhenDisabled: true,
  hasAttributeName: true,
  hasTooltip: true,
  size: 'big',
  selectedTextAttributeItemTheme: 'dark',
};

export { Attribute };
