import { Component } from '@angular/core';
import { NavController, Events, ModalController, NavParams } from 'ionic-angular';
import { ResponderPrePage } from '../responder-pre/responder-pre';
import { ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { DatabaseProvider } from '../../providers/database/database';
import { SoundProvider } from '../../providers/sound/sound';
import { ServicesProvider } from '../../providers/services/services';


@Component({
  selector: 'page-preguntas',
  templateUrl: 'preguntas.html',
})

export class PreguntasPage {

  intervalo
  numero = 3
  comenzado
  terminado
  status = "Parar"
  stop: boolean = false

  totales: number
  haypreguntas: boolean
  establecimiento
  establecimientos = []
  icono_son: String = "up"

  constructor(private soundProvider: SoundProvider, private database: DatabaseProvider, private netWork: Network, private toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public events: Events, public proveedor: ServicesProvider) {

  }

  ionViewDidEnter() {
    // if (!this.comenzado) {
    this.stop = false
    clearInterval(this.intervalo)
    this.GetAllUser()
    this.numero = 3
    this.intervalo = setInterval(() => this.tick(), 1000)

    //}

  }

  tick() {
    --this.numero
    if (this.numero == 0) {
      clearInterval(this.intervalo)
      if (this.establecimiento != 'null') {
        if (this.haypreguntas) {
          this.jugar()
        }
        else {
          this.toastCtrl.create({
            message: "No hay preguntas para este establecimiento, intenta con otro",
            duration: 3000
          }).present();
        }
      }else{
        this.toastCtrl.create({
          message: "Felicidades has completado todos los establecimientos disponibles\n Vuelve más tarde 😉.",
          duration: 3000
        }).present();
      }
    }
  }



  jugar() {
    if (/*this.netWork.type === 'ethernet' || this.netWork.type === 'wifi' || this.netWork.type === '3g' || this.netWork.type === '2g' || this.netWork.type === '4g' || this.netWork.type === 'cellular'*/this.netWork.type != 'null') {
      this.navCtrl.push(ResponderPrePage)
      this.comenzado = true
    } else {
      this.toastCtrl.create({
        message: "No hay conexión a internet... Intente de nuevo.",
        duration: 3000
      }).present();
    }
  }
  GetAllUser() {
    this.database.GetAllUsers().then((data: any) => {
      let item = data
      this.establecimiento = item[0].establecimiento

      if (this.database.getSonido() == "up") {
        this.icono_son = "up"
      } else if (this.database.getSonido() == "off") {
        this.icono_son = "off"
      }

      this.proveedor.obtenerEstablecimiento(this.establecimiento).then((data: any) => {
        this.establecimientos = data
      }, (error) => { console.log(error); })

      this.proveedor.GetAllQuestions(this.establecimiento).then((data: any) => {
        this.totales = data.length
        if (data.length > 0) {
          this.haypreguntas = true
        } else {
          this.haypreguntas = false
        }
      }, (error) => { console.log(error); })

    }, (error) => {
      console.log(error);
    })
  }
  StopStart() {

    if (this.numero != 0) {
      this.soundProvider.playAudioPop();
      if (!this.stop) {
        clearInterval(this.intervalo)
        this.status = "Reanudar"
        this.stop = true
      } else
        if (this.stop) {
          this.status = "Parar"
          this.intervalo = setInterval(() => this.tick(), 1000)
          this.stop = false
        }
    }
  }

  updateSound() {
    if (this.database.getSonido() == "up") {
      this.icono_son = "off"
      this.database.UpdateSonido("off")
      this.soundProvider.stopMusic()
    } else {
      this.icono_son = "up"
      this.database.UpdateSonido("up")
      this.soundProvider.playMusic()
    }
  }

  ionViewWillLeave() {
    clearInterval(this.intervalo)
    this.soundProvider.playCambio();
  }
  ionViewDidLoad() {

  }


}