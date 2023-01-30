import { iDatabase } from "../../interfaces";

declare global {
    namespace Express {
      interface Request {
        userListCreate: Omit<iDatabase, "id">,
        listId: number
      }
    }
}