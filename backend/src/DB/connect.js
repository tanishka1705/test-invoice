import { connect } from 'mongoose'

const Connect = async () => {
    try {
        const client = await connect(process.env.URL)
        console.log(`MongoDB Connected: ${client.connection.name}`);

    }
    catch (err) {
        console.log(err)
        process.exit(1)
    }
}

export default Connect