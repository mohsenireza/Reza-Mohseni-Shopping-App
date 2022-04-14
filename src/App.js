import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Routes } from './Routes';
import { Header, PageWrapper } from './components';
import { fetchGlobalData } from './features/global/globalSlice';
import { fetchOrderList } from './features/cart/cartSlice';

class App extends Component {
  constructor(props) {
    super(props);

    // Bind methods
    this.fetchInitialData = this.fetchInitialData.bind(this);
  }

  // Fetch initial data on startup
  componentDidMount() {
    this.fetchInitialData();
  }

  fetchInitialData() {
    this.props.dispatchFetchGlobalData();
    this.props.dispatchFetchOrderList();
  }

  render() {
    const { fetchGlobalDataStatus, fetchOrderListStatus } = this.props;

    const fetchInitialDataStatuses = [
      fetchGlobalDataStatus,
      fetchOrderListStatus,
    ];

    // Render the app after initial data gets loaded, otherwise render loading
    return (
      <PageWrapper
        loading={
          fetchInitialDataStatuses.includes('idle') ||
          fetchInitialDataStatuses.includes('loading')
        }
        error={fetchInitialDataStatuses.includes('failed')}
      >
        <div className="App">
          <Header />
          {/* Render screens based on routes */}
          <Routes />
        </div>
      </PageWrapper>
    );
  }
}

App.propTypes = {
  fetchGlobalDataStatus: PropTypes.string.isRequired,
  fetchOrderListStatus: PropTypes.string.isRequired,
  dispatchFetchGlobalData: PropTypes.func.isRequired,
  dispatchFetchOrderList: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  fetchGlobalDataStatus: state.global.status,
  fetchOrderListStatus: state.cart.status,
});

const mapDispatchToProps = {
  dispatchFetchOrderList: fetchOrderList,
  dispatchFetchGlobalData: fetchGlobalData,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
