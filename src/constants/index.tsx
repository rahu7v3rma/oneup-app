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
        points: ['-10', '040', '-340'],
      },
      {
        id: 2,
        name: 'PHI',
        logo: PhiladelphiaEaglesLogo,
        record: '4-8',
        points: ['-10', '040', '-340'],
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
        points: ['-10', '040', '-340'],
      },
      {
        id: 2,
        name: 'PHI',
        logo: PhiladelphiaEaglesLogo,
        record: '4-8',
        points: ['-10', '040', '-340'],
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
        points: ['-10', '040', '-340'],
      },
      {
        id: 2,
        name: 'PHI',
        logo: PhiladelphiaEaglesLogo,
        record: '4-8',
        points: ['-10', '040', '-340'],
      },
    ],
  },
];

const gameChats = [
  {
    id: 1,
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

const registerMinimumAge = 15;

export { gameRecapData, upcomingGames, gameChats, registerMinimumAge };
