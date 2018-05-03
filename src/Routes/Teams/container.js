// @flow
import * as React from "react";
import { connect } from "react-redux";
import "./container.css";
import { type RootState, type Dispatch } from "../../Store/RootReducer";
import { type SubmitHandler, type ChangeHandler } from "../../Helpers/types";
import {
  type Team,
  type SortOption,
  type OrderOption,
  update_search_term,
  update_sort
} from "./reducer";

type mappedState = {|
  error: string | null,
  busy: boolean,
  display_teams: Team[] | null,
  search_term: string,
  sort: SortOption,
  order: OrderOption
|};

const mapStateToProps = (rootState: RootState, ownProps): mappedState => {
  return {
    error: rootState.Teams.error,
    busy: rootState.Teams.busy,
    display_teams: rootState.Teams.display_teams,
    search_term: rootState.Teams.search_term,
    sort: rootState.Teams.sort,
    order: rootState.Teams.order
  };
};

type mappedHandlers = {|
  search_term_update_handler: ChangeHandler,
  sort_update_handler: (new_sort: SortOption) => SubmitHandler
|};

const mapDispatchToProps = (dispatch: Dispatch, ownProps): mappedHandlers => {
  return {
    search_term_update_handler: e => {
      e.preventDefault();

      const updated_search_term = e.currentTarget.value;
      dispatch(update_search_term(updated_search_term));
    },
    sort_update_handler: new_sort => e => {
      e.preventDefault();
      dispatch(update_sort(new_sort));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  ({
    error,
    busy,
    display_teams,
    search_term,
    sort,
    order,
    search_term_update_handler,
    sort_update_handler
  }: mappedState & mappedHandlers): React.Node => {
    const teams_search_props: TeamsSearchProps = {
      search_term,
      search_term_update_handler
    };
    const teams_table_props: TeamsTableProps = {
      teams: display_teams || [],
      search_term,
      sort,
      order,
      sort_update_handler
    };

    return (
      <div className="page-body teams">
        <h1>Teams</h1>
        {error !== null ? (
          <div className="error">{error}</div>
        ) : display_teams === null ? (
          <div className="loading">Loading...</div>
        ) : (
          <div>
            <TeamsSearch {...teams_search_props} />
            <TeamsTable {...teams_table_props} />
          </div>
        )}
      </div>
    );
  }
);

interface TeamsSearchProps {
  search_term: string;
  search_term_update_handler: ChangeHandler;
}
const TeamsSearch = ({
  search_term,
  search_term_update_handler
}: TeamsSearchProps): React.Node => {
  return (
    <form>
      <input
        type="text"
        name="search_term"
        placeholder="Search Teams"
        defaultValue={search_term}
        onChange={search_term_update_handler}
      />
    </form>
  );
};

interface TeamsTableProps {
  teams: Team[];
  search_term: string;
  sort: SortOption;
  order: OrderOption;
  sort_update_handler: (s: SortOption) => SubmitHandler;
}
const TeamsTable = ({
  teams,
  search_term,
  sort,
  order,
  sort_update_handler
}: TeamsTableProps): React.Node => {
  if (teams.length === 0) {
    const trimmed_search_term = search_term.trim();
    if (trimmed_search_term) {
      return <p>No teams matching "{trimmed_search_term}".</p>;
    }

    return <p>No teams.</p>;
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
          <th className="team_id">
            <form onSubmit={sort_update_handler("team_id")}>
              <button type="submit">ID</button>
            </form>
            {resolve_sort_icon({ column_name: "team_id", sort, order })}
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
          <th className="simulations">
            <form onSubmit={sort_update_handler("simulations")}>
              <button type="submit">Simulations</button>
            </form>
            {resolve_sort_icon({ column_name: "simulations", sort, order })}
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
        {teams.map((t: Team, i: number): React.Node => (
          <tr key={i}>
            <td title={t.email}>{t.email}</td>
            <td title={t.team_id.toString()}>{t.team_id}</td>
            <td title={t.last_login_date.datetime}>
              {t.last_login_date.time_ago}
            </td>
            <td title={t.simulations.toString()}>{t.simulations}</td>
            <td title={t.license}>{t.license}</td>
            <td title={t.early_access}>{t.early_access}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

interface SortIconArgs {
  column_name: string;
  sort: SortOption;
  order: OrderOption;
}
const resolve_sort_icon = ({
  column_name,
  sort,
  order
}: SortIconArgs): React.Node => {
  if (sort === null || order === null || sort !== column_name) {
    return null;
  }

  if (order === "asc") {
    return <i className="material-icons">arrow_upward</i>;
  }

  if (order === "desc") {
    return <i className="material-icons">arrow_downward</i>;
  }

  return null;
};
