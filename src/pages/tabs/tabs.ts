import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { PreguntasPage } from '../preguntas/preguntas';
import { ConfiguracionPage } from '../configuracion/configuracion';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = PreguntasPage;
  tab3Root = ConfiguracionPage;

  constructor() {
  }
  
}
