import { collection, addDoc } from "firebase/firestore"
import { db } from "./app.js";

async function makeResults(data){
    try{
        const collectionRef = collection(db, "runs/lfHJYsvVJ8LBQGWeJ2nm/results")
        const docSnapshot = await addDoc(collectionRef, data)
        console.log(docSnapshot)
    }
    catch(e){
        console.error("this has errored " + e);

    }
}

const runId = "rL6VEnJt4kEEzd69qu7M"
const data = {"test": "true"}

makeResults(data)