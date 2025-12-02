import { collection, doc, deleteDoc } from "firebase/firestore";
import { db } from "./app.js";

async function deleteRun(runId) {
    try{
         await deleteDoc(doc(collection(db, 'runs'), runId))
    }
    catch (e) {
        console.error("Run could not be deleted " + e);
    }
}

export default deleteRun;