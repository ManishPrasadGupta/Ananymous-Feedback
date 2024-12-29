import mongoose from "mongoose";


type ConnectionObject  = {
    isConnected?: number //`?` is used because ConnectionObject is option adn below we kept connection empty.
}

const connection: ConnectionObject = {}  

//value jo database se return hoga woh Promise hoga,Aur promise ke andar jo value hoga usshe khashmatlab nahi toh `void` rakhunga.
async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        console.log('Already connected to the database');
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URL || '', {}); // yaya {} use liya hun bass yeh dikhane ke liye ki mongoose se database connection ke liye aur bhi options hota hain.
        console.log(db);
        //
        connection.isConnected = db.connections[0].readyState;
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);

    // Graceful exit in case of a connection error
    process.exit(1);
    }
}

export default dbConnect;