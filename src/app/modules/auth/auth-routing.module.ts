// import { NgModule } from '@angular/core'
// import { RouterModule, Routes } from '@angular/router'
// import { LayoutComponent } from './../layout/layout.component'
// import { AuthGuard } from './guards/auth.guard'
// import { NoAuthGuard } from './guards/noAuth.guard'

// const routes: Routes = [
//   // Auth routes (guest)
//   {
//     path: '',
//     canActivate: [NoAuthGuard],
//     canActivateChild: [NoAuthGuard],
//     component: LayoutComponent,
//     data: {
//       layout: 'empty',
//     },
//     children: [
//       {
//         path: 'sign-in',
//         loadChildren: () => import('./modules/sign-in/sign-in.module').then((m) => m.AuthSignInModule),
//       },
//       {
//         path: 'sign-up',
//         loadChildren: () => import('./modules/sign-up/sign-up.module').then((m) => m.AuthSignUpModule),
//       },
//       {
//         path: 'confirmation-required',
//         loadChildren: () =>
//           import('./modules/confirmation-required/confirmation-required.module').then(
//             (m) => m.AuthConfirmationRequiredModule
//           ),
//       },
//       {
//         path: 'forgot-password',
//         loadChildren: () =>
//           import('./modules/forgot-password/forgot-password.module').then((m) => m.AuthForgotPasswordModule),
//       },
//       {
//         path: 'reset-password',
//         loadChildren: () =>
//           import('./modules/reset-password/reset-password.module').then((m) => m.AuthResetPasswordModule),
//       },
//     ],
//   },

//   // Auth routes (logged in)
//   {
//     path: '',
//     canActivate: [AuthGuard],
//     canActivateChild: [AuthGuard],
//     component: LayoutComponent,
//     data: {
//       layout: 'empty',
//     },
//     children: [
//       {
//         path: 'sign-out',
//         loadChildren: () => import('./modules/sign-out/sign-out.module').then((m) => m.AuthSignOutModule),
//       },
//       {
//         path: 'unlock-session',
//         loadChildren: () =>
//           import('./modules/unlock-session/unlock-session.module').then((m) => m.AuthUnlockSessionModule),
//       },
//     ],
//   },
// ]

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule],
// })
// export class AuthRoutingModule {}
