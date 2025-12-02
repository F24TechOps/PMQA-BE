import { collection, addDoc } from "firebase/firestore"
import { db } from "./app.js";


async function postUpload(expectedFields){
    const data = {"expectedFields" : [...expectedFields]}
    try{
        const collectionRef = collection(db, "uploads")
        const docSnapshot = await addDoc(collectionRef, data)
        return docSnapshot.id
    }
    catch (e){
        console.error("Could not upload expected fields " + e);
    }
}

export default postUpload

