import React from 'react';

const withBreakpoint = (Component) => {
  class ComponentWithBreakpoint extends React.Component {
    constructor(props) {
      super(props);

      // this.state.width holds width of the view port
      this.state = { breakpoint: '' };

      // Bind methods
      this.calculateBreakpoint = this.calculateBreakpoint.bind(this);
    }

    componentDidMount() {
      this.calculateBreakpoint();
      // Update this.state.breakpoint, everytime the view port's width changes
      window.addEventListener('resize', this.calculateBreakpoint);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.calculateBreakpoint);
    }

    calculateBreakpoint() {
      let updatedBreakpoint = '';
      const breakpoints = {
        xl: 1450,
        lg: 1200,
        tablet: 1024,
        md: 992,
        sm: 768,
        xsm: 650,
        xxsm: 576,
        xxxsm: 450,
      };
      const width = window.innerWidth;

      // Calculate breakpoint
      for (let [key, value] of Object.entries(breakpoints).reverse()) {
        if (width <= value) {
          updatedBreakpoint = key;
          break;
        }
      }

      // If updatedBreakpoint is still an empty string, it means width is greater than xl
      if (updatedBreakpoint === '') updatedBreakpoint = 'over-xl';

      // Update the state
      if (this.state.breakpoint !== updatedBreakpoint) {
        this.setState({ breakpoint: updatedBreakpoint });
      }
    }

    render() {
      return <Component {...this.props} breakpoint={this.state.breakpoint} />;
    }
  }

  return ComponentWithBreakpoint;
};

export { withBreakpoint };
