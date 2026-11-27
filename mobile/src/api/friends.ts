import { apiRequest } from './client';

export type FriendRelation = 'FRIEND' | 'INVITATION_SENT' | 'INVITATION_RECEIVED';

export interface FriendDto {
  friendshipId: number;
  userId: number;
  displayName: string;
  email: string;
  relation: FriendRelation;
}

export function getFriends(): Promise<FriendDto[]> {
  return apiRequest<FriendDto[]>('/friends');
}

export function inviteFriend(email: string): Promise<FriendDto> {
  return apiRequest<FriendDto>('/friends/invite', {
    method: 'POST',
    body: { email },
  });
}

export function acceptInvitation(friendshipId: number): Promise<FriendDto> {
  return apiRequest<FriendDto>(`/friends/${friendshipId}/accept`, {
    method: 'PUT',
  });
}

export function removeFriendship(friendshipId: number): Promise<void> {
    return apiRequest<void>(`/friends/${friendshipId}`, {
        method: 'DELETE',   
    });
}

export interface FriendLookupDto {  
  displayName: string;
}

export function lookupFriend(email: string): Promise<FriendLookupDto> {
  return apiRequest<FriendLookupDto>('/friends/lookup', {
    method: 'POST',
    body: { email },
  });
}