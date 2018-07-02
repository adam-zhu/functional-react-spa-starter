// @flow
import * as React from "react";
import { connect } from "react-redux";
import "./container.css";
import { type RootState, type Dispatch } from "../../Store/RootReducer";
import { type SubmitHandler, type ChangeHandler } from "../../Helpers/types";
import {
  type User,
  type SortOption,
  type OrderOption,
  update_search_term,
  update_sort
} from "./reducer";

type mappedState = {|
  error: string | null,
  busy: boolean,
  display_users: User[] | null,
  search_term: string,
  sort: SortOption,
  order: OrderOption
|};
const mapState = (rootState: RootState, ownProps): mappedState => {
  return {
    error: rootState.Users.error,
    busy: rootState.Users.busy,
    display_users: rootState.Users.display_users,
    search_term: rootState.Users.search_term,
    sort: rootState.Users.sort,
    order: rootState.Users.order
  };
};

type mappedHandlers = {|
  search_term_update_handler: ChangeHandler,
  sort_update_handler: (new_sort: SortOption) => SubmitHandler
|};
const mapHandlers = (dispatch: Dispatch, ownProps): mappedHandlers => {
  return {
    search_term_update_handler: e => {
      e.preventDefault();
      dispatch(update_search_term(e.currentTarget.value));
    },
    sort_update_handler: new_sort => e => {
      e.preventDefault();
      dispatch(update_sort(new_sort));
    }
  };
};

const Users = ({
  error,
  busy,
  display_users,
  search_term,
  sort,
  order,
  search_term_update_handler,
  sort_update_handler
}: mappedState & mappedHandlers): React.Node => {
  return (
    <div className="page-body users">
      <h1>Users</h1>
      {error !== null ? (
        <div className="error">{error}</div>
      ) : display_users === null ? (
        <div className="loading">Loading...</div>
      ) : (
        <div>
          {UsersSearch({
            display_users,
            search_term,
            search_term_update_handler
          })}
          <br />
          <br />
          {UsersTable({
            display_users,
            search_term,
            sort,
            order,
            sort_update_handler
          })}
        </div>
      )}
    </div>
  );
};

export default connect(
  mapState,
  mapHandlers
)(Users);

const UsersSearch = ({
  search_term,
  search_term_update_handler
}: {
  search_term: string,
  search_term_update_handler: ChangeHandler
}): React.Node => (
  <input
    type="text"
    name="search_term"
    placeholder="Search users"
    defaultValue={search_term}
    onChange={search_term_update_handler}
  />
);

const UsersTable = ({
  display_users,
  search_term,
  sort,
  order,
  sort_update_handler
}: {
  display_users: User[],
  search_term: string,
  sort: SortOption,
  order: OrderOption,
  sort_update_handler: (s: SortOption) => SubmitHandler
}): React.Node => {
  if (display_users.length === 0) {
    const trimmed_search_term = search_term.trim();
    if (trimmed_search_term) {
      return <p>No users matching "{trimmed_search_term}".</p>;
    }

    return <p>No users.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th className="email">
            <form onSubmit={sort_update_handler("email")}>
              <button type="submit">Email</button>
            </form>
            {resolve_sort_icon({ column_name: "email", sort, order })}
          </th>

          <th className="user_id">
            <form onSubmit={sort_update_handler("user_id")}>
              <button type="submit">ID</button>
            </form>
            {resolve_sort_icon({ column_name: "user_id", sort, order })}
          </th>

          <th className="last_login_date">
            <form onSubmit={sort_update_handler("last_login_date")}>
              <button type="submit">Last Log In</button>
            </form>
            {resolve_sort_icon({
              column_name: "last_login_date",
              sort,
              order
            })}
          </th>

          <th className="credits">
            <form onSubmit={sort_update_handler("credits")}>
              <button type="submit">Credits</button>
            </form>
            {resolve_sort_icon({ column_name: "credits", sort, order })}
          </th>

          <th className="license">
            <form onSubmit={sort_update_handler("license")}>
              <button type="submit">License</button>
            </form>
            {resolve_sort_icon({ column_name: "license", sort, order })}
          </th>

          <th className="early_access">
            <form onSubmit={sort_update_handler("early_access")}>
              <button type="submit">Early Access</button>
            </form>
            {resolve_sort_icon({ column_name: "early_access", sort, order })}
          </th>
        </tr>
      </thead>

      <tbody>
        {display_users.map(u => (
          <tr key={u.email}>
            <td title={u.email}>{u.email}</td>
            <td title={u.user_id}>{u.user_id}</td>
            <td title={u.last_login_date.datetime}>
              {u.last_login_date.time_ago}
            </td>
            <td title={u.credits}>{u.credits}</td>
            <td title={u.license}>{u.license}</td>
            <td title={u.early_access}>{u.early_access}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const resolve_sort_icon = ({
  column_name,
  sort,
  order
}: {
  column_name: string,
  sort: SortOption,
  order: OrderOption
}): React.Node => {
  if (sort === null || order === null || sort !== column_name) {
    return <i className="material-icons default">unfold_more</i>;
  }

  if (order === "asc") {
    return <i className="material-icons asc">arrow_upward</i>;
  }

  if (order === "desc") {
    return <i className="material-icons desc">arrow_downward</i>;
  }

  return <i className="material-icons default">unfold_more</i>;
};
