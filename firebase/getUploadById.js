import { doc, collection, getDoc } from "firebase/firestore";
import { db } from "./app.js";

async function getUploadById(uploadId) {
    try{
        const docSnapshot = await getDoc(doc(collection(db, "uploads"), uploadId))
        return docSnapshot.data()
    }
    catch (e) {
        console.error("this has errored " + e);
    }
}

export default getUploadById