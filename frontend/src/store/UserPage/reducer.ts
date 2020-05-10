import { UserPageState, Action, SET_AVATAR } from './types';
import defaultAvatar from '../../assets/images/default_avatar.png';

const initialState = {
    avatar: defaultAvatar
}

export default function(state: UserPageState = initialState, action: Action): UserPageState {
    if (action.type === SET_AVATAR) {
        return { avatar: action.payload !== "none" ? action.payload : defaultAvatar };
    }
    
    return state;
}
