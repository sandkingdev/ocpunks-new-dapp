import { dAppName } from 'config';
import withPageTitle from './components/PageTitle';
import Home from './pages/Home';
import ZogStake from './pages/ZogStake';
import Coinflip from './pages/Coinflip';
import OrcNft from './pages/OrcNft';
import EasterNft from './pages/EasterNft';
import BuyNft from './pages/BuyNft';
import SellNft from './pages/SellNft';
import Breeding from './pages/Breeding';
import Bridge from './pages/Bridge';
import Mint from './pages/Mint';
import PersonalOffer from './pages/PersonalOffer';
import NftStake from './pages/NftStake';
import ZogFarm from 'pages/ZogFarm';

export const routeNames = {
  unlock: '/unlock',
  ledger: '/ledger',
  walletconnect: '/walletconnect',
  home: '/',
  stake: '/stake',
  coinflip: '/coinflip',
  orcnft: '/orcnft',
  easternft: '/easternft',
  buynft: '/buynft',
  sellnft: '/sellnft',
  breeding: '/breeding',
  bridge: '/bridge',
  personaloffer: '/offer',
  mint: '/mint',
  stakenft: '/nftstaking',
  farm: '/farm',
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
    path: routeNames.coinflip,
    title: 'Coinflip $ZOG',
    component: Coinflip
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
  {
    path: routeNames.breeding,
    title: 'NFT Breeding',
    component: Breeding
  },
  {
    path: routeNames.bridge,
    title: 'NFT Bridge',
    component: Bridge
  },
  {
    path: routeNames.personaloffer,
    title: 'Offer',
    component: PersonalOffer
  },
  {
    path: routeNames.mint,
    title: 'Mint',
    component: Mint
  },
  {
    path: routeNames.stakenft,
    title: 'NftStake',
    component: NftStake
  },
  {
    path: routeNames.farm,
    title: 'ZogFarm',
    component: ZogFarm
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
