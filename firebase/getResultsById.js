import { doc, collection, getDoc } from "firebase/firestore";
import { db } from "./app.js";

async function getResultsById(runId, resultId) {
  try {
    const collectionRef = collection(db, "runs", runId, "results");
    const docSnapshot = await getDoc(doc(collectionRef, resultId));
    console.log(docSnapshot.data());

    return docSnapshot.data();
  } catch (e) {
    console.error("There is a problem with the result you are trying to get:" + e);
  }
}

export default getResultsById;

getResultsById("jKuGrmmqhsoABp2qgWOY", "nq6Qf1mOjudbVSoYsx94");
