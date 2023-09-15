import { HomePage } from './HomePage.jsx';
import { useCallback } from 'react';
import { lazyWithPreload as lazy } from 'react-lazy-with-preload';
import { makeRoutes, Router, Outlet } from '@verdant-web/react-router';
import { updateApp, updateState } from '@/updateState.js';
import { PageRoot } from '@a-type/ui/components/layouts';
import { TopLoader } from '@/components/nav/TopLoader.jsx';

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
    path: '/',
    component: HomePage,
    exact: true,
  },
  {
    path: '/trips',
    component: TripsPage,
    children: [
      {
        path: ':tripId',
        component: TripPage,
      },
    ],
    onVisited() {
      ListsPage.preload();
      TripPage.preload();
    },
  },
  {
    path: '/lists',
    component: ListsPage,
    children: [
      {
        path: ':listId',
        component: ListPage,
      },
    ],
    onVisited() {
      ListPage.preload();
      TripsPage.preload();
    },
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
        <TopLoader />
      </Router>
    </PageRoot>
  );
}
