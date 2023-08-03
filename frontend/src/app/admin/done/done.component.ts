import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-done',
  templateUrl: './done.component.html',
  styleUrls: ['./done.component.css']
})
export class DoneComponent implements OnInit{
  ids: number[] = []; // Ids of the set of images to display
  current: number = 0; // Current image index (from ids list) being displayed
  file_data: string = ''; // Binary data of current image (string)
  labeller: string = "labeller" // Current labeller to display
  mask: string = "mask" // Current label to display

  constructor(private http: HttpClient){ }

  ngOnInit(): void {
    // to display first image when initialized
    this.requestIds("done");
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
          console.log(data)
          this.getImage(true);
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
          console.log(data)
          this.file_data = data[0]
          this.labeller = data[1]
          if (data[2] == true){
            this.mask = "With mask"
          } else {
            this.mask = "Without mask"
          }
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
      this.getImage(true);
    }
  }

  onButtonNext() { // Next button functionality
    // changes the "current" variable being carefull with the limits
    if ((this.current + 1) < this.ids.length){
      this.current += 1;
      this.getImage(true);
    }
  }
}
