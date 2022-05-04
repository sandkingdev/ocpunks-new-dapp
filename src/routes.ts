import { dAppName } from 'config';
import withPageTitle from './components/PageTitle';
import Home from './pages/Home';
import MyNft from './pages/MyNft';
import StakedNft from './pages/StakedNft';

export const routeNames = {
  unlock: '/unlock',
  ledger: '/ledger',
  walletconnect: '/walletconnect',
  home: '/',
  mynft: '/mynft',
  stakednft: '/stakednft'
};

const routes: Array<any> = [
  {
    path: routeNames.home,
    title: 'Home',
    component: Home
  },
  {
    path: routeNames.mynft,
    title: 'My NFT',
    component: MyNft
  },
  {
    path: routeNames.stakednft,
    title: 'Staked NFT',
    component: StakedNft
  }
];

const mappedRoutes = routes.map((route) => {
  const title = route.title
    ? `${route.title} • Orcpunks ${dAppName}`
    : `Orcpunks ${dAppName}`;

  const requiresAuth = Boolean(route.authenticatedRoute);
  const wrappedComponent = withPageTitle(title, route.component);

  return {
    path: route.path,
    component: wrappedComponent,
    authenticatedRoute: requiresAuth
  };
});

export default mappedRoutes;
