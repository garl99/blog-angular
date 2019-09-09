import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { global } from '../../services/global';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService]
})
export class UserEditComponent implements OnInit {

  public page_title:string;
  public user:User;
  public token;
  public identity;
  public status;
  public url;
  
  public froala_options: Object = {
    charCounterCount: true,
    language: 'es',
    toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat',],
    toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat',],
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat',],
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat',],
  };



  public afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png,.gif,.jpeg",
    maxSize: "50",
    uploadAPI:  {
      url: global.url+'user/upload',
      headers: {
     "Authorization" : this._userService.getToken()
      }
    },
    theme: "attachPin",
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    attachPinText: 'Sube tu foto de perfil aqui'

};


  constructor(
    private _userService: UserService
  ) {
    this.page_title='Ajustes de usuario';
    this.user= new User(1,'','','ROLE_USER','','','','');
    this.token=this._userService.getToken();        //Token en LocalStorage
    this.identity=this._userService.getIdentity();  //Identity en LocalStorage
    this.url=global.url;
    
    //Llenar usuario con los datos de identity que estan en LocalStorage
    this.user= new User(
        this.identity.sub,
        this.identity.name,
        this.identity.surname,
        'ROLE_USER',
        this.identity.email,
        '',
        this.identity.description,
        this.identity.image  
    );
    
   }

  ngOnInit() {
    
  }

  onSubmit(form){

    this._userService.update(this.user,this.token).subscribe(
      
      
      response => {

        if(response.status=='success'){
          
          this.status=response.status;

          //Actualizar usuario en sesión

          if(response.changes.name){
            this.user.name = response.changes.name; 
          }
          if(response.changes.surname){
            this.user.surname = response.changes.surname ;
          }
          if(response.changes.email){
            this.user.email = response.changes.email ;
          }
          if(response.changes.description){
            this.user.description = response.changes.description; 
          }
          if(response.changes.image){
            this.user.image = response.changes.image; 
          }
          
          this.identity=this.user;
          localStorage.setItem('identity',JSON.stringify(this.identity));
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
  
  }

  avatarUpload(datos){
    let data= JSON.parse(datos.response);
    this.user.image = data.image;
  }

}
