import { HomePage } from './HomePage.jsx';
import { lazy, useCallback } from 'react';
import { makeRoutes, Router, Outlet } from '@verdant-web/react-router';
import { updateApp, updateState } from '@/updateState.js';
import { PageRoot } from '@a-type/ui/components/layouts';

// dynamically import pages that may not be visited
const JoinPage = lazy(() => import('./JoinPage.jsx'));
const ClaimInvitePage = lazy(() => import('./ClaimInvitePage.jsx'));
const SettingsPage = lazy(() => import('./SettingsPage.jsx'));
const ListsPage = lazy(() => import('./ListsPage.jsx'));
const ListPage = lazy(() => import('./ListPage.jsx'));
const TripsPage = lazy(() => import('./TripsPage.jsx'));
const TripPage = lazy(() => import('./TripPage.jsx'));

const routes = makeRoutes([
  {
    path: '/trips/:tripId',
    component: TripPage,
  },
  {
    path: '/lists/:listId',
    component: ListPage,
  },
  {
    path: '/',
    component: HomePage,
    children: [
      {
        path: 'trips',
        component: Outlet,
        children: [
          {
            index: true,
            exact: true,
            component: TripsPage,
          },
        ],
      },
      {
        path: 'lists',
        component: Outlet,
        children: [
          {
            index: true,
            exact: true,
            component: ListsPage,
          },
        ],
      },
    ],
  },
  {
    path: '/join',
    component: JoinPage,
  },
  {
    path: '/claim/:inviteId',
    component: ClaimInvitePage,
  },
  {
    path: '/settings',
    component: SettingsPage,
  },
]);

export function Pages() {
  const onNavigate = useCallback(() => {
    if (updateState.updateAvailable) {
      updateApp(true);
      return false;
    }
  }, []);
  return (
    <PageRoot>
      <Router routes={routes} onNavigate={onNavigate}>
        <Outlet />
      </Router>
    </PageRoot>
  );
}
