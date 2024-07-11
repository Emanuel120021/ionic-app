import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from '../home/home.page';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'calculadora',
        loadChildren: () =>
          import('../calculadora/calculadora.module').then(
            (m) => m.CalculadoraPageModule
          ),
      },
      {
        path: 'calendario',
        loadChildren: () =>
          import('../calendario/calendario.module').then(
            (m) => m.CalendarioPageModule
          ),
      },
      {
        path: 'maps',
        loadChildren: () =>
          import('../maps/maps.module').then((m) => m.MapsPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
