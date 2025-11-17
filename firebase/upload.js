import { collection, addDoc } from "firebase/firestore";
import { db } from "./app.js";

async function addUpload(name) {
  try {
    const docRef = await addDoc(collection(db, "uploads"), {
      name: name,
    });
    console.log("document added with id", docRef.id);
  } catch (e) {
    console.error("this has errored" + e);
  }
}

//Not in use