import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[UserService, NgxSpinnerService]
})
export class LoginComponent implements OnInit {

  public page_title: string;
  public user:User;
  public status:string;
  public token:string;
  public identity:string;
  
  constructor(
    private _userService: UserService,
    private _router:Router,
    private _route:ActivatedRoute,
    private spinner: NgxSpinnerService

  ) {
    this.page_title = 'Identificate';
    this.user= new User(1,'','','ROLE_USER','','','','');

  }

  ngOnInit() {

    //Se ejecuta siempre y solo cierra sesion cuando le llega el parametro sure por la url
    this.logout();
  }

  onSubmit(form){
    this._userService.login(this.user).subscribe(
      
      response =>{
        
        if(response.status!='error'){

          //TOKEN
          this.status='success';
          this.token=response;

          //OBJETO
          this._userService.login(this.user,true).subscribe(
      
            response =>{
              this.identity=response;
              //console.log(this.identity);
              //console.log(this.token);

              //PERSISTIR DATOS DE USUARIO
              localStorage.setItem('token',this.token);
              localStorage.setItem('identity',JSON.stringify(this.identity));

              //REDICCIONAR A INICIO

              this._router.navigate(['inicio']);

            },
            error => {
              console.log(<any>error);
              this.status='error';
            }
            
          );

        }
        else{
          this.status='error';
        }
      
      
      },
      error => {
        console.log(<any>error);
        this.status='error';
      }
      
    );

    this.spinner.show();
 
    setTimeout(() => {
      /** spinner ends after 3 seconds */
      this.spinner.hide();
    }, 3000);
  }

  logout(){

    this._route.params.subscribe( params =>{

        let logout= +params['sure'];

          if(logout==1){

            localStorage.removeItem('token');
            localStorage.removeItem('identity');
            this.token=null;
            this.identity=null;

            //REDICCIONAR A INICIO

            this._router.navigate(['inicio']);
            
          }

        }
    );

  }

}
