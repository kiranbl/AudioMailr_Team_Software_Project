import React from 'react';
import { useHistory } from 'react-router-dom';

export function withNavigation(WrappedComponent) {
  return function WithNavigationComponent(props) {
    const history = useHistory();

    return <WrappedComponent {...props} history={history} />;
  };
}
