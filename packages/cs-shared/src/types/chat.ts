export interface ChatRoomMessagePartial {
	id: string;
	content: string;
	createdAt: number;
}

export interface ChatRoomMessage extends ChatRoomMessagePartial {
	user: ChatRoomMember;
}

export const CHAT_ROOM_MEMBER_ROLES = ["member", "admin"] as const;

export type ChatRoomMemberRole = (typeof CHAT_ROOM_MEMBER_ROLES)[number];

export const CHAT_ROOM_MEMBER_TYPES = ["user", "agent"] as const;

export type ChatRoomMemberType = (typeof CHAT_ROOM_MEMBER_TYPES)[number];

export interface ChatRoomMember {
	id: string; // User ID or Agent ID
	role: ChatRoomMemberRole;
	type: ChatRoomMemberType;
	name: string;
	email: string;
	image: string | null;
}

export type WsChatRoomMessage =
	| { type: "message-receive"; message: ChatRoomMessagePartial }
	| { type: "message-broadcast"; message: ChatRoomMessage }
	| { type: "messages-sync"; messages: ChatRoomMessage[] };
