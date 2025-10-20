import { doc, collection, getDoc } from "firebase/firestore";
import { db } from "./app.js";

async function getRunState(runId) {
    try{
        const docSnapshot = await getDoc(doc(collection(db, "runs"), runId))
        //console.log("Document was found at:", docSnapshot.data())
        return docSnapshot.data()
    }
    catch (e) {
        console.error("this has errored " + e);
    }
}

export default getRunState