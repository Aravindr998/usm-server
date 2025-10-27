import app from "./app"
import { connectDB } from "./config/db"
import { ENV } from "./config/env"
import { logger } from "./utils/logger"

const { PORT, NODE_ENV } = ENV

const startServer = async() => {
    try {
        await connectDB()
        app.listen(PORT, () => {
          logger.info(`Server running on Port ${PORT} in ${NODE_ENV} mode`)
        })
    } catch (err) {
        logger.error("❌ Failed to start the server", err);
        process.exit(1);
    }

}

startServer()