export interface ITask {
    id?: number;
    description: string;
    priority: boolean;
    status: boolean;
    categories: number[];
}

export interface ICategory {
    id?: number;
    title: string;
}