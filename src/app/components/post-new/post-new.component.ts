import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/post';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { global } from '../../services/global';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-new',
  templateUrl: './post-new.component.html',
  styleUrls: ['./post-new.component.css'],
  providers: [UserService, CategoryService, PostService]
})
export class PostNewComponent implements OnInit {

  public page_title:string;
  public token;
  public identity;
  public post: Post;
  public categories;
  public status:string;
  public url;

  public froala_options: Object = {
    charCounterCount: true,
    language: 'es',
    toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat'],
    toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat'],
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat'],
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat'],
  };

  public afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png,.gif,.jpeg",
    maxSize: "50",
    uploadAPI:  {
      url: global.url+'post/upload',
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
    private _userService: UserService,
    private _router:Router,
    private _route:ActivatedRoute,
    private _categoryService: CategoryService,
    private _postService: PostService,

  ) { 
    this.page_title='Crear nuevo post';
    this.identity=this._userService.getIdentity();
    this.token=this._userService.getToken();
    this.post= new Post(1,this.identity.sub,1,'','',null,null);
    this.url=global.url;
  }

  ngOnInit() {
    this.getCategories();
    //console.log(this.post);
  }

  getCategories(){
    this._categoryService.getCategories().subscribe(
      
      response =>{

        if(response.status == 'success'){
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

  imagenUpload(datos){
    let image_data= JSON.parse(datos.response);
    this.post.image = image_data.image;
  }

  onSubmit(form){

    //console.log(this.post);

    this._postService.create(this.token,this.post).subscribe(

      response => {

        if(response.status == 'success'){
          this.post=response.post;
          this.status='success';
          
          this._router.navigate(['/inicio']);
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
