import { Message } from "@/models/User";


interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessage?: boolean;
    messages?: Array<Message>
}

export default ApiResponse;