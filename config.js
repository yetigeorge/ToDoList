import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB2zOFXtc9eoLmRUjcM_0TjYaQbNBicRZg",
    authDomain: "todo-app-b908a.firebaseapp.com",
    projectId: "todo-app-b908a",
    storageBucket: "todo-app-b908a.appspot.com",
    messagingSenderId: "422032154149",
    appId: "1:422032154149:web:5b93e481162cbe1c2b29cc"
  };
  
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

    export  {db};