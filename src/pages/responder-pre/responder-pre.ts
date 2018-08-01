import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams, Events } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database'
import { AlertController } from 'ionic-angular';
import { SoundProvider } from '../../providers/sound/sound';
import { ServicesProvider } from '../../providers/services/services';

@IonicPage()
@Component({
  selector: 'page-responder-pre',
  templateUrl: 'responder-pre.html',
})
export class ResponderPrePage {
  preguntas: any
  establecimiento
  nombre
  imagen = "assets/imgs/Cargando.gif"
  respuestas
  color
  intervalo

  num: number = 0
  puntuacion: number = 0
  puntos: number = 0
  puntosMenos: number = 0

  segundos: number = 10
  siguiente: boolean
  showAlertMessage = true
  icono_son: String = "up"

  constructor(private soundProvider: SoundProvider, private alertCtrl: AlertController, public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public events: Events, private database: DatabaseProvider, public proveedor: ServicesProvider) {

  }


  verifica(item) {
    if (item.correcta == true) {
      this.soundProvider.playAudioCorrecto()
      this.puntos += 1;
      this.puntuacion += 1;
    } else if (item.correcta == false) {
      this.soundProvider.playAudioIncorrecto()
      this.puntosMenos -= 1;
      this.puntuacion -= 1;
    }

    this.NextQuestion()
  }

  private tick(): void {
    if (this.segundos > 0) {
      --this.segundos
      switch (this.segundos) {
        case 9:
          this.color = "primary2";
          break;
        case 8:
          this.color = "bajo"
          break;
        case 7:
          this.color = "bajo2"
          break;
        case 6:
          this.color = "moderado"
          break;
        case 5:
          this.color = "moderado2"
          break;
        case 4:
          this.color = "alto"
          break;
        case 3:
          this.color = "alto2"
          break;
        case 2:
          this.color = "danger"
          break;
        case 1:
          this.color = "danger2"
          break;
        case 0:
          this.color = "danger3"
          break;
        default:
          this.color = "primary1"
          break;
      }
    }
    if (this.segundos == 0) {
      this.soundProvider.playAudioIncorrecto()
      this.puntosMenos -= 1;
      this.puntuacion -= 1;
      this.NextQuestion()
    }
  }

  ionViewDidEnter() {
  }

  NextQuestion() {
    clearInterval(this.intervalo)
    this.database.modificarPuntuacion(this.puntuacion)
    this.imagen = "assets/imgs/Cargando.gif"
    this.AsignaPregunta()
  }

  GetEstablecimiento() {
    this.database.GetAllUsers().then((data: any) => {
      this.establecimiento = data[0].establecimiento
      this.database.insertEstablecimientoContestado(this.establecimiento)
      this.GetQuestions()
    }, (error) => { console.log(error); })
  }

  GetQuestions() {
    this.proveedor.GetAllQuestions(this.establecimiento).then((data: any) => {
      this.preguntas = data
      this.AsignaPregunta()
    }, (error) => { console.log(error); })
    //this.AsignaPregunta()
  }

  AsignaPregunta() {
    if (this.preguntas.length > this.num) {
      this.color = "primary"
      this.nombre = this.preguntas[this.num].nombre
      this.imagen = "http://192.168.0.115:8001/assets/upload/" + this.preguntas[this.num].archivo_Foto
      this.respuestas = this.preguntas[this.num].respuestas
      this.segundos = 10
      this.intervalo = setInterval(() => this.tick(), 1000)
      this.num++
    } else {
      this.exitPage();
    }
  }
  private exitPage() {
    this.num = 0
    clearInterval(this.intervalo)
    this.showAlertMessage = false;
    this.cambiarEstablecimiento();
    this.navCtrl.pop();
  }

  ionViewCanLeave() {
    if (this.showAlertMessage) {
      let alertPopup = this.alertCtrl.create({
        title: '¿Estás seguro?',
        message: 'Aún te faltan preguntas por contestar. Solo se guardarán las preguntas contestadas.',
        buttons: [{
          text: 'Salir',
          handler: () => {
            alertPopup.dismiss().then(() => {
              clearInterval(this.intervalo)
              this.exitPage();
            });
          }
        },
        {
          text: 'Permanecer',
          handler: () => {
          }
        }]
      });
      alertPopup.present();
      return false;
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
    this.soundProvider.playCambio();
  }

  cambiarEstablecimiento() {
    this.database.CambiarEstablecimiento();
  }

  ionViewDidLoad() {
    this.GetEstablecimiento()
    this.database.GetAllUsers().then((data: any) => {

      let item = data;
      this.puntuacion = item[0].puntuacion
      if (this.database.getSonido() == "up") {
        this.icono_son = "up"
      } else if (this.database.getSonido() == "off") {
        this.icono_son = "off"
      }
    }, (error) => {
      console.log(error);
    })
  }
}
