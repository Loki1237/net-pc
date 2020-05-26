export const EDITING_IS_LOADING = "EDITION_IS_LOADING";
export const EDITING_ERROR = "EDITION_ERROR";
export const EDITING_EDIT_BASIC_DATA = "EDITION_EDIT_BASIC_DATA";
export const EDITING_EDIT_ABOUT_SELF_DATA = "EDITION_EDIT_ABOUT_SELF_DATA";
export const EDITING_SET_ALL_DATA = "EDITION_SET_ALL_DATA";
export const EDITING_RESET_STATE = "EDITION_RESET_STATE";

interface LoadingAction {
    type: typeof EDITING_IS_LOADING,
    isLoading: boolean,
}

interface ErrorAction {
    type: typeof EDITING_ERROR,
    error: string,
}

interface EditBasicDataAction {
    type: typeof EDITING_EDIT_BASIC_DATA,
    fieldName: string,
    payload: string,
}

interface EditAboutSelfDataAction {
    type: typeof EDITING_EDIT_ABOUT_SELF_DATA,
    fieldName: string,
    payload: string,
}

interface EditSetDataAction {
    type: typeof EDITING_SET_ALL_DATA,
    basicData: BasicDataType, 
    aboutSelfData: AboutSelfType,
}

interface ResetAction {
    type: typeof EDITING_RESET_STATE
}

export type EditionAction = LoadingAction
                            | ErrorAction
                            | EditBasicDataAction
                            | EditAboutSelfDataAction
                            | EditSetDataAction
                            | ResetAction

export interface EditionState {
    isLoading: boolean,
    error: string,
    basicData: BasicDataType,
    aboutSelfData: AboutSelfType
}

export interface BasicDataType {
    firstName: string,
    lastName: string,
    birthday: string,
    familyStatus: string,
    country: string,
    city: string
}

export interface AboutSelfType {
    activity: string,
    interests: string,
    hobby: string,
    aboutSelf: string
}
