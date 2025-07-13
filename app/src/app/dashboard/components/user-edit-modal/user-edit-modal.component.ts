import {Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {User, UserRole} from "@/shared/models/user.model";
import {Dialog} from "primeng/dialog";
import {Button} from "primeng/button";
import {Select} from "primeng/select";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {FormGroupComponent} from "@/shared/components/form-group/form-group.component";
import {DashboardService} from "@/dashboard/services/dashboard.service";
import {finalize} from "rxjs";
import {Message} from "primeng/message";

@Component({
  selector: 'app-user-edit-modal',
  imports: [
    Dialog,
    Button,
    Select,
    FormsModule,
    FormGroupComponent,
    ReactiveFormsModule,
    Message
  ],
  templateUrl: './user-edit-modal.component.html',
  styleUrl: './user-edit-modal.component.css'
})
export class UserEditModalComponent implements OnChanges {
  @Input() user: User | null = null;
  @Input() isVisible: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onUserUpdated = new EventEmitter<User>();

  isSubmitting = false;
  errorMessage = '';
  formBuilder = new FormBuilder();
  userForm = this.formBuilder.group({
    role: [UserRole.User]
  });
  roles = [
    {label: 'User', value: UserRole.User},
    {label: 'Admin', value: UserRole.Admin},
  ];

  dashboardService = inject(DashboardService);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && this.user) {
      this.userForm.patchValue({
        role: this.user.role
      });
    }
  }

  onSubmit(): void {
    const role = this.userForm.value.role;

    if (!this.user || this.userForm.invalid || this.userForm.untouched || !role) return;

    this.errorMessage = '';
    this.isSubmitting = true;

    this.dashboardService.updateUserRole(this.user.id, role)
      .pipe(
        finalize(() => {
          this.isSubmitting = false
          this.onUserUpdated.emit();
        })
      )
      .subscribe({
        next: () => {
          this.onClose.emit();
        },
        error: (error) => {
          console.error('Error updating user role:', error);
          this.errorMessage = error.error?.message || 'Failed to update user role. Please try again.';
        }
      });
  }
}
