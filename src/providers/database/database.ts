import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ServicesProvider } from '../services/services';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
//import { SoundProvider } from '../sound/sound';

@Injectable()
export class DatabaseProvider {

  private db: SQLiteObject;
  private isOpen: boolean;

  aleatorio: number = this.numeroAl(0, 9999);
  dateObj = new Date();
  month = this.dateObj.getUTCMonth() + 1;
  day = this.dateObj.getUTCDate();
  year = this.dateObj.getUTCFullYear();
  private id: number;
  lista: any;
  establecimiento: any;
  estadoSonido: String;
  //first:boolean=false
  constructor(
   // public soundProvider:SoundProvider,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public storage: SQLite,
    public servicioHttp: ServicesProvider,
    public screenOrientation: ScreenOrientation
  ) {
    if (!this.isOpen) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      this.storage = new SQLite();
      this.storage.create({ name: "data.db", location: "default" }).then((db: SQLiteObject) => {
        this.db = db;
        db.executeSql("CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, puntuacion INTEGER, name TEXT, edad INTEGER, sexo TEXT, establecimiento TEXT, sonido TEXT)", [])
        db.executeSql("CREATE TABLE IF NOT EXISTS establecimientosContestados(id INTEGER PRIMARY KEY, idEsta TEXT)", [])
        this.VerificarExixtencia();
        this.CambiarEstablecimiento();
        this.truncate();//cada vez que entra por primera vez, la tabla de establecimientos contestados se vacía
        this.isOpen = true;
      }).catch((error) => {
        console.log(error);
      })
    }
  }

  CreateUser(id: number) {
    return new Promise((resolve, reject) => {
      let sql = "INSERT INTO users (id,name,puntuacion,sexo,sonido) VALUES (?,'',0,'--indefinido--','off')";
      //let sql = "INSERT INTO users (id,name,puntuacion,sexo,sonido) VALUES (20186227376,'Brando',20,19,'Masculino')";
      this.db.executeSql(sql, [id]).then((data) => {
        //this.db.executeSql(sql,[]).then((data) => {
        resolve(data);
        this.nameAlert();
        //this.soundProvider.playMusic()
      }, (error) => {
        reject(error);
      });
    });
  }

  nameAlert() {
    let alert = this.alertCtrl.create({
      cssClass: "alertname",
      title: 'Para empezar:',
      message: 'Guarda tu nombre:',
      inputs: [
        {
          name: 'nombre',
          placeholder: 'Nombre'
        },
      ],
      buttons: [
        {
          text: 'No, gracias',
          handler: () => {
          }
        },
        {
          text: 'Guardar',
          handler: (data) => {
            this.updateName(data.nombre);
          }
        }
      ]
    });

    alert.present();
    this.CambiarEstablecimiento();

  }

  insertEstablecimientoContestado(idEstablecimiento: String) {
    return new Promise((resolve, reject) => {
      let sql = "INSERT INTO establecimientosContestados (idEsta) VALUES (?)";
      this.db.executeSql(sql, [idEstablecimiento]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  modificarPuntuacion(puntuacion: number) {
    return new Promise((resolve, reject) => {
      let sql = "UPDATE users SET puntuacion = ? WHERE id = ?";
      this.db.executeSql(sql, [puntuacion, this.id]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  GetEstablecimientosContestados() {
    return new Promise((resolve, reject) => {
      this.db.executeSql("SELECT * FROM establecimientosContestados", []).then((data) => {
        let arrayEstablecimientos = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            arrayEstablecimientos.push({
              id: data.rows.item(i).id,
              idEsta: data.rows.item(i).idEsta
            });
          }
        }
        resolve(arrayEstablecimientos);
      }, (error) => {
        reject(error);
      })
    })
  }

  UpdateUser(name: String, edad: number, sexo: String) {
    return new Promise((resolve, reject) => {
      let sql = "UPDATE users SET name = ?, edad = ?, sexo = ? WHERE id = ?";
      this.db.executeSql(sql, [name, edad, sexo, this.id]).then((data) => {
        console.log("nombre actualizado");
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }
  updateName(name: String) {
    return new Promise((resolve, reject) => {
      let sql = "UPDATE users SET name = ? WHERE id = ?";
      this.db.executeSql(sql, [name, this.id]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  UpdateEstablecimiento(establecimiento: String) {
    return new Promise((resolve, reject) => {
      let sql = "UPDATE users SET establecimiento = ? WHERE id = ?";
      this.db.executeSql(sql, [establecimiento, this.id]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  UpdateSonido(sonido: String) {
    return new Promise((resolve, reject) => {
      let sql = "UPDATE users SET sonido = ? WHERE id = ?";
      this.db.executeSql(sql, [sonido, this.id]).then((data) => {
        resolve(data);
        this.GetAllUsers();
      }, (error) => {
        reject(error);
      });
    });
  }

  truncate() {
    return new Promise((resolve, reject) => {
      let sql = "Delete from establecimientosContestados";
      this.db.executeSql(sql, []).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  GetAllUsers() {
    return new Promise((resolve, reject) => {
      this.db.executeSql("SELECT * FROM users", []).then((data) => {
        let arrayUsers = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            arrayUsers.push({
              id: data.rows.item(i).id,
              puntuacion: data.rows.item(i).puntuacion,
              name: data.rows.item(i).name,
              edad: data.rows.item(i).edad,
              sexo: data.rows.item(i).sexo,
              establecimiento: data.rows.item(i).establecimiento,
              sonido: data.rows.item(i).sonido,
            });
          }
        }
        resolve(arrayUsers);
        this.estadoSonido = arrayUsers[0].sonido;
      }, (error) => {
        reject(error);
      })
    })
  }

  CambiarEstablecimiento() {
    let arrayEC = []
    let arrayET = []
    this.servicioHttp.obtenerEstablecimientos().subscribe((data: any) => {
      this.GetEstablecimientosContestados().then((establ: any) => {
        arrayEC = establ;
        arrayET = data;
        let arrayEstablecimientos = []
        for (let i = 0; i < arrayET.length; i++) {
          if(arrayET[i].enabled == true){
          arrayEstablecimientos.push({
            id: arrayET[i].id
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
        if (arrayEstablecimientos.length > 0) {
          return new Promise((resolve, reject) => {
            let sql = "UPDATE users SET establecimiento = ? WHERE id = ?";
            this.db.executeSql(sql, [arrayEstablecimientos[0].id, this.id]).then((data) => {
              console.log("Establecimiento actualizado a: " + arrayEstablecimientos[0].id);
              resolve(data);
            }, (error) => {
              reject(error);
            });
          });
        } else {
          this.toastCtrl.create({
            message: "Lo sentimos, ya no hay establecimientos disponibles... Intentalo más tarde.",
            duration: 3000
          }).present();
          
          return new Promise((resolve, reject) => {
            let sql = "UPDATE users SET establecimiento = 'null' WHERE id = ?";
            this.db.executeSql(sql, [this.id]).then((data) => {
              resolve(data);
            }, (error) => {
              reject(error);
            });
          });
        }
      }, (error) => { console.log(error); })
    }, (error) => { console.log(error); })
  }

  verificar() {
    return new Promise((resolve, reject) => {
      this.db.executeSql("SELECT * FROM users", []).then((data) => {
        let usuario = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            usuario[0] = parseInt(data.rows.item(i).id)
          }
        }
        resolve(usuario);
      }, (error) => {
        reject(error);
      })
    })
  }

  GetEstablecimientos() {
    return new Promise((resolve, reject) => {
      this.db.executeSql("SELECT * FROM users", []).then((data) => {
        let establecimiento = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            establecimiento[0] = parseInt(data.rows.item(i).establecimiento)
          }
        }
        resolve(establecimiento);
      }, (error) => {
        reject(error);
      })
    })
  }

  public getSonido() {
    return this.estadoSonido;
  }
  VerificarExixtencia() {
    this.verificar().then((data: any) => {
      this.lista = data;
      if (this.lista.length == 0) {
        this.AsignarNumAl();
        //this.id = parseInt(this.Usuario[0]);
      } else {
        this.TomarID();
      }
    }, (error) => {
      console.log(error);
    })
  }

  AsignarNumAl() {
    this.id = parseInt(this.year + "" + this.month + "" + this.day + "" + this.aleatorio);
    this.CreateUser(this.id);
  }

  TomarID() {
    this.id = parseInt(this.lista[0]);
  }

  numeroAl(a, b) {
    return Math.round(Math.random() * (a + b) + (a));
  }

}
