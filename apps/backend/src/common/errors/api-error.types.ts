export type ApiError = {
    code: string;
    reason: string;
    status: number;
    details?: Record<string, unknown>;
};

export type ApiErrorResponse = {
    success: false;
    error: ApiError;
    requestId: string;
    path: string;
    method: string;
    timestamp: string;
}