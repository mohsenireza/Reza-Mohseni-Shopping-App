import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

// Add props for dealing with react-router-dom to the component
function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    let [searchParams, setSearchParams] = useSearchParams();

    return (
      <Component
        {...props}
        router={{ location, navigate, params, searchParams, setSearchParams }}
      />
    );
  }

  return ComponentWithRouterProp;
}

export { withRouter };
