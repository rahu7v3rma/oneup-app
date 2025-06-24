import { COMMON } from '../utils/common';

import {
  SportsEvent,
  SportsScore,
  SportsTeam,
  SportsTimeframe,
  FetchSportsResponse,
  FetchUpcomingEventsResponse,
} from './types';
import { AccountApiClient } from './utils/api-client';
import ApiRequest from './utils/api-request';

const request = ApiRequest(AccountApiClient);

export const fetchTeams = async (
  page: number,
  limit: number,
): Promise<FetchSportsResponse<SportsTeam>> => {
  try {
    return await request.get<FetchSportsResponse<SportsTeam>>(
      `${COMMON.apiBaseUrl}sports/teams`,
      { params: { page, limit } },
    );
  } catch (error) {
    throw error;
  }
};

export const fetchScores = async (
  page: number,
  limit: number,
): Promise<FetchSportsResponse<SportsScore>> => {
  try {
    return await request.get<FetchSportsResponse<SportsScore>>(
      `${COMMON.apiBaseUrl}sports/scores`,
      { params: { page, limit } },
    );
  } catch (error) {
    throw error;
  }
};

export const fetchEvents = async (
  page: number,
  limit: number,
): Promise<FetchSportsResponse<SportsEvent>> => {
  try {
    return await request.get<FetchSportsResponse<SportsEvent>>(
      `${COMMON.apiBaseUrl}sports/events`,
      { params: { page, limit } },
    );
  } catch (error) {
    throw error;
  }
};

export const fetchTimeframes = async (
  page: number,
  limit: number,
): Promise<FetchSportsResponse<SportsTimeframe>> => {
  try {
    return await request.get<FetchSportsResponse<SportsTimeframe>>(
      `${COMMON.apiBaseUrl}sports/timeframes`,
      { params: { page, limit } },
    );
  } catch (error) {
    throw error;
  }
};

export const fetchUpcomingEvents = async (
  page: number,
  limit: number,
): Promise<FetchUpcomingEventsResponse<SportsEvent>> => {
  try {
    return await request.get<FetchUpcomingEventsResponse<SportsEvent>>(
      `${COMMON.apiBaseUrl}sports/upcoming-events`,
      { params: { page, limit } },
    );
  } catch (error) {
    throw error;
  }
};
