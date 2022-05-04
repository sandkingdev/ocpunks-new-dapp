import { dAppName } from 'config';
import withPageTitle from './components/PageTitle';
import Home from './pages/Home';
import ZogStake from './pages/ZogStake';
import OrcNft from './pages/OrcNft';
import EasterNft from './pages/EasterNft';
import BuyNft from './pages/BuyNft';
import SellNft from './pages/SellNft';

export const routeNames = {
  unlock: '/unlock',
  ledger: '/ledger',
  walletconnect: '/walletconnect',
  home: '/',
  stake: '/stake',
  orcnft: '/orcnft',
  easternft: '/easternft',
  buynft: '/buynft',
  sellnft: '/sellnft',
};

const routes: Array<any> = [
  {
    path: routeNames.home,
    title: 'Home',
    component: Home
  },
  {
    path: routeNames.stake,
    title: 'Stake $ZOG',
    component: ZogStake
  },
  {
    path: routeNames.orcnft,
    title: 'Stake Nft',
    component: OrcNft
  },
  {
    path: routeNames.easternft,
    title: 'Stake Nft',
    component: EasterNft
  },
  {
    path: routeNames.buynft,
    title: 'Buy Nft',
    component: BuyNft
  },
  {
    path: routeNames.sellnft,
    title: 'Sell Nft',
    component: SellNft
  },
];

const mappedRoutes = routes.map((route) => {
  // const title = route.title
  //   ? `${route.title} • Orcpunks ${dAppName}`
  //   : `Orcpunks ${dAppName}`;
  const title = 'Orcpunks';

  const requiresAuth = Boolean(route.authenticatedRoute);
  const wrappedComponent = withPageTitle(title, route.component);

  return {
    path: route.path,
    component: wrappedComponent,
    authenticatedRoute: requiresAuth
  };
});

export default mappedRoutes;
