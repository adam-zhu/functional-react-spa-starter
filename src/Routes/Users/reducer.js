// @flow
import {
  type Dispatch,
  type GetState,
  type ThunkAction
} from "../../Store/RootReducer";
import { type Timestamp } from "../../Helpers/timestamp";
import UsersService from "../../Services/Users";

export type User = {|
  email: string,
  user_id: string,
  last_login_date: Timestamp,
  credits: number,
  license: "freemium" | "trial" | "professional",
  early_access: "yes" | "no"
|};

export type SortOption = $Enum<User> | null;
export type OrderOption = "asc" | "desc" | null;

export type UsersState = {|
  +error: string | null,
  +busy: boolean,
  +users: User[] | null,
  +display_users: User[] | null,
  +search_term: string,
  +sort: SortOption,
  +order: OrderOption
|};

const initialState: UsersState = {
  error: null,
  busy: false,
  users: null,
  display_users: null,
  search_term: "",
  sort: null,
  order: null
};

export type UsersAction =
  | {| type: "users/reset" |}
  | {| type: "users/set_error", payload: string | null |}
  | {| type: "users/set_busy", payload: boolean |}
  | {| type: "users/set_users", payload: User[] | null |}
  | {| type: "users/set_display_users", payload: User[] | null |}
  | {| type: "users/set_search_term", payload: string |}
  | {| type: "users/set_sort", payload: SortOption |}
  | {| type: "users/set_order", payload: OrderOption |};

export default (
  state: UsersState = initialState,
  action: UsersAction
): UsersState => {
  switch (action.type) {
    case "users/reset":
      return {
        ...initialState
      };

    case "users/set_error":
      return {
        ...state,
        error: action.payload
      };

    case "users/set_busy":
      return {
        ...state,
        busy: action.payload
      };

    case "users/set_users":
      return {
        ...state,
        users: action.payload
      };

    case "users/set_display_users":
      return {
        ...state,
        display_users: action.payload
      };

    case "users/set_search_term":
      return {
        ...state,
        search_term: action.payload
      };

    case "users/set_sort":
      return {
        ...state,
        sort: action.payload
      };

    case "users/set_order":
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
      type: "users/reset"
    });

    dispatch(load_users());
  };
};

export const load_users = (): ThunkAction => {
  return async (dispatch: Dispatch, getState: GetState) => {
    dispatch({
      type: "users/set_busy",
      payload: true
    });

    try {
      const users = await UsersService.get_users();

      dispatch({
        type: "users/set_busy",
        payload: false
      });

      dispatch({
        type: "users/set_users",
        payload: users
      });

      dispatch({
        type: "users/set_display_users",
        payload: users
      });
    } catch (e) {
      const error = `${e.name}: ${e.message}`;

      dispatch({
        type: "users/set_error",
        payload: error
      });

      dispatch({
        type: "users/set_busy",
        payload: false
      });
    }
  };
};

export const update_search_term = (search_term: string): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    const currentState = getState().Users;
    const { users, sort, order } = currentState;

    dispatch({
      type: "users/set_search_term",
      payload: search_term
    });

    dispatch({
      type: "users/set_display_users",
      payload: search_and_sort_users({
        users,
        search_term,
        sort,
        order
      })
    });
  };
};

export const update_sort = (sort: SortOption): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    const current = getState().Users;
    const order = resolve_new_sort_order({
      new_sort: sort,
      current_sort: current.sort,
      current_order: current.order
    });
    const display_users = search_and_sort_users({
      users: current.users || [],
      search_term: current.search_term,
      sort,
      order
    });

    dispatch({
      type: "users/set_sort",
      payload: sort
    });

    dispatch({
      type: "users/set_order",
      payload: order
    });

    dispatch({
      type: "users/set_display_users",
      payload: display_users
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
  if (new_sort === current_sort) {
    if (current_order === null) {
      return "asc";
    }

    if (current_order === "asc") {
      return "desc";
    }

    return null;
  }

  return "asc";
};

const sort_users = ({
  users,
  sort,
  order
}: {
  users: User[],
  sort: SortOption,
  order: OrderOption
}): User[] => {
  if (order === null) {
    return users;
  }

  return users.slice().sort(by({ sort, order }));
};

const by = ({ sort, order }: { sort: SortOption, order: OrderOption }) => (
  a: User,
  b: User
): number => {
  if (sort === null) {
    return 0;
  }

  if (sort === "last_login_date") {
    const a_val = a[sort].unix;
    const b_val = b[sort].unix;

    return order === "asc" ? a_val - b_val : b_val - a_val;
  }

  if (sort === "credits") {
    return order === "asc" ? a[sort] - b[sort] : b[sort] - a[sort];
  }

  if (a[sort] > b[sort]) {
    return order === "asc" ? 1 : -1;
  }

  if (a[sort] < b[sort]) {
    return order === "asc" ? -1 : 1;
  }

  return 0;
};

const search_users = ({
  users,
  search_term
}: {
  users: User[],
  search_term: string
}): User[] => {
  const sanitized_search_term = search_term.trim().toLowerCase();

  if (sanitized_search_term.length === 0) {
    return users;
  }

  const is_match = (s: string | number): boolean =>
    s
      .toString()
      .toLowerCase()
      .indexOf(sanitized_search_term) !== -1;

  return users.filter(
    (u: User): boolean =>
      is_match(u.email) ||
      is_match(u.user_id) ||
      is_match(u.last_login_date.time_ago) ||
      is_match(u.credits) ||
      is_match(u.license) ||
      is_match(u.early_access)
  );
};

const search_and_sort_users = ({
  users,
  search_term,
  sort,
  order
}: {
  users: User[] | null,
  search_term: string,
  sort: SortOption,
  order: OrderOption
}): User[] | null =>
  users !== null
    ? sort_users({ users: search_users({ users, search_term }), sort, order })
    : null;
