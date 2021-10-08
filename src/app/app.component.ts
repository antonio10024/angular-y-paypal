import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var paypal:any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('paypal')
  paypalElement !: ElementRef;

  //formulario para capturar productos
  formProduct!:FormGroup;

  //lista de producto a pagar
  formProductList:any[]=[];
  
  
  title = 'paypal-integration';
  constructor(private fb:FormBuilder){

  }

  ngOnInit(){
    this.formProduct=this.fb.group({
      description:['',[Validators.required]],
      quantity:[0,[Validators.required, Validators.min(1)]],
      price:[0,[Validators.required, Validators.min(1)]],
    });

  }

  //obtenemos el total del producto a insertar
  get Total():number{
    return this.formProduct.controls['quantity'].value * this.formProduct.controls['price'].value ;
  }

  //obtnemeos el total de la orden 
  get totalOrder():number{
    let total=0;
    this.formProductList.forEach(element => {
      total+=element.total;
     });
     console.log(total);
     return total;
  }

  addProduct(){
    let total=this.Total;
    let vari={total, ...this.formProduct.value }
    this.formProductList.push(vari);
    this.formProduct.reset();
  }

  submit(){
    //limpiamos el control antes de renderisar
    this.paypalElement.nativeElement.innerHTML="";
    paypal.Buttons({
      createOrder: (data:any, actions:any) => {
        return actions.order.create({
          purchase_units: [
            {
              description:'pago de orden',
              amount     :{
                currency_code: 'MXN',
                value        : this.totalOrder
              }
            }
          ]
        })
      },
      onCancel:(data:any)=>{
        alert('la operacion se cancelo no se realizo ningun cobro');
      }
    }).render( this.paypalElement.nativeElement );

  }

}
