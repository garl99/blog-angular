import { Component, OnInit } from '@angular/core';
import { Post } from '../../models/post';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { global } from '../../services/global';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-edit',
  templateUrl: '../post-new/post-new.component.html',
  styleUrls: ['../post-new/post-new.component.css'],
  providers: [UserService, CategoryService, PostService]
})
export class PostEditComponent implements OnInit {

  public page_title:string;
  public token;
  public identity;
  public post: Post;
  public categories;
  public status:string;
  public url;
  public is_edit: boolean;

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
    this.page_title='Editar post seleccionado';
    this.identity=this._userService.getIdentity();
    this.token=this._userService.getToken();
    this.url=global.url;
    this.is_edit=true;
  }

  ngOnInit() {
    this.getCategories();
    this.post= new Post(1,this.identity.sub,1,'','',null,null);
    this.getPost();
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

    this._postService.update(this.token,this.post, this.post.id).subscribe(

      response => {

        if(response.status == 'success'){
          this.status='success';
          this._router.navigate(['/entrada/',this.post.id]);
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

              if(this.post.user_id != this.identity.sub){
                this._router.navigate(['/inicio']);
              }
  

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
