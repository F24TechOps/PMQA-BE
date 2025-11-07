import { doc, collection, getDoc } from "firebase/firestore";
import { db } from "./app.js";

async function getRunById(runId) {
    try{
        const docSnapshot = await getDoc(doc(collection(db, "runs"), runId))
        return docSnapshot.data()
    }
    catch (e) {
        console.error("this has errored " + e);
    }
}

export default getRunById