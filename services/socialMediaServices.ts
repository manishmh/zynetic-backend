import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); 

const BASE_URL = process.env.BASE_URL as string;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN as string;

interface UsersResponse {
    users: Record<string, string>;
}

interface PostsResponse {
    posts: Array<{ id: number; userid: number; content: string }>;
}

interface CommentsResponse {
    comments: Array<{ id: number; postid: number; content: string }>;
}

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
    },
});

export async function fetchUsers(): Promise<Record<string, string>> {
    const response = await apiClient.get<UsersResponse>("/users");
    return response.data.users;
}

export async function fetchUserPosts(userId: string): Promise<PostsResponse["posts"]> {
    const response = await apiClient.get<PostsResponse>(`/users/${userId}/posts`);
    return response.data.posts || [];
}

export async function fetchPostComments(postId: number): Promise<CommentsResponse["comments"]> {
    const response = await apiClient.get<CommentsResponse>(`/posts/${postId}/comments`);
    return response.data.comments || [];
}
