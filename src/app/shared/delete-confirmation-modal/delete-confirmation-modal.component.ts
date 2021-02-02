import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-confirmation-modal',
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrls: ['./delete-confirmation-modal.component.css']
})
export class DeleteConfirmationModalComponent implements OnInit {
  @Input() message: string = 'Would you like to delete the item?';
  @Input() title: string = 'Delete Item';

  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  delete() {
    this.modal.close(true);
  }
}
