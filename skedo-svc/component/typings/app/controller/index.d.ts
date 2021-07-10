// This file is created by egg-ts-helper@1.25.9
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportDoc from '../../../app/controller/doc';

declare module 'egg' {
  interface IController {
    doc: ExportDoc;
  }
}
