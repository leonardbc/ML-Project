import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit{
  file_data = ''; // Binary data of current image (string)
  filename = ''; // filename of current image (string)
  itemList: string[] = []; // Current list of labels (displayed)
  inputText: string = ''; // Text in the textbox (to be added to the list)

  constructor(private http: HttpClient, private papa: Papa){ }

  ngOnInit(): void {
    // Gets the labels from the database on init
    const url = 'http://127.0.0.1:5000/labels/get'
    this.http.get(url).subscribe(
      {
        next: (data: any) => {
          this.itemList = data
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

  addItem() {
    // Add label to the labels box and to the database
    if (this.inputText.trim() !== '') {
      this.itemList.push(this.inputText);
      const url = 'http://127.0.0.1:5000/labels/add'
      const data = {label:this.inputText}
      this.http.post(url, data).subscribe(
      {
        next: (data: any) => {
          this.itemList = data
          console.log(this.itemList)
        },
        error: (error: any) => {
          console.error('Error:', error);
        },
        complete: () => {
          console.log('Request completed.');
        }
      });
      this.inputText = '';
    }
  }

  onFileSelected(event: any) {
    // Gets data and filename of image to store in the database
    this.filename = event.target.files[0].name;
    
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event: any) => {
      this.file_data = event.target.result;
    
    this.onUpload();
    }
  }

  onUpload(){
    // Uploads image in the database
    const url = 'http://127.0.0.1:5000/images/add'
    const data = {filename: this.filename, data: this.file_data}
    this.http.post(url, data).subscribe(
      {
        next: (data: any) => {
          console.log('Server response:', data);
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

  onDownload(){
    // Downloads and excel with the current images table
    const url = 'http://127.0.0.1:5000/images/table'
    const data = {label:"full", id_mode:false}
    this.http.post(url, data).subscribe(
      {
        next: (data: any) => {
          const csvData = this.convertToCsv(data);
          this.downloadCsvFile(csvData);
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

  convertToCsv(data: any): string {
    const csv = this.papa.unparse(data, {
      header: true,
      skipEmptyLines: true
    });
    return csv;
  }

  // Function to trigger the file download
  downloadCsvFile(csvData: string): void {
    const blob = new Blob([csvData], { type: 'text/csv' });
    const fileName = 'data.csv';
    saveAs(blob, fileName);
  }
}

