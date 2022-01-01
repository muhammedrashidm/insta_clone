import { atom } from "recoil";

export const modalState = atom({
    key: 'modalState',
    default: false,
});

export const statusViewState = atom({
    key: 'statusViewState',
    default: false,
});

export const storiesRecoilState = atom({
    key: 'storiesRecoilState',
    default: [],
});


export const profileRecoilState = atom({
    key: 'profileRecoilState',
    default: {},
});
export const currentChatState = atom({
    key: 'currentChatState',
    default: {},
});

export const videoCallState = atom({
    key: 'videoCallState',
    default: {
        isCalling: false,
        isIncoming: false,
        otherUserId: null,
        roomName: null,

    },
});

export const videoWindowCallState = atom({
    key: 'videoWindowCallState',
    default: false
});