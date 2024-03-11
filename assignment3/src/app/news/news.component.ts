import { Component, inject, Input } from '@angular/core';
import { CompanyDescriptionService } from '../services/company-description.service'
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
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
  open() {
    console.log("H")
    const modalRef = this.modalService.open(NgbdModalContent);
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
		<div class="modal-header">
			<h4 class="modal-title">Hi there!</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body">
			<p>Hello!</p>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
		</div>
	`,
})
export class NgbdModalContent {
	activeModal = inject(NgbActiveModal);

	// @Input() name: string;
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

