import { Component, Input, OnInit } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-recipients-modal',
  templateUrl: './recipients-modal.component.html'
})
export class RecipientsModalComponent implements OnInit {
  @Input() message = 'Would you like to delete the item?';
  @Input() title = 'Delete Item';

  constructor (public modal: NgbActiveModal) { }

  ngOnInit (): void {
  }

  delete (): void {
    this.modal.close(true)
  }

  close (): void {
    this.modal.close(true)
  }
}
