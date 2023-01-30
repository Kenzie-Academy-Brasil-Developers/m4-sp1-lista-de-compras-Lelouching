import { Request, Response } from "express"
import { database, ids } from "./database"
import { validatedKeysData } from "./interfaces"

export const createPurchaseList = (req: Request, res: Response): Response => {
    try {
        const id: number = ids.length
        ids.push(id)
        
        const purchaseList = {id: id, ...req.body}
        database.push(purchaseList)

        return res.status(201).json(purchaseList)
    } catch (error: unknown) {
        return res.status(500).json({
            message: error
        })
    }
}

export const allPurchaseList = (req: Request, res: Response): Response => {
    try {
        return res.status(200).json(database)
    } catch (error: unknown) {
        return res.status(500).json({
            message: error
        })
    }
}

export const getPurchaseListById = (req: Request, res: Response): Response => {
    try {
        const findListId = database.find((data) => data.id === req.listId)
        return res.status(200).json(findListId)
    } catch (error: unknown) {
        return res.status(500).json({
            message: error
        })
    }
}

export const updateItemFromData = (req: Request, res: Response): Response => {
    try {
        const requiredKeys: validatedKeysData[] = ["name", "quantity"]
        const objectKeys: string[] = Object.keys(req.body)

        const validatingRequiredKeys = requiredKeys.some((key: string) => objectKeys.includes(key))

        const findWrongKey: string[] = ["name", "quantity"]

        const isKeyWrong = objectKeys.every(key => findWrongKey.includes(key))

        if(!validatingRequiredKeys || !isKeyWrong) {
            return res.status(400).json({
                message: `Required keys are: ${requiredKeys.join(" or ")}`
            })
        }

        if(objectKeys.length > requiredKeys.length) {
            return res.status(400).json({
                message: `Only allowed keys are: ${requiredKeys.join(", ")}`
            })
        }

        if(typeof req.body.name !== "string" || typeof req.body.quantity !== "string") {
            return res.status(400).json({
                message: "The keys field should be a string"
            })
        }

        let indexList = 0
        const findListId = database.find((data, index) => {
            if(data.id === req.listId) {
                indexList = index
                return data
            }
        })

        const updateItem = findListId?.data.find((item, index) => {
            if(item.name === req.params.itemName) {
                findListId.data[index] = req.body
                return true
            }
        })

        if(!updateItem) {
            return res.status(404).json({
                message: `Item with name ${req.params.itemName} does not exists`
            })
        }

        database[indexList] = findListId!

        return res.status(200).json(req.body)
    } catch (error: unknown) {
        return res.status(500).json({
            message: error
        })
    }
}

export const deleteItemData = (req: Request, res: Response): Response => {
    try {
        let listIndex = 0
        const findListId = database.find((list, index) => {
            if(list.id === Number(req.params.purchaseListId)) {
                listIndex = index
                return list
            }
        })

        const findItemName = findListId?.data.find((item, index) => {
            if(item.name === req.params.itemName) {
                findListId.data.splice(index, 1)
                return true
            }
        })

        if(!findItemName) {
            return res.status(404).json({
                message: `Item name ${req.params.itemName} does not exists`
            })
        }

        database[listIndex] = findListId!

        return res.status(204).send()
    } catch (error: unknown) {
        return res.status(500).json({
            message: error
        })
    }
}

export const deleteList = (req: Request, res: Response): Response => {
    try {
        database.find((list, index) => {
            if(list.id === Number(req.params.purchaseListId)) {
                database.splice(index, 1)
            }
        })

        return res.status(204).send()
    } catch (error: unknown) {
        return res.status(500).json({
            message: error
        })
    }
}