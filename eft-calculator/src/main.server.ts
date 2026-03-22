import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { config } from './app/app.config.server';

// サーバー側でアプリを起動するための関数
const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;