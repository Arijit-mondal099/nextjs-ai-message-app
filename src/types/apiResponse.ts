
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T | undefined;
    error?: T | undefined;
}
