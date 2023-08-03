import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-labeller',
  templateUrl: './labeller.component.html',
  styleUrls: ['./labeller.component.css']
})
export class LabellerComponent {
  ids: number[] = []; // Ids of the set of images to display
  current: number = 0; // Current image index (from ids list) being displayed
  file_data: string = ''; // Binary data of current image (string)
  options: string[] = []; // List of available labels
  selected: string = ''; // Currently selected label by the user
  labeller: string = ''; // Variable passed by the router (in login) storing the name of the labeller

  constructor(private http: HttpClient, private route: ActivatedRoute){ }

  ngOnInit(): void {
    // Gets labeller from route
    this.route.queryParams.subscribe(params => {
      this.labeller = params['labeller'];
    });
    // Gets labels
    this.requestIds("pending");
    const url = 'http://127.0.0.1:5000/labels/get'
    this.http.get(url).subscribe(
      {
        next: (data: any) => {
          this.options = data
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

  selectOption(option: string) {
    // Updates selected option (reacts to click on option)
    this.selected = option;
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
    // gets the image data in string, mode variable made to get labeller and label
    const url = 'http://127.0.0.1:5000/images/data'
    const id = this.ids[this.current] // id of the image
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
    // Updates the columns mask and labeller of the current image and goes to the next image
    if (this.selected != ''){ // Checks if a label was selected
      const url = 'http://127.0.0.1:5000/images/update_mask'
      const id = this.ids[this.current] // id of the image
      const data = {id:id, mask: this.selected, labeller: this.labeller}
      this.http.put(url, data).subscribe(
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
        });
    }
    // changes the "current" variable being carefull with the limits
    if ((this.current + 1) < this.ids.length){
      this.current += 1;
      this.getImage(false);
    }
  }
}
