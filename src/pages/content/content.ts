import { Component, Renderer2 } from '@angular/core';
import { IonicPage, NavController, Alert } from 'ionic-angular';
import * as mapbox  from 'mapbox-gl';
                                          

import { AngularFirestore, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Observable';
import { Geolocation } from '@ionic-native/geolocation';
import { pointerCoord } from 'ionic-angular/util/dom';

 

@IonicPage()
@Component({
  selector: 'page-content',
  templateUrl: 'content.html'
})
export class ContentPage {

  profesional: AngularFirestoreDocument<any>;
  map: any;
  estilista:any;
  screenMap:any;
  popup:any;

  constructor (  public navCtrl: NavController,
                 public db: AngularFirestore,
                 private geolocation:Geolocation,
                 private renderer: Renderer2
              ) { 
 
      /*
        this.db.collection('usuarios').valueChanges()
          .subscribe( res => {
            this.estilista = res;
            //console.log(this.estilista);
            this.markers();
        });
      */
  
    db.collection("usuarios", ref => ref.where('estado', '==', true)).valueChanges()
    .subscribe( res => {
      this.estilista = res;
      console.log(this.estilista);
      this.markers();
    })

  }

  ionViewWillEnter() {

    this.map = mapbox;
     this.map.accessToken = 'pk.eyJ1IjoibGVpZHktdCIsImEiOiJjanAyeWdjOHgwMGRvM3dwaDdzNGJhMmZ4In0.2_xAbtdqiB4c-Wa0Qf1Vgw';
   
    this.screenMap =  new mapbox.Map({
      container:'map',
      style:'mapbox://styles/mapbox/streets-v9',
      logoPosition:'top-left'
    }) 

    this.screenMap.addControl( new mapbox.GeolocateControl({
      positionOptions:{
        enableHighAccuracy:true,         
      },
      trackUserLocation:true      
    }))

    this.geolocation.getCurrentPosition().then((resp) => {
       resp.coords.latitude
       resp.coords.longitude
    });

    let watch = this.geolocation.watchPosition();
      watch.subscribe((data) => {
        data.coords.latitude
        data.coords.longitude
    });
  
  }   
  
  markers() { 

    this.estilista.forEach(element => {     
      let el = document.createElement('div');
      el.className = 'prueba';
      new mapbox.Marker(el)  

        .setLngLat([element.long,element.lat])     
        .setPopup(new mapbox.Popup({ offset: 25 }) // add popups
        .setHTML('<h3>' + element.nombre + '</h3><p>' + element.estado + '</p>'))
        .addTo(this.screenMap) 

        setTimeout(() => {
          el.remove();
        }, 1000);
    });    
  }
}  
