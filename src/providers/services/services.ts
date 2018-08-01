import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ServicesProvider {
  total: number = 0
  constructor(public http: HttpClient) {
  }
  obtenerEstablecimientos() {
    return this.http.get('http://192.168.0.115:8001/Ws_establecimiento');
  }

  obtenerEstablecimiento(id_establecimiento: String) {
    return new Promise((resolve) => {
      return this.http.get('http://192.168.0.115:8001/Ws_establecimiento').forEach((data: any) => {
        let establecimiento = [];
        if (data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            if (id_establecimiento == data[i].id && data[i].enabled == true) {
              establecimiento.push({
                id: data[i].id,
                alias: data[i].alias,
                archivo_Fondo: data[i].archivo_Fondo,
                archivo_Logo: data[i].archivo_Logo,
                ciudad: data[i].ciudad,
                cp: data[i].cp,
                domicilio: data[i].domicilio,
                email: data[i].email,
                nombre: data[i].nombre,
                telefono: data[i].telefono,
              });
            }
          }
        }
        console.log(establecimiento);
        
        resolve(establecimiento);
      })

    })
  }

  GetAllQuestions(id_establecimiento: String) {
    return new Promise((resolve) => {
      this.http.get('http://192.168.0.115:8001/Ws_pregunta').forEach((data: any) => {
        this.http.get('http://192.168.0.115:8001/Ws_respuesta').forEach((dato: any) => {
          let arrayPreguntas = [];
          if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
              if (id_establecimiento == data[i].establecimiento.id && data[i].enabled == true) {
                let arrayRespuestas = [];
                let Respuestas: Object;
                if (dato.length > 0) {
                  for (var j = 0; j < dato.length; j++) {
                    if (data[i].id == dato[j].pregunta.id && dato[j].enabled == true) {
                      arrayRespuestas.push({
                        correcta: dato[j].correcta,
                        enabled: dato[j].enabled,
                        id: dato[j].id,
                        nombre: dato[j].nombre,
                        total: j,
                      });
                      Respuestas = arrayRespuestas;
                    }
                  }
                }
                arrayPreguntas.push({
                  archivo_Foto: data[i].archivo_Foto,
                  enabled: data[i].enabled,
                  establecimiento_id: data[i].establecimiento.id,
                  id: data[i].id,
                  id_Autor: data[i].id_Autor.id,
                  nombre: data[i].nombre,
                  respuestas: Respuestas
                });
              }
            }
          }
          resolve(arrayPreguntas)
        })
      })
    })
  }
  GetTotal(id_establecimiento: String) {
    this.total = 0
    return new Promise((resolve) => {
      this.http.get('http://192.168.0.115:8001/Ws_pregunta').forEach((data: any) => {
        if (data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            if (id_establecimiento == data[i].establecimiento.id && data[i].enabled == true) {
              this.total = this.total + 1
            }
          }
        }
        resolve(this.total)
      })
    })
  }
}
