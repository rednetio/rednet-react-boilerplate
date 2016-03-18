import { Route, DefaultRoute, NotFoundRoute } from 'react-router';
import { Hello, NotFound } from '..';

export default (
  <Route path="/" handler="{App}">
    <DefaultRoute handler="{Hello}" />
    <NotFoundRoute handler="{NotFound}" />
  </Route>
);
