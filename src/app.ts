import express, { Application } from "express"
import { allPurchaseList, createPurchaseList, deleteItemData, deleteList, getPurchaseListById, updateItemFromData } from "./logic"
import { checkDatabase, ifIdExists, validateBody } from "./middlewares"

const app: Application = express()
app.use(express.json())

const PORT: number = 3000

app.post("/purchaseList", validateBody, createPurchaseList)
app.get("/purchaseList", checkDatabase, allPurchaseList)
app.get("/purchaseList/:purchaseListId", checkDatabase, ifIdExists, getPurchaseListById)
app.patch("/purchaseList/:purchaseListId/:itemName", checkDatabase, ifIdExists, updateItemFromData)
app.delete("/purchaseList/:purchaseListId/:itemName", checkDatabase, ifIdExists, deleteItemData)
app.delete("/purchaseList/:purchaseListId", checkDatabase, ifIdExists, deleteList)

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))