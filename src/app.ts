import express, { Application } from "express"

const app: Application = express()
app.use(express.json())

const PORT: number = 3000

app.listen(() => console.log(`Server is running on http://localhost:${PORT}`))