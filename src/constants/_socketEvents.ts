export enum _EReceiveEvents {
    COMPLETE_ISSUE = 'complete-issue',
    ERROR = 'error',
    NEW_PRODUCT_ADDED = 'new-product-added',
    NOTIFY_ADMINS_OF_NEW_USER = 'notify_admins_of_new_user',
    NOTIFY_FOR_CREATE_ROOM = 'notify_for_created_room',
    SUPPORT_ACTIVITY = 'support_activity',
    SUPPORT_CHAT_USER_JOIN_ACKNOWLEDGMENT = 'support_chat_user_join_acknowledgment',
    SUPPORT_MESSAGE = 'support_message',
    SUPPORT_MESSAGE_STATUS = 'support_message_status',
    USER_CONNECT = 'user_connect',
}

export enum _ESendEvents {
    SUPPORT_ACCEPT_USER = 'support_accept_user',
    SUPPORT_ACTIVITY = 'support_activity',
    SUPPORT_CHAT_USER_JOIN = 'support_chat_join',
    SUPPORT_CHAT_USER_LEAVE = 'support_chat_leave',
    SUPPORT_MESSAGE = 'support_message',
    SUPPORT_MESSAGE_DELIVERED = 'support_message_delivered',
    SUPPORT_MESSAGE_SEEN = 'support_message_seen',
    USER_ACCEPT_JOIN_TO_ROOM = 'user_accept_join_to_room',
    USER_CONNECT = 'user_connect',
}
