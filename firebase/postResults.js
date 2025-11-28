import { collection, addDoc } from "firebase/firestore";
import { db } from "./app.js";

async function postResults(runId, resultData) {
  try {
    const collectionRef = collection(db, "runs", runId, "results");
    const docSnapshot = await addDoc(collectionRef, resultData);
    return docSnapshot.id;
  } catch (e) {
    console.error("There was a problem trying to upload a result " + e);
  }
}

export default postResults;
