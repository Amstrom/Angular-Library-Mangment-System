import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { myValidations } from 'src/app/myValidators.validators';
import { MongoServiceService } from 'src/app/service/mongo-service.service';
import { SnackbarServiceService } from 'src/app/service/snackbar-service.service';

@Component({
  selector: 'app-update-reader',
  templateUrl: './update-reader.component.html',
  styleUrls: ['./update-reader.component.css']
})
export class UpdateReaderComponent implements OnInit {

  constructor(private service:MongoServiceService,private snackbar:SnackbarServiceService) { }

  ngOnInit() {
  }

  form=new FormGroup(
    {
      readerID: new FormControl('',[
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(7),
        myValidations.cannotContainSpaces]),
      fname:new FormControl('',Validators.required),
      lname:new FormControl('',Validators.required),
      dob:new FormControl('',Validators.required),
      email: new FormControl('',Validators.required),
      contactNo:new FormControl('',[
        Validators.required,
        Validators.minLength(10)]
        )
    }
  );

  found=false;

  get readerID()
  {
    return this.form.get('readerID');
  }
  get fname()
  {
    return this.form.get('fname');
  }
  get lname()
  {
    return this.form.get('lname');
  }
  get dob()
  {
    return this.form.get('dob');
  }
  get email()
  {
    return this.form.get('email');
  }
  get contactNo()
  {
    return this.form.get('contactNo');
  }


  reader;
  readerUrl='http://localhost:9000/reader';

  findReader() {
    this.found=false;
    let temp=this.readerID.value;
    this.form.reset();
    this.readerID.setValue(temp);

    this.service.findValue(this.readerUrl, this.readerID.value).subscribe(
      response => {
        console.log(response);
        this.reader = response;
        this.fname.setValue(this.reader.w1673657_fname);
        this.lname.setValue(this.reader.w1673657_lname);
        this.email.setValue(this.reader.w1673657_email);
        this.contactNo.setValue(this.reader.w1673657_mobileNumber);
        let year=this.reader.w1673657_dob.year;
        let month=this.reader.w1673657_dob.month;
        let day=this.reader.w1673657_dob.day;

        let date="";
        date+=year+"-";
        if(month<10)
            date+="0"+month;
        else
            date+=month;

        if(day<10)
            date+="-0"+day;
        else
            date+="-"+day;

        console.log(date);
        
        this.dob.setValue(date);

        this.found=true;


      }
      ,error=>
      {
        this.snackbar.openErrorSnackBar(error);
      }
    )
  }

  clear()
  {
    this.form.reset();
    this.found=false;
  }


  updateReader()
  {
    let post={
      readerId:this.reader.id,
      fname:this.fname.value,
      lname:this.lname.value,
      dob:this.dob.value,
      email:this.email.value,
      contactNo:this.contactNo.value

    };
    console.log(post);
   
    this.service.updatePost('http://localhost:9000/reader/update',post).subscribe(
      response =>
      {
        console.log(response);
        let data;
        data=response;
        if(data.msg=='updated')
        {
          // alert('Reader has been successfully updated');
          this.snackbar.openSnackBar('Reader has been successfully updated');
          this.clear();

        }
        
      }
      ,error=>
      {
        this.snackbar.openErrorSnackBar(error);
      }
    )
  }



  

}
