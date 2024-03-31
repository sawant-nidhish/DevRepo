import { Component, inject, Input } from '@angular/core';
import { CompanyDescriptionService } from '../services/company-description.service'
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { elementAt } from 'rxjs';
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrl: './news.component.css',
  standalone:true,
  imports:[CommonModule]
})
export class NewsComponent {

  image:string = ""
  title:string = ""
  source:string= ""
  pubDate:string= ""
  description:string=""
  url:string=""
  topNews:any
  isModalOpen:boolean=false
  id:any
  newsModal:boolean=false
  // private modalService = inject(NgbModal);
  closeResult = '';
  private modalService = inject(NgbModal);
  constructor(private companyDataAPI: CompanyDescriptionService) { }
  
  ngOnInit(): void {
    this.isModalOpen=false
    this.companyDataAPI.getCompanyNewsDataObservable().subscribe(data => {
      //companydetails
      if(data){
        // console.log(data[0].id)
        data=data.filter(function(item:any){
          console.log(item.image.length!=0)
          return item.image.length!=0
        })
       this.topNews=data.slice(0,20)
        this.image = data.image
        this.title = data.headline
        this.source= data.source
        this.pubDate= data.datetime
        this.description= data.summary
        this.url= data.url

        // this.logo= data.logo
      }
        
    });
  }
  
  // closeModal(){
  //   console.log("Card clicked")
  //   this.companyDataAPI.closeDialog()
  // }
  open(event:any) {
    console.log("H")
    var target = event.currentTarget;
    var idAttr = target.attributes.id.nodeValue;
    console.log("Id is ",idAttr)
    const modalRef = this.modalService.open(NgbdModalContent);
    // const clickedNews:any
    console.log(this.topNews[0].id===Number(idAttr))
    for(let i=0; i<this.topNews.length; i++){
      if(this.topNews[i].id==Number(idAttr)){
        console.log(this.topNews[i])
        modalRef.componentInstance.news = this.topNews[i]; 
        break
      }
    }
		// modalRef.componentInstance.name = 'World';
  }
  // open(){
  //   console.log('Setting the modal popup to true')
  //   this.companyDataAPI.setNewsModal(true);
  // //  this.companyDataAPI.getNewsModal().subscribe(data => {
  // //     //companydetails
  // //     console.log("Received data to get",data)
  // //     // if(data){
  // //     //   this.modalService.open(ModalComponent)
  // //     //   // this.logo= data.logo
  // //     //  }
        
  // //   });
  // }

  
// }
}

@Component({
	selector: 'ngbd-modal-content',
	standalone: true,
	template: `
		<div class="modal-header d-flex">
			<div class="d-flex flex-column">
      <h2 class="modal-title fw-bold">{{news.source}}</h2>
      <p class="my-0" style="font:1em">{{news.datetime}}</p>
      </div>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body">
			<p class="fw-bold" style="font-size:1.5em">{{news.headline}}</p>
      <p style="font-size:1em">{{news.summary}}</p>
      <p class="text-black-50" style="font-size:0.8em">For more details click <a  href={{news.url}} target="_blank">here</a></p>
		</div>
		<div class="border rounded mb-2 mx-2 pl-3 pt-4 pb-2">
    <p>Share</p>
    <div class="d-flex">
        <a class="twitter-share-button"
        href="https://twitter.com/intent/tweet?text={{news.headline}}&url={{news.url}}"
        data-size="large" target="_blank"><img src="../../assets/twitter.jpg" style="height:3em"></a>
      <div class="fb-share-button ml-2" [attr.data-href]=news.url data-layout="" data-size=""><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u={{news.url}}&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore"><img src="../../assets/facebook.webp" style="height:3em"></a></div>
    </div>
  </div>
	`,
})
export class NgbdModalContent {
	activeModal = inject(NgbActiveModal);

	@Input() news: any;
  ngOnInit(){
    console.log(this.news)
    const dateObject = new Date(this.news.datetime*1000);
    // Format the date according to your preference
    this.news.datetime = dateObject.toLocaleDateString('en-US', { month: 'long', day:'numeric', year: 'numeric' });
  }
}
// @Component({
// 	selector: 'ngbd-modal-content',
// 	template: `
// 		<div class="modal-header">
// 			<h4 class="modal-title">Hi there!</h4>
// 			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
// 		</div>
// 		<div class="modal-body">
// 			<p>Hello, name </p>
// 		</div>
// 		<div class="modal-footer">
// 			<button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
// 		</div>
// 	`,

// })
// export class NgbdModalContent {	
//   constructor(public activeModal: NgbActiveModal){}
// }

