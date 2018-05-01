// redux
export type GetState = () => State;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any | async (dispatch: Dispatch, getState: GetState) => any;
export type Dispatch = (action: Action | Array<Action> | ThunkAction) => any;

// handlers
export type LinkHandler = (e: SyntheticEvent<HTMLAnchorElement>) => any;
export type SubmitHandler = (e: SyntheticEvent<HTMLFormElement>) => any;
