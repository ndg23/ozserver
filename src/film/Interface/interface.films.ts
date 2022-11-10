import { Document } from "mongoose";
export interface Ifilm {
  title: string;
  desc: string;
  cover: string;
  lng: string;
  country: string;
  type: string;
  createdBy: string;
  created_date: string;
  video: string;
  media: any;
}
