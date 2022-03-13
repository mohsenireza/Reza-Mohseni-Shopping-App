import { useLocation, useNavigate, useParams } from 'react-router-dom';

// Add props for dealing with react-router-dom to the component
function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return <Component {...props} router={{ location, navigate, params }} />;
  }

  return ComponentWithRouterProp;
}

export { withRouter };
