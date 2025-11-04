import { collection, addDoc } from "firebase/firestore"
import { db } from "./app.js";


async function postRun(transactionContext){
    const data = {
        createdAt: new Date(),
        cyclrInfo: {
            accountId: transactionContext.accountId,
            cycleId: transactionContext.cycleId,
            transactionId: transactionContext.transactionId
        },
        updatedAt: new Date(),
        uploadId: "Jji2XpCSvHT0jyyOHtLc"
    }
    try{
        const collectionRef = collection(db, "runs")
        const docSnapshot = await addDoc(collectionRef, data)
        return docSnapshot.id
    }
    catch (e){
        console.error("this has errored " + e);
 
    }
}

export default postRun

// const transactionContext = {
//     accountId: "08f26e79-338c-4841-bf47-e88ea8da17ef",
//     cycleId: "7fcb9aae-c368-46cc-9fd2-4cba6184c90d",
//     transactionId: "fa2b0e26-fa3e-4678-97dc-10811cfab126" 
// }
// postRun(transactionContext)