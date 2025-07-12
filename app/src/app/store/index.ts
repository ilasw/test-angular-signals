import {ActionReducerMap, MetaReducer} from '@ngrx/store';
import {authReducer} from '@/auth/store/auth.reducer';
import {AuthState} from '@/auth/store/auth.state';

export interface AppState {
  auth: AuthState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
};

export const metaReducers: MetaReducer<AppState>[] = [];
