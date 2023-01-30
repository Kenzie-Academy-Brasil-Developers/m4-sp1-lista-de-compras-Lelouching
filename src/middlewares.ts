import { database } from "./database"
import { Request, Response, NextFunction } from "express"
import { iUserData, validatedKeysBody, validatedKeysData } from "./interfaces"

export const validateBody = (req: Request, res: Response, next: NextFunction): Response | void => {
    try {
        const objectKeysBody: string[] = Object.keys(req.body)
        const validateKeysBody: validatedKeysBody[] = ["listName", "data"]

        const validatingObjectKeysBody = validateKeysBody.every((key: string ) => objectKeysBody.includes(key))

        if(typeof req.body.listName !== "string") {
            return res.status(400).json({
                message: "The listName needs to be a string"
            })
        }

        if(!validatingObjectKeysBody) {
            return res.status(400).json({
                message: `Required keys are: ${validateKeysBody.join(", ")}`
            })
        }

        if(objectKeysBody.length >= 3) {
            return res.status(400).json({
                message: `Keys only allowed are: ${validateKeysBody.join(", ")}`
            })
        }

        const ObjectKeysUserData: iUserData[] = req.body.data
        const validateKeysUserData: validatedKeysData[] = ["name", "quantity"]

        const validatingObjectKeysData = ObjectKeysUserData.map((data) => validateKeysUserData.every((key: string) => Object.keys(data).includes(key)))
        
        if(validatingObjectKeysData.includes(false)) {
            return res.status(400).json({
                message: `Required keys are: ${validateKeysUserData.join(", ")}`
            })
        }

        if(!ObjectKeysUserData.every(data => Object.keys(data).length === validateKeysBody.length)) {
            return res.status(400).json({
                message: `Keys only allowed are: ${validateKeysUserData.join(", ")}`
            })
        }

        req.userListCreate = req.body
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }

    next()
}

export const checkDatabase = (req: Request, res: Response, next: NextFunction): Response | void => {
    try {
        if(database.length === 0) {
            return res.status(404).json({
                message: "There aren't any list on database yet"
            })
        }
    } catch (error: unknown) {
        return res.status(500).json({
            message: error
        })
    }

    next()
}

export const ifIdExists = (req: Request, res: Response, next: NextFunction): Response | void => {
    try {
        const listId = Number(req.params.purchaseListId)
        const findListId = database.find((data) => data.id === listId)

        if(!findListId) {
            return res.status(404).json({
                message: `List with id ${listId} does not exists`
            })
        }

        req.listId = listId
    } catch (error: unknown) {
        return res.status(500).json({
            message: error
        })
    }

    next()
}