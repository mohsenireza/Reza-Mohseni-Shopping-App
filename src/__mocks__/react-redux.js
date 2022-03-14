const reactRedux = jest.createMockFromModule('react-redux');

reactRedux.connect = (mapStateToProps, mapDispatchToProps) => (component) =>
  component;

module.exports = reactRedux;
