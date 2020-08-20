// Global types and interfaces for the project
type ProcessType = string;
type AppMode = "image" | "text";

interface ImagePayload {
    buffer: ArrayBufferLike;
    height: number;
    width: number;
}

interface TextPayload {
    buffer: ArrayBufferLike;
    length: number;
}

// Type declarations for proprietary Navigator APIs
// https://developer.mozilla.org/en-US/docs/Web/API/Navigator
interface NavigatorExtras {
    readonly deviceMemory?: number;
}

interface Navigator extends NavigatorExtras { }
