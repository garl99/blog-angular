import { Component, OnInit } from '@angular/core';
import { User} from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})
export class RegisterComponent implements OnInit {

  public page_title: string;
  public user: User;
  public status:string;
  public status2:string;
  public cPass:string;
  
  constructor(
    private _userService: UserService
  ) {
    this.page_title= 'Registrate';
    this.user= new User(1,'','','ROLE_USER','','','','');

  }

  ngOnInit() {
    console.log('Componente de registro funciona!');
  }

  onSubmit(form){

    if(this.user.password!=this.cPass){
      this.status2='error2';
    }
    else{
      this._userService.register(this.user).subscribe(
        response => {
          if(response.status=='success'){
            this.status=response.status;
            this.status2='';
            form.reset();
          }
          else{
            this.status='error';
            this.status2='';
          }
          //console.log(response);
  
        },
        error => {
          this.status='error';
          this.status2='';
          console.log(<any>error);
        }
      );
    }
  }

}
