import PhiladelphiaEaglesLogo from '../../assets/png/philadelphia-eagles-logo.png';
import WashingtonCommandersLogo from '../../assets/png/washington-commanders-logo.png';
import PELogo from '../../assets/pngs/philadelphia-eagles-logo.png';
import WCLogo from '../../assets/pngs/washington-commanders-logo.png';
import { Commanders, Eagles } from '../../assets/svgs';

const gameRecapData = [
  {
    image: <Eagles />,
    teamName: 'Eagles',
    record: '4-8',
    scores: [0, 3, 3, 13],
    total: 19,
  },
  {
    image: <Commanders />,
    teamName: 'Commanders',
    record: '4-8',
    scores: [0, 3, 3, 13],
    total: 13,
  },
];

const upcomingGames = [
  {
    id: 1,
    users: 51,
    wagers: 5,
    datetime: 'SUN, 12/01 1:00 PM',
    teams: [
      {
        id: 1,
        name: 'WAS',
        logo: WashingtonCommandersLogo,
        record: '4-8',
        points: [-10, 40, -340],
      },
      {
        id: 2,
        name: 'PHI',
        logo: PhiladelphiaEaglesLogo,
        record: '4-8',
        points: [-10, 40, -340],
      },
    ],
  },
  {
    id: 2,
    users: 51,
    wagers: 5,
    datetime: 'SUN, 12/01 1:00 PM',
    teams: [
      {
        id: 1,
        name: 'WAS',
        logo: WashingtonCommandersLogo,
        record: '4-8',
        points: [-10, 40, -340],
      },
      {
        id: 2,
        name: 'PHI',
        logo: PhiladelphiaEaglesLogo,
        record: '4-8',
        points: [-10, 40, -340],
      },
    ],
  },
  {
    id: 3,
    users: 51,
    wagers: 5,
    datetime: 'SUN, 12/01 1:00 PM',
    teams: [
      {
        id: 1,
        name: 'WAS',
        logo: WashingtonCommandersLogo,
        record: '4-8',
        points: [-10, 40, -340],
      },
      {
        id: 2,
        name: 'PHI',
        logo: PhiladelphiaEaglesLogo,
        record: '4-8',
        points: [-10, 40, -340],
      },
    ],
  },
];

const gameChats = [
  {
    id: 1,
    team1: 'WAS',
    team2: 'PHI',
    team1Logo: WCLogo,
    team2Logo: PELogo,
    title: 'Titans @ Falcons 1/12 1 pm',
    activeWagers: '5 Active Wagers',
    lastMessage:
      'NoobyMaster: Good morning, did you sleep well? Because you are...',
    timeAgo: '15m ago',
    unreadMessages: 12,
  },
  {
    id: 2,
    team1: 'WAS',
    team2: 'PHI',
    team1Logo: WCLogo,
    team2Logo: PELogo,
    title: 'Titans @ Falcons 1/12 1 pm',
    activeWagers: '5 Active Wagers',
    lastMessage:
      'NoobyMaster: Good morning, did you sleep well? Because you are...',
    timeAgo: '15m ago',
    unreadMessages: 12,
  },
  {
    id: 3,
    team1: 'WAS',
    team2: 'PHI',
    team1Logo: WCLogo,
    team2Logo: PELogo,
    title: 'Titans @ Falcons 1/12 1 pm',
    activeWagers: '',
    lastMessage:
      'NoobyMaster: Good morning, did you sleep well? Because you are...',
    timeAgo: '15m ago',
    unreadMessages: null,
  },
  {
    id: 4,
    team1: 'WAS',
    team2: 'PHI',
    team1Logo: WCLogo,
    team2Logo: PELogo,
    title: 'Titans @ Falcons 1/12 1 pm',
    activeWagers: '5 Active Wagers',
    lastMessage:
      'NoobyMaster: Good morning, did you sleep well? Because you are...',
    timeAgo: '15m ago',
    unreadMessages: 12,
  },
];

const coinString = {
  BUY_COINS_TITLE: 'Buy Coins',
  BALANCE_LABEL: 'Balance',
};

const coinPacks = [
  { id: '1', amount: 2500, bonus: 1, price: '$ 3.99' },
  { id: '2', amount: 5000, bonus: 2, price: '$ 5.99' },
  { id: '3', amount: 25000, bonus: 3, price: '$ 7.99', popular: true },
  { id: '4', amount: 50000, bonus: 4, price: '$ 9.99' },
];

export { gameRecapData, upcomingGames, gameChats, coinString, coinPacks };
