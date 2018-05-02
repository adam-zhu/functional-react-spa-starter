// @flow
import { type Team } from '../../Routes/Teams/reducer';
import timestamp from '../../Helpers/timestamp';

// flowlint unclear-type:off
const format_teams_list = (data: any): Team[] =>
  data.map(d => ({
    ...d,
    last_login_date: timestamp(d.last_login_date),
    early_access: d.early_access ? 'yes' : 'no'
  }));

export default { format_teams_list };
