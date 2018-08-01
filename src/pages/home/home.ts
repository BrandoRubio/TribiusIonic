import { Component } from '@angular/core';
import { NavController, Events, ModalController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { DatabaseProvider } from '../../providers/database/database';
import { SoundProvider } from '../../providers/sound/sound';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  totales: number
  establecimientos = []
  preguntas: any
  establecimiento
  nombre
  imagen
  respuestas
  haypreguntas: boolean

  segundos: number = 10
  isPaused: boolean
  icono_son: String = "up"
  constructor(private soundProvider: SoundProvider, private toastCtrl: ToastController, private netWork: Network, private database: DatabaseProvider, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public events: Events) {

  }

  goNext() {
    if (this.netWork.type != 'null') {
      this.navCtrl.parent.select(1);
    } else {
      this.toastCtrl.create({
        message: "No hay conexión a internet... Intenta de nuevo.",
        duration: 3000
      }).present();
    }
  }


  ionViewDidEnter() {
    this.consultSound();
  }

  consultSound() {
    this.database.GetAllUsers().then(() => {
      if (this.database.getSonido() == "up") {
        this.icono_son = "up"
      } else if (this.database.getSonido() == "off") {
        this.icono_son = "off"
      }

    }, (error) => {
      console.log(error);
    })
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
    this.soundProvider.playCambio();
  }

}
