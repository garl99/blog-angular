import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from './services/user.service';
import { global } from './services/global';
import { NgxSpinnerService } from "ngx-spinner";
import { CategoryService } from 'src/app/services/category.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[UserService,CategoryService]
})
export class AppComponent implements OnInit, DoCheck {
  public title = 'Blog angular';
  public token:string;
  public identity:string;
  public url;
  public categories;
  public status;

  constructor(
    private _userService: UserService,
    private spinner: NgxSpinnerService,
    private _categoryService: CategoryService
    
  ){
    this.load();
    this.url=global.url;
  }

  ngOnInit(){
    console.log('Funciona correctamente');
    this.getCategories();
  }

  ngDoCheck(){
    this.load();
  }

  load(){
    this.identity=this._userService.getIdentity();
    this.token=this._userService.getToken();
  }

  loading(){
    this.spinner.show();
 
    setTimeout(() => {
      /** spinner ends after 3 seconds */
      this.spinner.hide();
    }, 3000);
  }

  getCategories(){

     this._categoryService.getCategories().subscribe(
      
        response =>{

          if(response.status == 'success'){
              this.status=response.status;
              this.categories=response.categories;
          }
          else{
            this.status='error';
          }


        },
       
        error => {
          this.status='error';
          console.log(<any>error);
        }


     );


  }
}
