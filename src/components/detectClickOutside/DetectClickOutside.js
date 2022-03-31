import { Component, createRef } from 'react';
import PropTypes from 'prop-types';

// This component will fire onClickOutside() prop, whenever outside of this component (and its children) gets clicked
class DetectClickOutside extends Component {
  constructor(props) {
    super(props);

    // Use this.wrapperRef to track whether detected click is inside this component or not
    this.wrapperRef = createRef();
    // this.handleClickOutside gets fired everytime a click event happens
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    // Set event listener
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    // Remove event listener
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside(event) {
    // Checks if the click event happened outside of the component,
    // if yes, then it will run onClickOutside() prop
    if (
      this.wrapperRef.current &&
      !this.wrapperRef.current.contains(event.target)
    ) {
      this.props.onClickOutside();
    }
  }

  render() {
    return (
      <div
        data-testid="detectClickOutsideContainer"
        ref={this.wrapperRef}
        className={this.props.className}
      >
        {this.props.children}
      </div>
    );
  }
}

DetectClickOutside.propTypes = {
  children: PropTypes.any.isRequired,
  onClickOutside: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export { DetectClickOutside };
