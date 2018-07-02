// @flow
import { type User } from "../../Routes/Users/reducer";
import timestamp from "../../Helpers/timestamp";

// flowlint unclear-type:off
const format_users = (data: any): User[] =>
  data.map(d => ({
    ...d,
    last_login_date: timestamp(d.last_login_date),
    early_access: d.early_access ? "yes" : "no"
  }));

export default { format_users };
