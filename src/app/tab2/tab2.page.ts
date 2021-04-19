import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';
import {Location} from '@angular/common';

export interface Recipe {
  id?: string,
  imageURL: string,
  ingredients: string,
  title: string,
  directions: string
}


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  text: string;
  URL: string;
  title: string;
  directions = [];
  constructor(
    private _location: Location,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private afFirestore: AngularFirestore
  ) {}
  
  ngOnInit() {
    const recipeID: string = this.route.snapshot.paramMap.get('id');
    this.afFirestore.collection<Recipe>('recipes').snapshotChanges().subscribe(res => {
      res.forEach(recipe => {
        if (recipeID == recipe.payload.doc.data().id) {
          this.directions = recipe.payload.doc.data().directions.split("|");
          this.URL = recipe.payload.doc.data().imageURL;
          this.title = recipe.payload.doc.data().title;
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

}