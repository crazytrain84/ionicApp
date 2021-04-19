import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx'
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import {Location} from '@angular/common';


export interface Ingredient {
  id?: string,
  name: string
}

export interface Recipe {
  id?: string,
  imageURL: string,
  ingredients: string,
  title: string,
  directions: string
}


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  data: any;
  text: string;
  ingredients: any = [];
  recipes: any = [];
  scannedIngredient: any;
  ingredientExists: boolean = false;
  recipeExists: boolean = false;
  myRecipeExists: boolean = false;
  ingredientList = [];
  recipeList = [];
  splitList = [];
  keys = [];
  values = [];
  ingredientCount: number = 0;
  ingredientName: string;

  constructor(
    private _location: Location,
    private navCtrl: NavController,
    private barcodeScanner: BarcodeScanner,
    private afFirestore: AngularFirestore
  ) {}

  ngOnInit() {

  }
  
  scan() {
    this.barcodeScanner.scan().then(barcodeData => {
        
        this.ingredientExists = false;
        this.afFirestore.collection<Ingredient>('ingredients').snapshotChanges().subscribe(res => {
          res.forEach(ingredient => {
            if (ingredient.payload.doc.data().id == barcodeData.text) {
              this.scannedIngredient = { key: ingredient.payload.doc.id, ...ingredient.payload.doc.data() };
            }
          })
          if (this.scannedIngredient != '') {
             this.keys = Object.keys(this.scannedIngredient);
             this.values = Object.values(this.scannedIngredient);  
             for (let i = 0; i < this.keys.length; i++) {
               if (this.keys[i] == 'name') {
                 this.ingredientName = this.values[i];
               }
             }
             this.ingredientList.forEach(ingredient => {
                if (this.ingredientName == ingredient.name) {
                  this.ingredientExists = true;
                }
             })
          }

          if (this.ingredientExists == false) { 
            this.ingredientList.push(this.scannedIngredient);
            this.ingredients = this.ingredientList;
          }
        })
        
    }).catch(err => {
      console.log('Error', err);
      this.text = "Error Scanning";
    })
  }

  findRecipes() {
    if (this.ingredientList.length > 0) {
      this.afFirestore.collection<Recipe>('recipes').snapshotChanges().subscribe(res => {
        res.forEach(recipe => {
            this.ingredientCount = 0;
            this.splitList = recipe.payload.doc.data().ingredients.split(",");
            this.ingredientList.forEach(ingredient => {
              for (let i = 0; i < this.splitList.length; i++) {
                if (ingredient.name == this.splitList[i]) {
                  this.ingredientCount ++;
                }
              }
            })
            if ((this.ingredientCount == this.splitList.length) && this.ingredientCount != 0 ){
              this.recipeList.forEach(recipe => {
                if (recipe.title == recipe.payload.doc.data().title) {
                  this.recipeExists = true;
                }
              })
              if (this.recipeExists == false) {
                this.recipeList.push({ key: recipe.payload.doc.id, ...recipe.payload.doc.data() });
                this.recipes = this.recipeList;
              }
            }
          
        })

      })
    }
  }
  
  clear() {
    location.reload();
  }

  logout() {
    this.navCtrl.navigateForward('/login');
  }

  go2myRecipes() {
    this.navCtrl.navigateForward('/tab3');
  }

  addIngredient(ingredient2Add) {
    this.ingredientExists = false;
    this.afFirestore.collection<Ingredient>('ingredients').snapshotChanges().subscribe(res => {
      res.forEach(ingredient => {
        if (ingredient.payload.doc.data().name == ingredient2Add) {
          this.scannedIngredient = { key: ingredient.payload.doc.id, ...ingredient.payload.doc.data() };
        }
      })
      if (this.scannedIngredient != '') {
         this.keys = Object.keys(this.scannedIngredient);
         this.values = Object.values(this.scannedIngredient);  
         for (let i = 0; i < this.keys.length; i++) {
           if (this.keys[i] == 'name') {
             this.ingredientName = this.values[i];
           }
         }
         this.ingredientList.forEach(ingredient => {
            if (this.ingredientName == ingredient.name) {
              this.ingredientExists = true;
            }
         })
      }

      if (this.ingredientExists == false) { 
        this.ingredientList.push(this.scannedIngredient);
        this.ingredients = this.ingredientList;
      }
    })
  }

  addRecipe(myRecipe) {
    this.myRecipeExists = false;
    this.afFirestore.collection<Recipe>('storedRecipes').snapshotChanges().subscribe(res => {
      res.forEach(recipe => {
        if (recipe.payload.doc.data().title == myRecipe.title) {
          this.myRecipeExists = true;
        }
      })
    })
    if (this.myRecipeExists == false) {
      console.log("hello");
      const myNewRecipe = this.afFirestore.collection<Recipe>('storedRecipes').doc();
       myNewRecipe.set(myRecipe);
    }
  }

}
