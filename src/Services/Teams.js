// @flow
import { type Team } from '../Routes/Teams/reducer';
import TeamsFormatter from './formatters/Teams';
import mocks from './mocks';

const get_teams_list = async (): Promise<Team[]> => {
  const teams_list = await mocks.teams_list();

  return TeamsFormatter.format_teams_list(teams_list);
};
export default {
  get_teams_list
};
