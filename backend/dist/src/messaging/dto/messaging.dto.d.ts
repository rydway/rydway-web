export declare class SendMessageDto {
    conversationId: string;
    body: string;
    attachmentUrl?: string;
}
export declare class CreateConversationDto {
    bookingId?: string;
    vehicleId: string;
    hostUserId: string;
    initialMessage: string;
}
