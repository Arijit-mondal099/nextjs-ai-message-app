import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
    console.error("Database connection string not provided!")
    process.exit(1)
}

// declare global cached varibale
declare global {
  var mongoose: {
    conn: mongoose.Connection | null
    promise: Promise<mongoose.Connection> | null
  }
}

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

export async function dbConnection() {
    if (cached.conn) {
        console.log("DB alredy connected")
        return cached.conn
    }

    try {
        if (!cached.promise) {
            cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }).then((m) => m.connection)
        }
        
        cached.conn = await cached.promise
        console.log("DB Connected")

        return cached.conn
    } catch (error: unknown) {
        cached.promise = null
        console.error("DB connection error", error)
        process.exit(1)
    }
}
