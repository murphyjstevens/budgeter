import { Component, Input, OnInit } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-delete-confirmation-modal',
  templateUrl: './delete-confirmation-modal.component.html'
})
export class DeleteConfirmationModalComponent implements OnInit {
  @Input() message = 'Would you like to delete the item?';
  @Input() title = 'Delete Item';

  constructor (public modal: NgbActiveModal) { }

  ngOnInit (): void {
  }

  delete (): void {
    this.modal.close(true)
  }
}
