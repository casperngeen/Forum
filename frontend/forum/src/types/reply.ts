export default interface ReplyType {
    id: number,
    username: string,
    thread_id: number,
    created_at: Date,
    edited: boolean,
    content: string
}