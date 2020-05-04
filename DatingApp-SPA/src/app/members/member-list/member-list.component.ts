import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { User } from '../../_models/user';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from '../../_models/pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  users: User[];
  user: User = JSON.parse(localStorage.getItem('user'));
  genderList = [{value: 'male', display: 'Male'}, {value: 'female', display: 'Female'}];
  userParams: any = {};
  pagination: Pagination;
  constructor(private userService: UserService, private alertify: AlertifyService, private router: ActivatedRoute) { }

  ngOnInit() {
    this.router.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });
    this.populateUserParams();
    this.userParams.orderBy = 'lastActive';
  }

    populateUserParams(){
      this.userParams.gender = ((this.user.gender === 'female') ? 'male' : 'female');
      this.userParams.minAge = 18;
      this.userParams.maxAge = 99;
    }
    resetFilters(){
      this.populateUserParams();
      this.loadUsers();
    }
    pageChanged(event: any): void {
      this.pagination.currentPage = event.page;
      this.loadUsers();
    }

    loadUsers() {
      this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
      .subscribe( ( res: PaginatedResult<User[]>) => {
        this.users = res.result;
        this.pagination = res.pagination;
      }, error => {
        this.alertify.error(error);
      });
    }

}
