import { collection, addDoc } from "firebase/firestore"
import { db } from "./app.js";


async function postRun(transactionContext, uploadId){
    const data = {
        createdAt: new Date(),
        cyclrInfo: {
            accountId: transactionContext.accountId,
            cycleId: transactionContext.cycleId,
            transactionId: transactionContext.transactionId
        },
        updatedAt: new Date(),
        uploadId: uploadId
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