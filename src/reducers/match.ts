import { createAsyncThunk, createSlice, createAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { PURGE } from 'redux-persist';

import { AccountApiClient } from '../api/utils/api-client';
import ApiRequest from '../api/utils/api-request';
import { RootState } from '../store';
import {
  FetchScoreDetails,
  FetchSportsEventDetails,
  FetchSportsTeamDetails,
  ScoreDetails,
  SportsEventDetails,
  SportsTeamDetails,
} from '../types/match';

const request = ApiRequest(AccountApiClient);

interface SportState {
  eventLoading: boolean;
  eventDetails: SportsEventDetails | null;
  eventError: string | null;
  teams: {
    [teamId: number]: SportsTeamDetails;
  };
  teamLoading: boolean;
  teamError: string | null;
  scoreDetails: ScoreDetails | null;
  scoreDetailsLoading: boolean;
  scoreDetailsError: string | null;
}

const initialState: SportState = {
  eventLoading: false,
  eventDetails: null,
  eventError: null,
  teams: {},
  teamLoading: false,
  teamError: null,
  scoreDetails: null,
  scoreDetailsLoading: false,
  scoreDetailsError: null,
};

export const fetchEventDetails = createAsyncThunk(
  'sport/eventDetails',
  async (options: { eventId: string }, { rejectWithValue }) => {
    try {
      const response = await request.get<FetchSportsEventDetails>(
        `/sports/event-details/${options.eventId}`,
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch score details',
      );
    }
  },
);

export const fetchTeamDetails = createAsyncThunk(
  'sport/fetchTeamDetails',
  async (teamId: number, { rejectWithValue }) => {
    try {
      const response = await request.get<FetchSportsTeamDetails>(
        `/sports/team-details/${teamId}`,
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue({
        teamId,
        error: err.response?.data?.message || 'Failed to fetch team details',
      });
    }
  },
);

export const fetchScoreDetails = createAsyncThunk(
  'sport/fetchScoreDetails',
  async (scoreId: number, { rejectWithValue }) => {
    try {
      const response = await request.get<FetchScoreDetails>(
        `/sports/score-details/${scoreId}`,
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch score details',
      );
    }
  },
);

// Add WebSocket score update action
export const updateEventScores = createAction<{
  eventId: string;
  homeScore: number;
  awayScore: number;
  lastUpdate: string;
}>('sport/updateEventScores');

const sportSlice = createSlice({
  name: 'sport',
  initialState,
  reducers: {
    resetTeams: (state) => {
      state.teams = {};
    },
    resetScoreDetails: (state) => {
      state.scoreDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchEventDetails.pending, (state) => {
      state.eventLoading = true;
    });
    builder.addCase(fetchEventDetails.fulfilled, (state, action) => {
      state.eventDetails = action.payload;
      state.eventLoading = false;
    });
    builder.addCase(fetchEventDetails.rejected, (state, action) => {
      state.eventLoading = false;
      state.eventError = action.payload as string;
    });
    builder.addCase(fetchTeamDetails.pending, (state) => {
      state.teamLoading = true;
      state.teamError = null;
    });
    builder.addCase(fetchTeamDetails.fulfilled, (state, action) => {
      const teamDetails = action.payload;
      state.teams[teamDetails.api_team_id] = teamDetails;
      state.teamLoading = false;
    });
    builder.addCase(fetchTeamDetails.rejected, (state, action) => {
      state.teamLoading = false;
      state.teamError = action.payload as string;
    });
    builder.addCase(fetchScoreDetails.pending, (state) => {
      state.scoreDetailsLoading = true;
      state.scoreDetailsError = null;
    });
    builder.addCase(fetchScoreDetails.fulfilled, (state, action) => {
      state.scoreDetails = action.payload;
      state.scoreDetailsLoading = false;
    });
    builder.addCase(fetchScoreDetails.rejected, (state, action) => {
      state.scoreDetailsLoading = false;
      state.scoreDetailsError = action.payload as string;
    });
    builder.addCase(updateEventScores, (state, action) => {
      const { eventId, homeScore, awayScore, lastUpdate } = action.payload;
      console.log('this is eventDetails', state.eventDetails);
      if (
        !state.eventDetails ||
        state.eventDetails.api_event_id?.toString() !== eventId
      ) {
        console.log('Event ID mismatch or no event details');
        return;
      }

      // Create scores array if it doesn't exist
      if (!state.eventDetails.scores) {
        state.eventDetails.scores = [];
      }

      // Update or create the first score entry
      if (state.eventDetails.scores.length === 0) {
        state.eventDetails.scores.push({
          id: Date.now(), // temporary ID
          score_id: Date.now(),
          api_event_id: parseInt(eventId, 10),
          home_team_score: homeScore,
          away_team_score: awayScore,
          last_update: lastUpdate,
          // Add default values for other required fields
          home_score_quarter1: 0,
          home_score_quarter2: 0,
          // ... other required score fields
        });
      } else {
        state.eventDetails.scores[0] = {
          ...state.eventDetails.scores[0],
          home_team_score: homeScore,
          away_team_score: awayScore,
          last_update: lastUpdate,
        };
      }
    });
    builder.addCase(PURGE, () => initialState);
  },
});

export default sportSlice.reducer;

interface ScoreSelectorsType {
  eventLoading: boolean;
  eventDetails: SportsEventDetails | null;
  eventError: string | null;
  teams: {
    [teamId: number]: SportsTeamDetails;
  };
  teamLoading: boolean;
  scoreDetails: ScoreDetails | null;
  scoreDetailsLoading: boolean;
  scoreDetailsError: string | null;
}

export const useSportSelectors = (): ScoreSelectorsType => {
  const eventLoading = useSelector(
    (state: RootState) => state.sport!.eventLoading,
  );
  const eventDetails = useSelector(
    (state: RootState) => state.sport!.eventDetails,
  );
  const eventError = useSelector((state: RootState) => state.sport!.eventError);
  const teams = useSelector((state: RootState) => state.sport!.teams);
  const teamLoading = useSelector(
    (state: RootState) => state.sport!.teamLoading,
  );
  const scoreDetails = useSelector(
    (state: RootState) => state.sport!.scoreDetails,
  );
  const scoreDetailsLoading = useSelector(
    (state: RootState) => state.sport!.scoreDetailsLoading,
  );
  const scoreDetailsError = useSelector(
    (state: RootState) => state.sport!.scoreDetailsError,
  );
  return {
    eventLoading,
    eventDetails,
    eventError,
    teams,
    teamLoading,
    scoreDetails,
    scoreDetailsLoading,
    scoreDetailsError,
  };
};

export const { resetTeams, resetScoreDetails } = sportSlice.actions;
