import { Document } from 'mongoose';
export interface Iepisode extends Document{
  epititle: string;
  epidesc: string;
  key:string;
  url:string;
}