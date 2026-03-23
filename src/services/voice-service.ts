import { api } from './client';
import { endpoints } from './endpoints';

export const voiceService = {
  // Voice Pins
  fetchAll: (signal?: AbortSignal) =>
    api.get(endpoints.voice, { signal }),

  create: (data: any) =>
    api.post(endpoints.createVoicePin, data),

  fetchDetail: (id: string | number) =>
    api.get(endpoints.voiceDetail(id)),

  update: (id: string | number, data: any) =>
    api.patch(endpoints.updateVoicePin(id), data),

  delete: (id: string | number) =>
    api.delete(endpoints.deleteVoicePin(id)),

  fetchPublic: (params?: any) =>
    api.get(endpoints.voicePublic, { params }),

  fetchPublicByUser: (userId: string | number) =>
    api.get(endpoints.voicePublicByUser(userId)),

  fetchFriends: () =>
    api.get(endpoints.voiceFriends),

  fetchRandom: (lat: number, lng: number, radius = 5) =>
    api.get(endpoints.voiceRandom, { params: { lat, lng, radius } }),

  fetchBBox: (params: any) =>
    api.get(endpoints.voiceBBox, { params }),

  discover: (id: string | number) =>
    api.post(endpoints.voiceDiscover(id)),

  // Reactions & Comments
  fetchReactions: (id: string | number) =>
    api.get(endpoints.voiceReactions(id)),

  fetchComments: (id: string | number) =>
    api.get(endpoints.voiceComments(id)),

  fetchCommentReplies: (commentId: string | number) =>
    api.get(endpoints.commentReplies(commentId)),

  // Reactions
  submitReaction: (data: any) =>
    api.post(endpoints.reaction, data),

  deleteReaction: (voicePinId: string | number) =>
    api.delete(endpoints.reactionDelete(voicePinId)),

  fetchReactionSummary: (voicePinId: string | number) =>
    api.get(endpoints.reactionSummary(voicePinId)),

  // Translation
  translate: (sourceText: string, targetLang = 'vi') =>
    api.get(endpoints.translate(sourceText, targetLang)),
};

export default voiceService;
