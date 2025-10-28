export interface Book {
    _id: string;
    title: string;
    author: string;
    genre: string;
    price: number;
    stock: number;
    publishedYear?: number;
    createdAt: string;
}