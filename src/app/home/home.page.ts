import { CommonModule, NgFor } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonRefresher, 
  IonRefresherContent, 
  IonList, 
  IonButtons, 
  IonButton, 
  IonIcon, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonModal, 
  IonItemSliding, 
  IonItemOption, 
  IonItemOptions,
  IonFab,
  IonFabButton
} from '@ionic/angular/standalone';
import { Task } from './task';
import { initializeApp } from "firebase/app";
import { getDatabase, set, ref, get, update, remove, onValue } from 'firebase/database';
import { Observable } from 'rxjs';
import { add, checkmark, trash } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';

const firebaseConfig = {
  apiKey: "AIzaSyCrncOoK7RLzg3mVzqH9gpby9sMU076X-I",
  authDomain: "todoionic-b2a80.firebaseapp.com",
  databaseURL: "https://todoionic-b2a80-default-rtdb.firebaseio.com",
  projectId: "todoionic-b2a80",
  storageBucket: "todoionic-b2a80.appspot.com",
  messagingSenderId: "400847149835",
  appId: "1:400847149835:web:e4f3e7e476bcfac4bc600e"
};


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [FormsModule, IonItemOptions, IonItemOption, IonItemSliding, IonInput, IonModal, NgFor, IonLabel, IonItem, IonIcon, IonButton, IonButtons, CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonList, IonFab, IonFabButton],
})
export class HomePage {
  @ViewChild(IonModal) modal: IonModal;
  protected readonly toast = toast;
  name: string = '';
  // count: number = 0;
  tasks: Array<Task> = [];

  theNewTask: string|null = "";
  app = initializeApp(firebaseConfig);
  db = getDatabase(this.app);
  
  constructor() {
    addIcons({ add, checkmark, trash });
    
    const dataListRef = ref(this.db, 'tasks');
    onValue(dataListRef, (snapshot) => {
      const data = snapshot.val();
      this.tasks = []; // Reiniciar la lista de tareas
      // this.count = 0;
      if (data == null) return;
      // this.tasks = []; // Reiniciar la lista de tareas
      snapshot.forEach((childSnapshot) => {
        const key = childSnapshot.key; // Obtener el ID del documento
        console.log('key:', key)
        const element = childSnapshot.val();
        console.log('element:', element)
        this.tasks.push({id: key, title: element.title, status: element.status});
      });
      // this.count = this.tasks.length;
    });

    // this.count = this.tasks.length;
  }

  addItem() {
    
    if (this.name != '') {
      // this.count++;
      set(ref(this.db, 'tasks/' + this.name), {
        title: this.name,
        status: 'open'
      }).then( () => {
        // alert("Data addedd succesfully");
        this.name = '';
        this.modal.dismiss(this.name, 'confirm');
        toast.success('Task added successfully');
      })
      .catch( (error) => {
        alert("Error");
        console.log(error);
      });
      //this.tasks.push({title: this.theNewTask, status: 'open'});
    }
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  trackItems(index: number, itemObject: any) {
    return itemObject.title;
  }

  markAsDone(slidingItem: IonItemSliding, task: Task) {
    update(ref(this.db, 'tasks/' + task.id), {
      title: task.title,
      status: 'done'
    }).then( () => {
      // alert("Data addedd succesfully");
      toast.info('Task marked as done');
    })
    .catch( (error) => {
      alert("Error");
      console.log(error);
    })

    setTimeout( () => { slidingItem.close() }, 2);
  }

  removeTask(slidingItem: IonItemSliding, task: Task) {
    /*task.status = "removed";
    let index = this.tasks.indexOf(task);
    if (index > -1)
      this.tasks.splice(index, 1);*/
    remove(ref(this.db, 'tasks/' + task.id)).then( () => {
      // alert("Data deleted succesfully");
      toast.success('Task removed successfully');
    })
    .catch( (error) => {
      alert("Error");
      console.log(error);
    })
    setTimeout( () => { slidingItem.close() }, 2);
  }

  getTaskFromFirebase() {
    const dataListRef = ref(this.db, 'tasks');
    onValue(dataListRef, (snapshot) => {
      const data = snapshot.val();
      if (data == null) return;
      this.tasks = []; // Reiniciar la lista de tareas
      snapshot.forEach((childSnapshot) => {
        const key = childSnapshot.key; // Obtener el ID del documento
        const element = childSnapshot.val();
        this.tasks.push({id: key, title: element.title, status: element.status});
      });
    });
  }
  
}
