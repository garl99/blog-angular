import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/post';
import { PostService } from '../../services/post.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
  providers: [PostService, UserService]
})
export class PostDetailComponent implements OnInit {

  public status:string;
  public post: Post;
  public identity;

  constructor(

    private _postService: PostService,
    private _userService: UserService,
    private _router:Router,
    private _route:ActivatedRoute

    ) { 

      this.identity=this._userService.getIdentity();

    }

  ngOnInit() {
    this.getPost();
  }

  getPost(){

    //Sacar id del post de la url

    this._route.params.subscribe(

      params => {

        let id= +params['id'];

        //Peticion ajax del servicio post para conseguir los detalles

        this._postService.getPost(id).subscribe(

          response => {

            if(response.status == 'success'){

              this.status=response.status;
              this.post=response.post;
              console.log(this.post);

            }
            else{
              this.status='error';
              this._router.navigate(['inicio']);
            }


          },

          error => {
            this.status='error';
            console.log(<any>error);
            this._router.navigate(['inicio']);
          }

        );


      }



    );


  }

}
