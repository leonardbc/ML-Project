import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.css']
})
export class PendingComponent {
  ids: number[] = []; // Ids of the set of images to display
  current: number = 0; // Current image index (from ids list) being displayed
  file_data: string = ''; // Binary data of current image (string)

  constructor(private http: HttpClient){ }

  ngOnInit(): void {
    this.requestIds("pending");
  }
  // the functions below are used by done and pending components, could be inherited
  requestIds(filter: string){ 
    // requests an array of image ids depending on the filter (done, pending or full)
    const url = 'http://127.0.0.1:5000/images/table'
    const data = {label: filter,id_mode: true}
    this.http.post(url, data).subscribe(
      {
        next: (data: any) => {
          this.ids = data
          this.getImage(false);
        },
        error: (error: any) => {
          console.error('Error:', error);
        },
        complete: () => {
          console.log('Request completed.');
        }
      }
    );
  }

  getImage(mode: boolean) {
    // gets the image data in string, mode variable made to get labeller and label optionaly
    const url = 'http://127.0.0.1:5000/images/data'
    const id = this.ids[this.current]
    const data = {id:id, label_mode: mode}
    this.http.post(url, data).subscribe(
      {
        next: (data: any) => {
          this.file_data = data
        },
        error: (error: any) => {
          console.error('Error:', error);
        },
        complete: () => {
          console.log('Request completed.');
        }
      }
    );
  }

  onButtonPrevious() { // Previous button functionality
    // changes the "current" variable being carefull with the limits
    if ((this.current - 1) >= 0){
      this.current -= 1;
      this.getImage(false);
    }
  }

  onButtonNext() { // Next button functionality
    // changes the "current" variable being carefull with the limits
    if ((this.current + 1) < this.ids.length){
      this.current += 1;
      this.getImage(false);
    }
  }
}
