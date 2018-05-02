// @flow
import {
  type Dispatch,
  type GetState,
  type ThunkAction
} from '../../Store/RootReducer';
import { type Timestamp } from '../../Helpers/timestamp';
import TeamsService from '../../Services/Teams';

export type Team = {|
  email: string,
  team_id: string,
  last_login_date: Timestamp,
  simulations: number,
  license: 'freemium' | 'trial' | 'professional',
  early_access: 'yes' | 'no'
|};

export type SortOption =
  | null
  | 'email'
  | 'team_id'
  | 'last_login_date'
  | 'simulations'
  | 'license'
  | 'early_access';

export type OrderOption = 'asc' | 'desc' | null;

export type TeamsState = {|
  +error: string | null,
  +busy: boolean,
  +teams: Team[] | null,
  +display_teams: Team[] | null,
  +search_term: string,
  +sort: SortOption,
  +order: OrderOption
|};

const initialState: TeamsState = {
  error: null,
  busy: false,
  teams: null,
  display_teams: null,
  search_term: '',
  sort: null,
  order: null
};

export type TeamsAction =
  | {| type: 'teams/reset' |}
  | {| type: 'teams/set_error', payload: string | null |}
  | {| type: 'teams/set_busy', payload: boolean |}
  | {| type: 'teams/set_teams_data', payload: Team[] | null |}
  | {| type: 'teams/set_display_teams', payload: Team[] | null |}
  | {| type: 'teams/set_search_term', payload: string |}
  | {| type: 'teams/set_sort', payload: SortOption |}
  | {| type: 'teams/set_order', payload: OrderOption |};

export default (
  state: TeamsState = initialState,
  action: TeamsAction
): TeamsState => {
  switch (action.type) {
    case 'teams/reset':
      return {
        ...initialState
      };

    case 'teams/set_error':
      return {
        ...state,
        error: action.payload
      };

    case 'teams/set_busy':
      return {
        ...state,
        busy: action.payload
      };

    case 'teams/set_teams_data':
      return {
        ...state,
        teams: action.payload
      };

    case 'teams/set_display_teams':
      return {
        ...state,
        display_teams: action.payload
      };

    case 'teams/set_search_term':
      return {
        ...state,
        search_term: action.payload
      };

    case 'teams/set_sort':
      return {
        ...state,
        sort: action.payload
      };

    case 'teams/set_order':
      return {
        ...state,
        order: action.payload
      };

    default:
      return state;
  }
};

export const on_route_match = (): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    dispatch({
      type: 'teams/reset'
    });

    dispatch(load_teams());
  };
};

export const load_teams = (): ThunkAction => {
  return async (dispatch: Dispatch, getState: GetState) => {
    dispatch({
      type: 'teams/set_busy',
      payload: true
    });

    try {
      const teams = await TeamsService.get_teams_list();

      dispatch({
        type: 'teams/set_busy',
        payload: false
      });

      dispatch({
        type: 'teams/set_teams_data',
        payload: teams
      });

      dispatch({
        type: 'teams/set_display_teams',
        payload: teams
      });
    } catch (e) {
      const error = `${e.status ? e.status : '500'}: ${
        e.message ? e.message : e.toString()
      }`;

      dispatch({
        type: 'teams/set_error',
        payload: error
      });

      dispatch({
        type: 'teams/set_busy',
        payload: false
      });
    }
  };
};

export const update_search_term = (search_term: string): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    const currentState = getState().Teams;
    const { teams, sort, order } = currentState;

    dispatch({
      type: 'teams/set_search_term',
      payload: search_term
    });

    const display_teams = search_and_sort_teams({
      teams: teams || [],
      search_term,
      sort,
      order
    });

    dispatch({
      type: 'teams/set_display_teams',
      payload: display_teams
    });
  };
};

export const update_sort = (sort: SortOption): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    const currentState = getState().Teams;
    const order = resolve_new_sort_order({
      new_sort: sort,
      current_sort: currentState.sort,
      current_order: currentState.order
    });
    const display_teams = search_and_sort_teams({
      teams: currentState.teams || [],
      search_term: currentState.search_term,
      sort,
      order
    });

    dispatch({
      type: 'teams/set_sort',
      payload: sort
    });

    dispatch({
      type: 'teams/set_order',
      payload: order
    });

    dispatch({
      type: 'teams/set_display_teams',
      payload: display_teams
    });
  };
};

const resolve_new_sort_order = ({
  new_sort,
  current_sort,
  current_order
}: {
  new_sort: SortOption,
  current_sort: SortOption,
  current_order: OrderOption
}): OrderOption => {
  console.log({ new_sort, current_sort, current_order });
  if (new_sort === current_sort) {
    if (current_order === null) {
      return 'asc';
    }

    if (current_order === 'asc') {
      return 'desc';
    }

    return null;
  }

  return 'asc';
};

const sort_teams = ({
  teams,
  sort,
  order
}: {
  teams: Team[],
  sort: SortOption,
  order: OrderOption
}): Team[] => {
  if (order === null) {
    return teams;
  }

  return teams.slice().sort(by({ sort, order }));
};

const by = ({ sort, order }: { sort: SortOption, order: OrderOption }) => (
  a: Team,
  b: Team
): number => {
  if (sort === null) {
    return 0;
  }

  if (sort === 'last_login_date') {
    const a_val = a[sort].unix;
    const b_val = b[sort].unix;

    return order === 'asc' ? a_val - b_val : b_val - a_val;
  }

  if (sort === 'simulations') {
    return order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort];
  }

  if (a[sort] > b[sort]) {
    return order === 'asc' ? 1 : -1;
  }

  if (a[sort] < b[sort]) {
    return order === 'asc' ? -1 : 1;
  }

  return 0;
};

const search_teams = ({
  teams,
  search_term
}: {
  teams: Team[],
  search_term: string
}): Team[] => {
  const sanitized_search_term = search_term.trim().toLowerCase();

  if (sanitized_search_term.length === 0) {
    return teams;
  }

  const is_match = (s: string | number): boolean =>
    s
      .toString()
      .toLowerCase()
      .indexOf(sanitized_search_term) !== -1;

  return teams.filter(
    (team: Team): boolean =>
      is_match(team.email) ||
      is_match(team.team_id) ||
      is_match(team.last_login_date.time_ago) ||
      is_match(team.simulations) ||
      is_match(team.license) ||
      is_match(team.early_access)
  );
};

const search_and_sort_teams = ({
  teams,
  search_term,
  sort,
  order
}: {
  teams: Team[],
  search_term: string,
  sort: SortOption,
  order: OrderOption
}): Team[] =>
  sort_teams({ teams: search_teams({ teams, search_term }), sort, order });
