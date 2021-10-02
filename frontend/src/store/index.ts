import { combineReducers } from "redux";
import sessionSlice from "./sessionSlice";

const rootReducer = combineReducers({
  session: sessionSlice,
});

export default rootReducer;
