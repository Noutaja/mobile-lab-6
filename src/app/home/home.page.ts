import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';

export class Todo {
  $key: string;
  title: string;
  done: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  profile = null;
  todoForm: FormGroup;
  Tasks: Todo[];

  constructor(
    private authService: AuthService,
    private router: Router,
    private firebaseService: FirebaseService,
    public formBuilder: FormBuilder, 
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {  }

  
  async ngOnInit() {
		this.todoForm = this.formBuilder.group({
			title: ['']
		});
    this.Tasks =  await this.firebaseService.getTasks();
	}

  onSubmit() {
    if (!this.todoForm.valid) {
      return false;
    } else {
      this.firebaseService.create(this.todoForm.value)
      .then(() => {
        this.todoForm.reset();
      }).catch((err) => {
        console.log(err)
      });
    }
  }

  remove(id) {
    console.log(id)
    if (window.confirm('Are you sure?')) {
      this.firebaseService.delete(id)
    }
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  done(id) {
    this.firebaseService.markDone(id)
  }
}
