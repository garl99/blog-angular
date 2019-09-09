import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Category } from '../../models/category';
import { CategoryService } from 'src/app/services/category.service';
import { global } from '../../services/global';
import { UserService } from '../../services/user.service';
import { PostService } from 'src/app/services/post.service';


@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css'],
  providers: [CategoryService, UserService, PostService]
})
export class CategoryDetailComponent implements OnInit {

  public page_title:string;
  public category: Category;
  public posts: any;
  public url:string;
  public status;
  public identity;
  public token;

  constructor(
    
    private _categoryService: CategoryService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _postService: PostService
    
    ) { 
      this.url = global.url;
      this.token=this._userService.getToken();
      this.identity=this._userService.getIdentity();
    }

  ngOnInit() {

    this.getPostsbyCategory();
  }

  getPostsbyCategory(){

    this._route.params.subscribe(

      params => {
        let id= +params['id'];

        this._categoryService.getCategory(id).subscribe(

          response => {

            if(response.status == 'success'){
              this.status='success';
              this.category=response.category;
              //console.log(this.category);

              this._categoryService.getPosts(id).subscribe(

                response => {
                  if(response.status == 'success'){
                    this.posts=response.posts;
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
