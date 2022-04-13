const reactRedux = jest.createMockFromModule('react-redux');

reactRedux.connect = (mapStateToProps, mapDispatchToProps) => (Component) =>
  Component;

reactRedux.Provider = ({ children }) => children;

module.exports = reactRedux;
