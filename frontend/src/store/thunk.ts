import { Action } from 'redux';
import { RootState } from './index';
import { AnyAction, Dispatch } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

export type AppThunkAction<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
export type AppThunkDispatch = ThunkDispatch<RootState, Dispatch, AnyAction>;
