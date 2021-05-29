import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from 'src/app/models/category';
import { CategoryGroup } from 'src/app/models/category-group';
import { CategoryDataService } from 'src/app/services/category-data.service';

@Component({
  selector: 'app-add-category-dialog',
  templateUrl: './add-category-dialog.component.html'
})
export class AddCategoryDialogComponent implements OnInit {
  categoryGroups: Array<CategoryGroup> = [];

  addCategoryForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    categoryGroupId: ['', Validators.required]
  });

  get name(): AbstractControl | null { return this.addCategoryForm.get('name'); }
  get categoryGroupId(): AbstractControl | null { return this.addCategoryForm.get('categoryGroupId'); }

  constructor(public modal: NgbActiveModal,
              private formBuilder: FormBuilder,
              private categoryDataService: CategoryDataService) {}

  ngOnInit(): void {
    this.categoryDataService.getGroups().subscribe((groups: Array<CategoryGroup>) => {
      this.categoryGroups = groups;
    }, error => {
      console.error(error);
    });
  }

  setCategoryGroupId(categoryGroupId: number): void {
    this.categoryGroupId?.setValue(categoryGroupId);
  }

  add(): void {
    if (this.name && this.categoryGroupId) {
      this.categoryDataService.add({
        name: this.name.value,
        categoryGroupId: this.categoryGroupId.value,
        budget: 0,
        spent: 0
      } as Category).subscribe(category => {
        this.modal.close(category);
      }, error => {
        console.error(error);
      });
    }
  }
}
