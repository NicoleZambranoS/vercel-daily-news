export type ContentBlock =
    | { type: "paragraph"; text: string }
    | { type: "heading"; text: string; level?: number }
    | { type: "blockquote"; text: string }
    | { type: "unordered-list"; items: string[] }
    | { type: "ordered-list"; items: string[] }
    | { type: "image"; src: string; alt?: string; caption?: string };

export type Article = {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: ContentBlock[];
    category: string;
    author: {
        name: string;
        avatar: string;
    };
    image: string;
    publishedAt: string;
    featured: boolean;
    tags: string[];
};

export type ApiResponse<T> = {
    success: boolean;
    data: T;
};
