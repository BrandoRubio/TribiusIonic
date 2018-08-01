import { Injectable } from '@angular/core';
import { NativeAudio } from '@ionic-native/native-audio';
import { DatabaseProvider } from '../database/database';

@Injectable()
export class SoundProvider {
  intervalo
  intervaloSegundos
  sec = 2
  constructor( private nativeAudio: NativeAudio, private database: DatabaseProvider) {
    nativeAudio.preloadSimple('pop', 'assets/sounds/bop.mp3').then();
    nativeAudio.preloadSimple('correcto', 'assets/sounds/correcto.mp3').then();
    nativeAudio.preloadSimple('incorrecto', 'assets/sounds/incorrecto.mp3').then();
    nativeAudio.preloadSimple('music', 'assets/sounds/music.mp3').then();
    nativeAudio.preloadSimple('cambio', 'assets/sounds/cambio.mp3').then();
    this.intervalo = setInterval(() => this.tick(), 1000)
  }
  tick() {
    this.sec -= 1
    console.log(this.sec);
    if (this.sec <= 0) {
      clearInterval(this.intervalo)
      this.startMusic()
      console.log("fin");
    }//ionic cordova run android
  }

  playAudioPop() {
    if (this.database.getSonido() == "up") {
      this.nativeAudio.play('pop').then();
    }
  }

  playAudioCorrecto() {
    if (this.database.getSonido() == "up") {
      this.nativeAudio.play('correcto').then();
    }
  }

  playAudioIncorrecto() {
    if (this.database.getSonido() == "up") {
      this.nativeAudio.play('incorrecto').then();
    }
  }

  playCambio() {
    if (this.database.getSonido() == "up") {
      this.nativeAudio.play('cambio').then();
    }
  }

  playMusic() {
    this.nativeAudio.play('music').then();
  }

  stopMusic() {
    this.nativeAudio.stop('music').then();
  }

  startMusic() {
      if (this.database.getSonido() == "up") {
      this.nativeAudio.play('music').then();
    }
  }
}