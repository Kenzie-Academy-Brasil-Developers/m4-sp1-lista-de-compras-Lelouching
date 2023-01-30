export interface iDatabase {
    id: number,
    listName: string,
    data: iUserData[]
}

export interface iUserData {
    name: string,
    quantity: string
}

export type validatedKeysBody = "listName" | "data"

export type validatedKeysData = "name" | "quantity"