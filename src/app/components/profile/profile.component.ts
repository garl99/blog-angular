import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/post';
import { User } from '../../models/user';
import { PostService} from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { global } from '../../services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [PostService,UserService]
})
export class ProfileComponent implements OnInit {

  public url;
  public posts: Array<Post>; 
  public status;
  public identity;
  public token;
  public user: User;

  constructor(
    private _postService: PostService,
    private _userService: UserService,
    private _router:Router,
    private _route:ActivatedRoute
    
    ) { 

    this.url=global.url;
    this.token=this._userService.getToken();
    this.identity=this._userService.getIdentity();

  }

  ngOnInit() {

    this.getProfile();

  }


  getProfile(){

    this._route.params.subscribe(

      params => {

        let userId= +params['id'];
        this.getUser(userId);
        this.getPosts(userId);

      }
    );
  }

  getUser(userId){

    this._userService.getUser(userId).subscribe(

      response  => {

        if(response.status=='success'){
          
          this.user=response.user;
          this.status=response.status;
          console.log(this.user);

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

  getPosts(userId){

    this._userService.getPosts(userId).subscribe(

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

        this.getProfile();

      },

      error => {
        console.log(<any>error);
      }

    );

  }

}
