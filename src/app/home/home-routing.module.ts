import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
