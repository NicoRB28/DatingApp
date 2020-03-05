import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { GalleryItem, ImageItem } from '@ngx-gallery/core';



@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  user: User;
  images: GalleryItem[];

  constructor(private userService: UserService, private alertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });
    // this.loadUser();
    this.images = this.getImages();
  }

  getImages() {
    const imageUrls = [];
    for (let i = 0; i < this.user.photos.length ; i++)
    {
      const imageItem = new ImageItem({src: this.user.photos[i].url, thumb: this.user.photos[i].url});
      imageUrls.push(imageItem);
    }
    return imageUrls;
  }
  // loadUser() {
  //   this.userService.getUser(+this.route.snapshot.params['id']).subscribe(
  //     (user: User) => {
  //       this.user = user;
  //     }, error => {
  //       this.alertify.error(error);
  //     });
  // }

}
