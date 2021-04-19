import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';
import {Location} from '@angular/common';


export interface storedRecipe {
  id?: string,
  imageURL: string,
  ingredients: string,
  title: string,
  directions: string
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  recipes: any = [];
  index: number = 0;
  constructor(
    private _location: Location,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private afFirestore: AngularFirestore   
  ) {}

  ngOnInit() {
    this.afFirestore.collection<storedRecipe>('storedRecipes').snapshotChanges().subscribe(res => {
      res.forEach(recipe => {
        if (recipe.payload.doc.data().id != "") {
          if (recipe.payload.doc.data().id != '') {
            this.recipes.push({ key: recipe.payload.doc.id, ...recipe.payload.doc.data() });
          }
        }
      })
    })
  }

  logout() {
    this.navCtrl.navigateForward('/login');
  }

  goBack() {
    this._location.back();
  }

  removeRecipe(myRecipe) {
    this.afFirestore.collection<storedRecipe>('storedRecipes').snapshotChanges().subscribe(res => {
      res.forEach(recipe => {
        if (recipe.payload.doc.data().title == myRecipe.title) {
          this.afFirestore.collection<storedRecipe>('storedRecipes').doc(recipe.payload.doc.id).delete();
          this.recipes.forEach(localRecipe => {
            if (localRecipe.title == myRecipe.title) {
               this.recipes.splice(this.index, 1);
            }
            this.index++;
          })
        }
      })
    })
    
  }

}

