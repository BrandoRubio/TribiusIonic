import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SoundProvider } from '../../providers/sound/sound';
import { ServicesProvider } from '../../providers/services/services';


@Component({
  selector: 'page-configuracion',
  templateUrl: 'configuracion.html',
})
export class ConfiguracionPage {
  establecimientos: any
  ListUser: any;
  ListEstablecimiento: any;
  formuser: FormGroup;
  formEstablecimiento: FormGroup;
  establecimiento
  sexoCmb = '--indefinido--'
  name
  edad = 10
  puntuacion
  id
  full = false

  myString: String
  icono_son: String = "up"
  constructor(private soundProvider: SoundProvider, public statusBar: StatusBar, public androidFullScreen: AndroidFullScreen, public navCtrl: NavController, public proveedor: ServicesProvider, private database: DatabaseProvider, private formBuilder: FormBuilder, private form2: FormBuilder) {
    this.formuser = this.formBuilder.group({
      name: ['', Validators.requiredTrue],
      edad: ['',],
      sexo: ['',],
      full: ['',],
      sonido: ['',],
    })
    this.formEstablecimiento = this.form2.group({
      establecimiento: ['',],
    })
    this.GetAllUser()
  }

  UpdateMyUser() {
    this.soundProvider.playAudioPop();
    this.database.UpdateUser(this.formuser.value.name, this.formuser.value.edad, this.formuser.value.sexo)
    this.UpdateMyEstablecimiento()
    this.GetAllUser();
  }

  UpdateMyEstablecimiento() {
    if (this.formEstablecimiento.value.establecimiento != null) {
      this.database.UpdateEstablecimiento(this.formEstablecimiento.value.establecimiento)
      this.GetAllUser();
    }
  }

  ionViewDidEnter() {
    this.MuestraDatos();
  }
  public MuestraDatos() {
    let arrayEC = []
    let arrayET = []
    this.proveedor.obtenerEstablecimientos().subscribe((data: any) => {
      this.database.GetEstablecimientosContestados().then((establ: any) => {
        arrayEC = establ;
        arrayET = data;
        let arrayEstablecimientos = []
        for (let i = 0; i < arrayET.length; i++) {
          if (arrayET[i].enabled == true) {
            arrayEstablecimientos.push({
              id: arrayET[i].id,
              alias: arrayET[i].alias,
              archivo_Fondo: arrayET[i].archivo_Fondo,
              archivo_Logo: arrayET[i].archivo_Logo,
              ciudad: arrayET[i].ciudad,
              cp: arrayET[i].cp,
              domicilio: arrayET[i].domicilio,
              email: arrayET[i].email,
              nombre: arrayET[i].nombre,
              telefono: arrayET[i].telefono
            })
          }
        }
        if (arrayEC.length > 0) {
          for (let f = 0; f < arrayEC.length; f++) {
            for (let i = 0; i < arrayEstablecimientos.length; i++) {
              if (arrayEC[f].idEsta == arrayEstablecimientos[i].id) {
                arrayEstablecimientos.splice(i, 1)
              }
            }
          }
        }
        this.establecimientos = arrayEstablecimientos
      }, (error) => { console.log(error); })
    }, (error) => { console.log(error); })

    this.GetAllUser();
  }

  ionViewWillLeave() {
    this.soundProvider.playCambio();
    this.database.UpdateUser(this.formuser.value.name, this.formuser.value.edad, this.formuser.value.sexo)
    this.UpdateMyEstablecimiento()
  }
  GetAllUser() {
    this.database.GetAllUsers().then((data: any) => {
      this.ListUser = data;
      let item = this.ListUser
      this.sexoCmb = item[0].sexo
      this.edad = item[0].edad
      this.name = item[0].name
      this.puntuacion = item[0].puntuacion
      this.id = item[0].id
      this.establecimiento = item[0].establecimiento

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

  fullScreen() {
    this.soundProvider.playAudioPop();
    if (!this.full) {
      this.androidFullScreen.immersiveMode().then().catch(err => console.log(err));
      this.full = true
    } else if (this.full) {
      this.androidFullScreen.showSystemUI().then().catch(err => console.log(err));
      this.statusBar.backgroundColorByHexString('#2A5FE1');
      this.statusBar.styleDefault();
      this.full = false
    }
  }


  ionViewDidLoad() {
  }
}