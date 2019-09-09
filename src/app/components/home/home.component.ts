import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/post';
import { PostService} from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { global } from '../../services/global';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [PostService,UserService]
})
export class HomeComponent implements OnInit {

  public page_title:string;
  public url;
  public posts: Array<Post>; 
  public status;
  public identity;
  public token;

  constructor(private _postService: PostService,private _userService: UserService) { 
    this.page_title = 'Bienvenido';
    this.url=global.url;
    this.token=this._userService.getToken();
    this.identity=this._userService.getIdentity();

  }

  ngOnInit() {

    this.getPosts();

  }


  getPosts(){

    this._postService.getPosts().subscribe(

      response  => {

        if(response.status=='success'){
          
          this.posts=response.posts;
          this.status=response.status;
          //console.log(this.posts);

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

  deletePost(id){

    this._postService.delete(this.token,id).subscribe(

      response  => {    
        this.getPosts();   
      },

      error => {
        console.log(<any>error);
      }

    );

  }


}
