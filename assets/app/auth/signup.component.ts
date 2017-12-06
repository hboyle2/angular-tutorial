import {Component, OnInit} from "@angular/core";
import {FormGroup, FormControl, Validators} from "@angular/forms"

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html' 
  
})
export class SignupComponent implements OnInit{
  myForm: FormGroup;

  onSubmit() {
    console.log(this.myForm)
    this.myForm.reset();
  }

  ngOnInit(){
    this.myForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('',
        Validators.required   ),
      password: new FormControl('', Validators.required)
    })
  }
}