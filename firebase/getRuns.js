import { collection, getDocs } from "firebase/firestore";
import { db } from "./app.js";

async function getRuns() {
    const allDocArray = []
    try{
        const querySnapshot = await getDocs(collection(db, 'runs'))
        querySnapshot.forEach((doc) => {
            allDocArray.push({
                runId: doc.id,
                ...doc.data()
            });
        });

        return allDocArray
    }
    catch (e) {
        console.error("this has errored " + e);
    }
}

export default getRuns