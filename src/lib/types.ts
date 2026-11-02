export type Mode = 'bus' | 'train';
export type Place = {id:string;name_bn:string;name_en:string;district?:string};
export type Route = {id:string;mode:Mode;name_bn:string;name_en:string;operator_name:string|null;origin:Place;destination:Place;stops:Place[];verified_at:string|null;source_url:string|null};
export type Fare = {id:string;route_id:string;class_name:string;amount_bdt:number;verified_at:string|null;source_url:string|null};
export type Tracking = {vehicle_id:string;latitude:number;longitude:number;recorded_at:string;source_name:string};
