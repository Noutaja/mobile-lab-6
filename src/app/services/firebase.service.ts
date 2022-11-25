import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, deleteDoc, doc, getDoc } from '@angular/fire/firestore';

export class Todo {
  $key: string;
  title: string;
  done: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private fire: Firestore) { }

  async create(todo: Todo) {
    try {
      const docRef = await addDoc(collection(this.fire, "tasks"), {
        title: todo.title,
        done: false
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async getTasks(): Promise<Todo[]> {
    const d = await getDocs(collection(this.fire, "tasks"));
    let tasks = [];
    d.forEach(doc => {
      tasks.push({ done: doc.data().done, title: doc.data().title})
    });
    console.log(tasks);
    return tasks;

  }

  async delete(id: string) {
    await deleteDoc(doc(this.fire, "tasks", id));
  }

}
