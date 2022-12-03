import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, addDoc, getDocs, deleteDoc, doc, getDoc, setDoc } from '@angular/fire/firestore';

export class Todo {
  $key: string;
  title: string;
  done: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private auth: Auth, private fire: Firestore) { }

  async create(todo: Todo) {
    const user = this.auth.currentUser;
    try {
      const docRef = await addDoc(collection(this.fire, user.uid), {
        title: todo.title,
        done: false
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async getTasks(): Promise<Todo[]> {
    const user = this.auth.currentUser;
    const d = await getDocs(collection(this.fire, user.uid));
    let tasks = [];
    d.forEach(doc => {
      tasks.push({ done: doc.data().done, title: doc.data().title, id: doc.id })
    });
    console.log(tasks);
    return tasks;

  }

  async markDone(id: string) {
    const a = getDoc(doc(this.fire, "tasks", id))
    const doneAtm = (await a).data().done

    if (doneAtm == false) {
      const docRef = doc(this.fire, "tasks", id);
      const data = {
        done: true
      };
      setDoc(docRef, data, { merge: true })
        .then(docRef => {
          console.log("Entire Document has been updated successfully");
        })
        .catch(error => {
          console.log(error);
        })
    } else {
      const docRef = doc(this.fire, "tasks", id);
      const data = {
        done: false
      };
      setDoc(docRef, data, { merge: true })
        .then(docRef => {
          console.log("Entire Document has been updated successfully");
        })
        .catch(error => {
          console.log(error);
        })
    }
  }

  async delete(id: string) {
    const user = this.auth.currentUser;
    await deleteDoc(doc(this.fire, user.uid, id));
  }

}
