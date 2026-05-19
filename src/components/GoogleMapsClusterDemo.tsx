"use client";

import { GridAlgorithm, MarkerClusterer } from "@googlemaps/markerclusterer";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    initGoogleMapsDemo?: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
  }
}

type Building = {
  title: string;
  address: string;
  lat: number;
  lng: number;
  city: string;
  province: string;
  complex: string;
  imageUrl: string;
  propertyUrl: string;
};

// Oxford Properties — RAC (Richmond-Adelaide Centre), Toronto Financial District
const RAC_BUILDINGS: Building[] = [
  {
    title: "Richmond-Adelaide Centre — 120 Adelaide",
    address: "120 Adelaide Street West, Toronto, ON M5H 1P9",
    lat: 43.6492, lng: -79.3813,
    city: "Toronto", province: "ON", complex: "RAC",
    imageUrl: "https://dam.oxfordproperties.com/transform/eafe37ad-d736-477f-b35b-c65b084bdc0b/OP_120AdelaideW-RAC-Interior-Lobby-2_RGB",
    propertyUrl: "https://www.oxfordproperties.com/lease/office/120-adelaide-st-west",
  },
  {
    title: "Richmond-Adelaide Centre — 111 Richmond",
    address: "111 Richmond Street West, Toronto, ON M5H 3K6",
    lat: 43.6507, lng: -79.3826,
    city: "Toronto", province: "ON", complex: "RAC",
    imageUrl: "https://dam.oxfordproperties.com/transform/4f7aa0e5-3af9-4764-8a89-922f41f3a1ad/OP_111RichmondW-RAC-1241-011-Retouched_PHO_RGB",
    propertyUrl: "https://www.oxfordproperties.com/lease/office/111-richmond-st-west",
  },
  {
    title: "Richmond-Adelaide Centre — 85 Richmond",
    address: "85 Richmond Street West, Toronto, ON M5H 2C9",
    lat: 43.6512, lng: -79.3799,
    city: "Toronto", province: "ON", complex: "RAC",
    imageUrl: "https://resource.oxfordproperties.com/Content/property/10383/main/hero.jpg?v=639147337083368907",
    propertyUrl: "https://www.oxfordproperties.com/lease/office/85-richmond-st-west",
  },
  {
    title: "Richmond-Adelaide Centre — 130 Adelaide",
    address: "130 Adelaide Street West, Toronto, ON M5H 0A1",
    lat: 43.6487, lng: -79.3840,
    city: "Toronto", province: "ON", complex: "RAC",
    imageUrl: "https://dam.oxfordproperties.com/transform/e9a4c9ec-ffb3-4255-b0f4-b7bcb70f5840/OP_130AdelaideW-RAC-Tower-Toronto_PHO_RGB",
    propertyUrl: "https://www.oxfordproperties.com/lease/office/130-adelaide-st-west",
  },
  {
    title: "Richmond-Adelaide Centre — EY Tower",
    address: "100 Adelaide Street West, Toronto, ON M5H 0E2",
    lat: 43.6499, lng: -79.3822,
    city: "Toronto", province: "ON", complex: "RAC",
    imageUrl: "https://resource.oxfordproperties.com/Content/property/10386/main/hero.jpg?v=639147337217129983",
    propertyUrl: "https://www.oxfordproperties.com/lease/office/100-adelaide-st-west",
  },
];

// Oxford Properties — MetroCentre complex, Toronto
const METROCTR_BUILDINGS: Building[] = [
  {
    title: "MetroCentre — King Tower",
    address: "225 King Street West, Toronto, ON M5V 3M2",
    lat: 43.6468, lng: -79.3882,
    city: "Toronto", province: "ON", complex: "MetroCentre",
    imageUrl: "https://resource.oxfordproperties.com/Content/property/54020/main/hero.jpg?v=639147337246520743",
    propertyUrl: "https://www.oxfordproperties.com/lease/office/metrocentre-king-street-tower",
  },
  {
    title: "MetroCentre — Wellington Tower",
    address: "200 Wellington Street West, Toronto, ON M5V 3C7",
    lat: 43.6467, lng: -79.3880,
    city: "Toronto", province: "ON", complex: "MetroCentre",
    imageUrl: "https://resource.oxfordproperties.com/Content/property/54040/main/hero.jpg?v=639147337313583104",
    propertyUrl: "https://www.oxfordproperties.com/lease/office/metrocentre-wellington-tower",
  },
  {
    title: "MetroCentre — Retail",
    address: "200 Wellington Street West, Toronto, ON M5V 3C7",
    lat: 43.6466, lng: -79.3884,
    city: "Toronto", province: "ON", complex: "MetroCentre",
    imageUrl: "https://dam.oxfordproperties.com/transform/cb1d1118-2b55-4421-a869-2a653d058e3b/OP_225KingStW-Metrocentre-Interior-4_LowRes_RGB",
    propertyUrl: "https://www.oxfordproperties.com/lease/retail/metrocentre-retail",
  },
];

// Oxford Properties — Canada Square, Toronto (Yonge & Eglinton)
const CANADASQ_BUILDINGS: Building[] = [
  {
    title: "Canada Square — 2200 Yonge",
    address: "2200 Yonge Street, Toronto, ON M4S 2C6",
    lat: 43.7058, lng: -79.3985,
    city: "Toronto", province: "ON", complex: "Canada Square",
    imageUrl: "https://resource.oxfordproperties.com/Content/property/26143/main/hero.jpg?v=639147337356500448",
    propertyUrl: "https://www.oxfordproperties.com/lease/office/2200-yonge-street",
  },
  {
    title: "Canada Square — 2190 Yonge",
    address: "2190 Yonge Street, Toronto, ON M4S 3C8",
    lat: 43.7052, lng: -79.3984,
    city: "Toronto", province: "ON", complex: "Canada Square",
    imageUrl: "https://dam.oxfordproperties.com/transform/609113b5-39a0-4fef-ae81-cae235831673/OP_Canada_Square_Toronto_Exterior_A_PHO_RGB",
    propertyUrl: "https://www.oxfordproperties.com/lease/office/2190-yonge-street",
  },
  {
    title: "Canada Square — 2180 Yonge",
    address: "2180 Yonge Street, Toronto, ON M4S 2A9",
    lat: 43.7046, lng: -79.3983,
    city: "Toronto", province: "ON", complex: "Canada Square",
    imageUrl: "https://resource.oxfordproperties.com/Content/property/26142/main/hero.jpg?v=639147337381329726",
    propertyUrl: "https://www.oxfordproperties.com/lease/office/2180-yonge-street",
  },
];

// Oxford Properties — WaterPark Place, Toronto Waterfront
const WATERPRK_BUILDINGS: Building[] = [
  {
    title: "WaterPark Place — 20 Bay",
    address: "20 Bay Street, Toronto, ON M5J 2N8",
    lat: 43.6416, lng: -79.3779,
    city: "Toronto", province: "ON", complex: "WaterPark Place",
    imageUrl: "https://resource.oxfordproperties.com/Content/property/31110/main/hero.jpg?v=639147337393152559",
    propertyUrl: "https://www.oxfordproperties.com/lease/office/20-bay-street",
  },
  {
    title: "WaterPark Place — 10 Bay",
    address: "10 Bay Street, Toronto, ON M5J 2S3",
    lat: 43.6412, lng: -79.3776,
    city: "Toronto", province: "ON", complex: "WaterPark Place",
    imageUrl: "https://resource.oxfordproperties.com/Content/property/31111/main/hero.jpg?v=639147337412260963",
    propertyUrl: "https://www.oxfordproperties.com/lease/office/10-bay-street",
  },
  {
    title: "RBC WaterPark Place",
    address: "88 Queens Quay West, Toronto, ON M5J 0B6",
    lat: 43.6409, lng: -79.3782,
    city: "Toronto", province: "ON", complex: "WaterPark Place",
    imageUrl: "https://resource.oxfordproperties.com/Content/property/31116/main/hero.jpg?v=639147337466351912",
    propertyUrl: "https://www.oxfordproperties.com/lease/office/88-queens-quay-west",
  },
];

// Oxford Properties — Vaughan Industrial Park
const ROYAL_BUILDINGS: Building[] = [
  {
    title: "91 Royal Group Crescent",
    address: "91 Royal Group Crescent, Vaughan, ON L4H 1X9",
    lat: 43.7665, lng: -79.6260,
    city: "Vaughan", province: "ON", complex: "Vaughan Ind. Park",
    imageUrl: "https://dam.oxfordproperties.com/transform/2fe1e609-3346-409c-8ade-d302fd2ca2b8/OP_91RoyalGroup-Vaughan-IndPark-Exterior-Sep2020_PHO_RGB",
    propertyUrl: "https://www.oxfordproperties.com/lease/industrial/91-royal-group-crescent",
  },
  {
    title: "71 Royal Group Crescent",
    address: "71 Royal Group Crescent, Vaughan, ON L4H 1X9",
    lat: 43.7658, lng: -79.6251,
    city: "Vaughan", province: "ON", complex: "Vaughan Ind. Park",
    imageUrl: "https://dam.oxfordproperties.com/transform/6ee49b4b-edd2-4b60-949a-d806ba366a04/OP_71RoyalGroup-Vaughan-IndPark-Exterior-Sep2020_PHO_RGB",
    propertyUrl: "https://www.oxfordproperties.com/lease/industrial/71-royal-group-crescent",
  },
  {
    title: "111 Royal Group Crescent",
    address: "111 Royal Group Crescent, Vaughan, ON L4H 1X9",
    lat: 43.7692, lng: -79.6291,
    city: "Vaughan", province: "ON", complex: "Vaughan Ind. Park",
    imageUrl: "https://dam.oxfordproperties.com/transform/957f707e-79ad-4df8-b9cf-9a1b5d964f84/OP_RoyalGroup-Vaughan-IndPark-Exterior5-Sep2020_PHO_RGB",
    propertyUrl: "https://www.oxfordproperties.com/lease/industrial/111-royal-group-crescent",
  },
  {
    title: "101 Royal Group Crescent",
    address: "101 Royal Group Crescent, Vaughan, ON L4H 1X9",
    lat: 43.7679, lng: -79.6280,
    city: "Vaughan", province: "ON", complex: "Vaughan Ind. Park",
    imageUrl: "https://dam.oxfordproperties.com/transform/cd672299-c2f4-48ca-bb38-4a449385e9a5/OP_111RoyalGroup-Vaughan-IndPark-Exterior-Sep2020_PHO_RGB",
    propertyUrl: "https://www.oxfordproperties.com/lease/industrial/101-royal-group-crescent",
  },
  {
    title: "100 Royal Group Crescent",
    address: "100 Royal Group Crescent, Vaughan, ON L4H 1X9",
    lat: 43.7672, lng: -79.6270,
    city: "Vaughan", province: "ON", complex: "Vaughan Ind. Park",
    imageUrl: "https://dam.oxfordproperties.com/transform/a47d685b-c3b4-414b-83d7-68efcbda75c8/OP_100RoyalGroup-Vaughan-IndPark-Exterior-Sep2020_PHO_RGB",
    propertyUrl: "https://www.oxfordproperties.com/lease/industrial/100-royal-group-crescent",
  },
];

// Oxford Properties — Brampton Business Park
const BRAMPTON_BUILDINGS: Building[] = [
  {
    title: "9050 Airport Road",
    address: "9050 Airport Road, Brampton, ON L6S 6G9",
    lat: 43.7474, lng: -79.7014,
    city: "Brampton", province: "ON", complex: "Brampton Bus. Park",
    imageUrl: "https://dam.oxfordproperties.com/transform/2f5324af-b3ef-4064-a555-78f405419c37/OP_9050AirportRd-BramptonBusPark-Exterior4_LowRes_RGB",
    propertyUrl: "https://www.oxfordproperties.com/lease/industrial/9050-airport-rd",
  },
  {
    title: "9150 Airport Road",
    address: "9150 Airport Road, Brampton, ON L6S 6G9",
    lat: 43.7501, lng: -79.7050,
    city: "Brampton", province: "ON", complex: "Brampton Bus. Park",
    imageUrl: "https://dam.oxfordproperties.com/transform/21c4aa6a-d132-498f-bddc-60fb5104f481/OP_9150AirportRd-BramptonBusPark-Exterior3_PHO_RGB",
    propertyUrl: "https://www.oxfordproperties.com/lease/industrial/9150-airport-rd",
  },
  {
    title: "9200 Airport Road",
    address: "9200 Airport Road, Brampton, ON L6S 6G1",
    lat: 43.7515, lng: -79.7068,
    city: "Brampton", province: "ON", complex: "Brampton Bus. Park",
    imageUrl: "https://dam.oxfordproperties.com/transform/950243a1-85a3-4012-82fa-41dfdbb9c898/OP_9200AirportRd-BramptonBusPark-Exterior3_PHO_RGB",
    propertyUrl: "https://www.oxfordproperties.com/lease/industrial/9200-airport-rd",
  },
  {
    title: "9250 Airport Road",
    address: "9250 Airport Road, Brampton, ON L6S 6G6",
    lat: 43.7484, lng: -79.7041,
    city: "Brampton", province: "ON", complex: "Brampton Bus. Park",
    imageUrl: "https://dam.oxfordproperties.com/transform/2deb0cbd-e5d1-4256-966c-5daa7671c3f9/OP_9250AirportRd-BramptonBusPark-Exterior_PHO_RGB",
    propertyUrl: "https://www.oxfordproperties.com/lease/industrial/9250-airport-rd",
  },
  {
    title: "255 Chrysler Drive",
    address: "255 Chrysler Drive, Brampton, ON L6S 5Z7",
    lat: 43.7459, lng: -79.7105,
    city: "Brampton", province: "ON", complex: "Brampton Bus. Park",
    imageUrl: "https://dam.oxfordproperties.com/transform/8467b10c-7d47-41f6-837a-c8b25379c5ea/OP_255ChryslerDr-BramptonBusPark-Exterior1_PHO_RGB",
    propertyUrl: "https://www.oxfordproperties.com/lease/industrial/255-chrysler-dr",
  },
];

// Oxford Properties — James Snow Business Park, Milton
const JAMES_SNOW_BUILDINGS: Building[] = [
  {
    title: "10725 Louis St. Laurent Avenue",
    address: "10725 Louis St. Laurent Avenue, Milton, ON L9T 2X8",
    lat: 43.5057, lng: -79.8385,
    city: "Milton", province: "ON", complex: "James Snow",
    imageUrl: "https://dam.oxfordproperties.com/transform/DAT_Photo_LowRes_1MG_Jpg/61ee0c0a-c776-4bfa-a7ef-376ab250b051/OP_James-Snow-Bdg-C_01_PHO",
    propertyUrl: "https://www.oxfordproperties.com/lease/industrial/10725-Louis-St-Laurent-Avenue",
  },
  {
    title: "6440 Fifth Line",
    address: "6440 Fifth Line, Milton, ON L9T 2X8",
    lat: 43.5246, lng: -79.8146,
    city: "Milton", province: "ON", complex: "James Snow",
    imageUrl: "https://dam.oxfordproperties.com/transform/DAT_Photo_LowRes_1MG_Jpg/a9245307-af79-4bf5-9661-074ad0d5159d/OP_James-Snow-Bdg-D_2_PHO",
    propertyUrl: "https://www.oxfordproperties.com/lease/industrial/6440-Fifth-Line",
  },
  {
    title: "905 James Snow Parkway S",
    address: "905 James Snow Parkway S, Milton, ON L9T 2X8",
    lat: 43.5343, lng: -79.8486,
    city: "Milton", province: "ON", complex: "James Snow",
    imageUrl: "https://dam.oxfordproperties.com/transform/DAT_Photo_LowRes_1MG_Jpg/de99ac3c-d36d-412c-851c-0ab3e7aeb1f4/OP_James-Snow-Bdg-E2_2_PHO",
    propertyUrl: "https://www.oxfordproperties.com/lease/industrial/905-James-Snow-Parkway-S",
  },
  {
    title: "955 James Snow Parkway S",
    address: "955 James Snow Parkway S, Milton, ON L9T 2X8",
    lat: 43.5328, lng: -79.8379,
    city: "Milton", province: "ON", complex: "James Snow",
    imageUrl: "https://dam.oxfordproperties.com/transform/DAT_Photo_LowRes_1MG_Jpg/cbbde90c-00e9-4a4a-bf63-2522ca34b114/OP_James-Snow-Bdg-E1_2_PHO",
    propertyUrl: "https://www.oxfordproperties.com/lease/industrial/955-James-Snow-Parkway-S",
  },
];

// Oxford Properties — Centennial Place, Calgary Eau Claire
const CENTENNIAL_BUILDINGS: Building[] = [
  {
    title: "Centennial Place East Tower",
    address: "520 - 3 Avenue SW, Calgary, AB T2P 0R3",
    lat: 51.0508, lng: -114.0722,
    city: "Calgary", province: "AB", complex: "Centennial Place",
    imageUrl: "https://dam.oxfordproperties.com/transform/b8c2cdd8-8d00-4909-aecf-7ab2c902e691/OP_CentennialPlace-Calgary-Exterior-402-003_PHO_RGB",
    propertyUrl: "https://www.oxfordproperties.com/lease/office/centennial-place-east-tower",
  },
  {
    title: "Centennial Place West Tower",
    address: "250 - 5 Street SW, Calgary, AB T2P 0R4",
    lat: 51.0507, lng: -114.0729,
    city: "Calgary", province: "AB", complex: "Centennial Place",
    imageUrl: "https://dam.oxfordproperties.com/transform/30c6fa4c-9530-471c-ac63-6aa432424967/OP_CentennialPlace-Calgary-Exterior-402-002_PHO_RGB",
    propertyUrl: "https://www.oxfordproperties.com/lease/office/centennial-place-west-tower",
  },
];

// Oxford Properties — Oxford Airport Business Park, Calgary NE
const AIRPORTTRL_BUILDINGS: Building[] = [
  {
    title: "OABP Building B",
    address: "10081 - 17 Street NE, Calgary, AB T3J 0P8",
    lat: 51.1400, lng: -114.0245,
    city: "Calgary", province: "AB", complex: "Oxford Airport",
    imageUrl: "https://dam.oxfordproperties.com/transform/d47d6580-9751-4fe1-9faa-6cdcb28339a9/OP_AirportBusinessPark_BuildingB_18Web_PHO",
    propertyUrl: "https://www.oxfordproperties.com/lease/industrial/oxford-airport-businesspark-b1",
  },
  {
    title: "OABP Building D",
    address: "10301 - 19 Street NE, Calgary, AB T3J 0R1",
    lat: 51.1396, lng: -114.0238,
    city: "Calgary", province: "AB", complex: "Oxford Airport",
    imageUrl: "https://dam.oxfordproperties.com/transform/6ab2c806-fceb-459f-b515-65fdf998238f/OP_AirportBusinessPark_BuildingD_35Web_PHO",
    propertyUrl: "https://www.oxfordproperties.com/lease/industrial/oxford-airport-businesspark-d1",
  },
  {
    title: "OABP Building E",
    address: "1845 - 104 Avenue NE, Calgary, AB T3J 0R2",
    lat: 51.1392, lng: -114.0231,
    city: "Calgary", province: "AB", complex: "Oxford Airport",
    imageUrl: "https://dam.oxfordproperties.com/transform/390f00d4-7502-4be5-8ef0-31b6a4438bc0/OP_AirportBusinessPark_BuildingE_32Web_PHO",
    propertyUrl: "https://www.oxfordproperties.com/lease/industrial/oxford-airport-business-park-e",
  },
  {
    title: "OABP Building F",
    address: "1820 - 100 Avenue NE, Calgary, AB T3J 0P7",
    lat: 51.1404, lng: -114.0231,
    city: "Calgary", province: "AB", complex: "Oxford Airport",
    imageUrl: "https://dam.oxfordproperties.com/transform/6b262135-6c99-4391-8554-23d583660565/OP_AirportBusinessPark_BuildingF_1Web_PHO",
    propertyUrl: "https://www.oxfordproperties.com/lease/industrial/oxford-airport-business-park-f",
  },
  {
    title: "OABP Building G",
    address: "1980 - 104 Avenue NE, Calgary, AB T3J 0R2",
    lat: 51.1388, lng: -114.0245,
    city: "Calgary", province: "AB", complex: "Oxford Airport",
    imageUrl: "https://dam.oxfordproperties.com/transform/d14cc84e-f10a-4ff8-8b24-a9842d6a96df/OP_AirportBusinessPark_BuildingG_46Web_PHO",
    propertyUrl: "https://www.oxfordproperties.com/lease/industrial/oxford-airport-businesspark-g",
  },
  {
    title: "OABP Building H",
    address: "1710 - 104 Avenue NE, Calgary, AB T3J 5H6",
    lat: 51.1408, lng: -114.0238,
    city: "Calgary", province: "AB", complex: "Oxford Airport",
    imageUrl: "https://dam.oxfordproperties.com/transform/bfbbcdee-80e3-4f93-a9e2-072855cc162f/OP_AirportBusinessPark_BuildingH_IMG_6701_PHO",
    propertyUrl: "https://www.oxfordproperties.com/lease/industrial/oxford-airport-businesspark-h",
  },
  {
    title: "OABP Building I",
    address: "1610 - 104 Avenue NE, Calgary, AB T3J 0T5",
    lat: 51.1384, lng: -114.0224,
    city: "Calgary", province: "AB", complex: "Oxford Airport",
    imageUrl: "https://dam.oxfordproperties.com/transform/5086cf93-8772-4ea1-bb3c-35223c831301/OP_AirportBusinessPark_BuildingI_47Web_PHO",
    propertyUrl: "https://www.oxfordproperties.com/lease/industrial/oxford-airport-businesspark-i",
  },
  {
    title: "OABP Building L",
    address: "1625 - 100th Avenue NE, Calgary, AB T3J 3N5",
    lat: 51.1412, lng: -114.0252,
    city: "Calgary", province: "AB", complex: "Oxford Airport",
    imageUrl: "https://dam.oxfordproperties.com/transform/0c92d7e6-5f25-408d-86c6-030e93a31509/OP_AirportBusinessPark_BuildingL_1Web_002_PHO",
    propertyUrl: "https://www.oxfordproperties.com/lease/industrial/oxford-airport-businesspark-l",
  },
];

// Oxford Properties — Cityview Business Park, Edmonton South
const CITYVIEW_BUILDINGS: Building[] = [
  { title: "Cityview Business Park — Building 1",  address: "6304 - 6330 Roper Road NW, Edmonton, AB T6B 3P9",  lat: 53.5002, lng: -113.4220, city: "Edmonton", province: "AB", complex: "Cityview", imageUrl: "https://resource.oxfordproperties.com/Content/property/58651/main/hero.jpg?v=639147338458807351", propertyUrl: "https://www.oxfordproperties.com/lease/industrial/cityview-building-1" },
  { title: "Cityview Business Park — Building 2",  address: "6334 - 6358 Roper Road NW, Edmonton, AB T6B 3P9",  lat: 53.4998, lng: -113.4212, city: "Edmonton", province: "AB", complex: "Cityview", imageUrl: "https://resource.oxfordproperties.com/Content/property/58661/main/hero.jpg?v=639147338469289217", propertyUrl: "https://www.oxfordproperties.com/lease/industrial/cityview-building-2" },
  { title: "Cityview Business Park — Building 3",  address: "6362 - 6386 Roper Road NW, Edmonton, AB T6B 3P9",  lat: 53.4994, lng: -113.4204, city: "Edmonton", province: "AB", complex: "Cityview", imageUrl: "https://resource.oxfordproperties.com/Content/property/58671/main/hero.jpg?v=639147338480820858", propertyUrl: "https://www.oxfordproperties.com/lease/industrial/cityview-building-3" },
  { title: "Cityview Business Park — Building 4",  address: "6404 - 6418 Roper Road NW, Edmonton, AB T6B 3P9",  lat: 53.4990, lng: -113.4196, city: "Edmonton", province: "AB", complex: "Cityview", imageUrl: "https://resource.oxfordproperties.com/Content/property/58681/main/hero.jpg?v=639147338498516312", propertyUrl: "https://www.oxfordproperties.com/lease/industrial/cityview-building-4" },
  { title: "Cityview Business Park — Building 5",  address: "6442 - 6468 Roper Road NW, Edmonton, AB T6B 3P9",  lat: 53.4986, lng: -113.4188, city: "Edmonton", province: "AB", complex: "Cityview", imageUrl: "https://dam.oxfordproperties.com/transform/5d001d8a-4852-40a7-8a19-db06eef164ea/OP_CityView-BusinessPark-Edmonton-Building5-View2_LowRes_RGB", propertyUrl: "https://www.oxfordproperties.com/lease/industrial/cityview-building-5" },
  { title: "Cityview Business Park — Building 6",  address: "6424 - 6438 Roper Road NW, Edmonton, AB T6B 3P9",  lat: 53.4982, lng: -113.4180, city: "Edmonton", province: "AB", complex: "Cityview", imageUrl: "https://dam.oxfordproperties.com/transform/a59d39a2-b10c-4b78-9cc1-135ba1c5f8c9/OP_CityView-BusinessPark-Edmonton-Building6-View2_LowRes_RGB", propertyUrl: "https://www.oxfordproperties.com/lease/industrial/cityview-building-6" },
  { title: "Cityview Business Park — Building 7",  address: "6474 - 6498 Roper Road NW, Edmonton, AB T6B 3P9",  lat: 53.4978, lng: -113.4172, city: "Edmonton", province: "AB", complex: "Cityview", imageUrl: "https://dam.oxfordproperties.com/transform/3aabfc88-7cbb-4356-81aa-27b8d67a1316/OP_CityView-BusinessPark-Edmonton-Building7-View1_PHO_RGB", propertyUrl: "https://www.oxfordproperties.com/lease/industrial/cityview-building-7" },
  { title: "Cityview Business Park — Building 8",  address: "6348 - 6392 50 Street NW, Edmonton, AB T6B 2N7",  lat: 53.4974, lng: -113.4164, city: "Edmonton", province: "AB", complex: "Cityview", imageUrl: "https://dam.oxfordproperties.com/transform/9f5a58b8-03d4-4964-8b2a-58aa6480bb82/OP_CityviewBusinessPark_Building8_8-020_PHO", propertyUrl: "https://www.oxfordproperties.com/lease/industrial/cityview-building-8" },
  { title: "Cityview Business Park — Building 9",  address: "6304 - 6344 50 Street NW, Edmonton, AB T6B 2N7",  lat: 53.4970, lng: -113.4156, city: "Edmonton", province: "AB", complex: "Cityview", imageUrl: "https://dam.oxfordproperties.com/transform/bec63d98-cd3f-400b-a73d-f0d92d50527d/OP_CityviewBusinessPark_Building9_SCM_052_PHO", propertyUrl: "https://www.oxfordproperties.com/lease/industrial/cityview-building-9" },
  { title: "Cityview Business Park — Building 10", address: "6248 - 6292 50 Street NW, Edmonton, AB T6B 2N7", lat: 53.4966, lng: -113.4148, city: "Edmonton", province: "AB", complex: "Cityview", imageUrl: "https://dam.oxfordproperties.com/transform/433dbb55-e3f1-41fd-8fe5-040025559407/OP_CityviewBusinessPark_Building10_10-025_PHO", propertyUrl: "https://www.oxfordproperties.com/lease/industrial/cityview-building-10" },
  { title: "Cityview Business Park — Building 11", address: "6204 - 6244 50 Street NW, Edmonton, AB T6B 2N7", lat: 53.4996, lng: -113.4148, city: "Edmonton", province: "AB", complex: "Cityview", imageUrl: "https://resource.oxfordproperties.com/Content/property/58751/main/hero.jpg?v=639147338605820463", propertyUrl: "https://www.oxfordproperties.com/lease/industrial/cityview-building-11" },
  { title: "Cityview Business Park — Building 12", address: "#2-58, 6194 50th Street NW, Edmonton, AB T6B 2N7", lat: 53.4988, lng: -113.4156, city: "Edmonton", province: "AB", complex: "Cityview", imageUrl: "https://dam.oxfordproperties.com/transform/27aca0f1-bec8-4e08-a2f8-2e538f23dd92/OP_CityviewBusinessPark_Building12_12-012_PHO", propertyUrl: "https://www.oxfordproperties.com/lease/industrial/cityview-building-12" },
  { title: "Cityview Business Park — Building 14", address: "6130 - 6188 50 Street NW, Edmonton, AB T6B 2N7", lat: 53.4980, lng: -113.4164, city: "Edmonton", province: "AB", complex: "Cityview", imageUrl: "https://resource.oxfordproperties.com/Content/property/58771/main/hero.jpg?v=639147338628107241", propertyUrl: "https://www.oxfordproperties.com/lease/industrial/cityview-building-14" },
  { title: "Cityview — Retail",                    address: "6104 - 6114 50th Street NW, Edmonton, AB T6B 2N7",  lat: 53.4972, lng: -113.4172, city: "Edmonton", province: "AB", complex: "Cityview", imageUrl: "https://resource.oxfordproperties.com/Content/property/58791/main/hero.jpg?v=639147338638160480", propertyUrl: "https://www.oxfordproperties.com/lease/industrial/cityview-retail" },
];

// Oxford Properties — Queensborough Logistics Park, New Westminster BC
const BOYD501_BUILDINGS: Building[] = [
  {
    title: "Queensborough Logistics Park — Damco Building",
    address: "549 Duncan Street, New Westminster, BC V3M 5K2",
    lat: 49.1862, lng: -122.9462,
    city: "New Westminster", province: "BC", complex: "Queensborough",
    imageUrl: "https://dam.oxfordproperties.com/transform/2cfec412-21b3-4ab5-b2c2-f1595caa44b9/OP_QueensboroughLogisticsPark_Building1_Damco_01_PHO",
    propertyUrl: "https://www.oxfordproperties.com/lease/industrial/queensborough-damco-building",
  },
  {
    title: "Queensborough Logistics Park — Building 2",
    address: "425 Boyne Street, New Westminster, BC V3M 5K2",
    lat: 49.1858, lng: -122.9456,
    city: "New Westminster", province: "BC", complex: "Queensborough",
    imageUrl: "https://dam.oxfordproperties.com/transform/025981c6-71f7-4b48-abff-4390f870730a/OP_QueensboroughLogisticsPark_Building2_QLC_01_PHO",
    propertyUrl: "https://www.oxfordproperties.com/lease/industrial/queensborough-building-2",
  },
  {
    title: "Queensborough Logistics Park — Building 3",
    address: "415 Boyne Street, New Westminster, BC V3M 5K3",
    lat: 49.1854, lng: -122.9450,
    city: "New Westminster", province: "BC", complex: "Queensborough",
    imageUrl: "https://dam.oxfordproperties.com/transform/a53e75bd-63ea-4594-bc2f-b7f3dde0358d/OP_QueensboroughLogisticsPark_Building3_QLC3_07_PHO",
    propertyUrl: "https://www.oxfordproperties.com/lease/industrial/queensborough-building-3",
  },
];

// Oxford Properties — Riverbend Business Park, Burnaby BC
const WIGGINS_BUILDINGS: Building[] = [
  { title: "Riverbend Business Park — Building 1", address: "8211 Fraser Reach Court, Burnaby, BC V3N 2V7", lat: 49.1855, lng: -122.9742, city: "Burnaby", province: "BC", complex: "Riverbend", imageUrl: "https://dam.oxfordproperties.com/transform/eb24ba6c-700a-4195-9630-e736a989bff8/OP_RiverbendBusPark-B1-Burnaby-View17_LowRes_RGB", propertyUrl: "https://www.oxfordproperties.com/lease/industrial/riverbend-building-1" },
  { title: "Riverbend Business Park — Building 2", address: "8220 Fraser Reach Court, Burnaby, BC V3N 2V7", lat: 49.1852, lng: -122.9736, city: "Burnaby", province: "BC", complex: "Riverbend", imageUrl: "https://resource.oxfordproperties.com/Content/property/52351/main/hero.jpg?v=639147338913389667", propertyUrl: "https://www.oxfordproperties.com/lease/industrial/riverbend-building-2" },
  { title: "Riverbend Business Park — Building 3", address: "5250 Riverbend Dr., Burnaby, BC V3N 0G2", lat: 49.1849, lng: -122.9730, city: "Burnaby", province: "BC", complex: "Riverbend", imageUrl: "https://resource.oxfordproperties.com/Content/property/52361/main/hero.jpg?v=639147338933494640", propertyUrl: "https://www.oxfordproperties.com/lease/industrial/riverbend-building-3" },
  { title: "Riverbend Business Park — Building 4", address: "8340 Fraser Reach Court, Burnaby, BC V3N 5G4", lat: 49.1858, lng: -122.9730, city: "Burnaby", province: "BC", complex: "Riverbend", imageUrl: "https://resource.oxfordproperties.com/Content/property/52371/main/hero.jpg?v=639147338970609660", propertyUrl: "https://www.oxfordproperties.com/lease/industrial/riverbend-building-4" },
  { title: "Riverbend Business Park — Building 5", address: "8351 Fraser Reach Court, Burnaby, BC V3N 0G2", lat: 49.1846, lng: -122.9742, city: "Burnaby", province: "BC", complex: "Riverbend", imageUrl: "https://resource.oxfordproperties.com/Content/property/52381/main/hero.jpg?v=639147338986566083", propertyUrl: "https://www.oxfordproperties.com/lease/industrial/riverbend-building-5" },
  { title: "Riverbend Business Park — Building 6", address: "8261 Fraser Reach Court, Burnaby, BC V3N 2V7", lat: 49.1862, lng: -122.9748, city: "Burnaby", province: "BC", complex: "Riverbend", imageUrl: "https://resource.oxfordproperties.com/Content/property/52391/main/hero.jpg?v=639147339024320592", propertyUrl: "https://www.oxfordproperties.com/lease/industrial/riverbend-building-6" },
];

const ALL_BUILDINGS: Building[] = [
  ...RAC_BUILDINGS,
  ...METROCTR_BUILDINGS,
  ...CANADASQ_BUILDINGS,
  ...WATERPRK_BUILDINGS,
  ...ROYAL_BUILDINGS,
  ...BRAMPTON_BUILDINGS,
  ...JAMES_SNOW_BUILDINGS,
  ...CENTENNIAL_BUILDINGS,
  ...AIRPORTTRL_BUILDINGS,
  ...CITYVIEW_BUILDINGS,
  ...BOYD501_BUILDINGS,
  ...WIGGINS_BUILDINGS,
];

// Centered to show Ontario, Alberta, and BC clusters
const MAP_CENTER = { lat: 50.0, lng: -100.0 };
const INITIAL_ZOOM = 4;

// Derive a short context label from the markers in a cluster.
// Single complex → complex name. Single city → city name.
// Multiple cities, one province → province abbreviation.
// Multiple provinces → no label.
function clusterLabel(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  markers: any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  markerMeta: Map<any, { city: string; province: string; complex: string }>,
): string {
  const complexes = new Set<string>();
  const cities = new Set<string>();
  const provinces = new Set<string>();
  for (const m of markers) {
    const meta = markerMeta.get(m);
    if (meta) {
      complexes.add(meta.complex);
      cities.add(meta.city);
      provinces.add(meta.province);
    }
  }
  if (complexes.size === 1) return [...complexes][0];
  if (cities.size === 1) return [...cities][0];
  if (provinces.size === 1) return [...provinces][0];
  return "";
}

// Returns both the SVG string and the total width so the renderer can set scaledSize + anchor.
function clusterSvg(count: number, label: string): { svg: string; width: number; height: number } {
  const hasLabel = label.length > 0;

  // Approximate pill width: ~5.8 px per char at font-size 9 + 16 px horizontal padding
  const pillW = hasLabel ? Math.max(50, Math.ceil(label.length * 5.8) + 16) : 50;
  const svgW = pillW;
  const cx = svgW / 2;
  const totalH = hasLabel ? 68 : 50;

  const pill = hasLabel
    ? [
        `<rect x="1" y="52" width="${svgW - 2}" height="15" rx="7.5" fill="#EA4335"/>`,
        `<text x="${cx}" y="63" fill="white" font-size="9" font-family="Arial" font-weight="bold" text-anchor="middle">${label}</text>`,
      ].join("")
    : "";

  return {
    svg: [
      `<svg width="${svgW}" height="${totalH}" viewBox="0 0 ${svgW} ${totalH}" xmlns="http://www.w3.org/2000/svg">`,
      `<circle cx="${cx}" cy="25" r="25" fill="#EA4335" fill-opacity="0.25"/>`,
      `<circle cx="${cx}" cy="25" r="20" fill="#EA4335"/>`,
      `<circle cx="${cx}" cy="25" r="16" fill="white"/>`,
      `<text x="${cx}" y="30" fill="#EA4335" font-size="13" font-family="Arial" font-weight="bold" text-anchor="middle">${count}</text>`,
      pill,
      `</svg>`,
    ].join(""),
    width: svgW,
    height: totalH,
  };
}

function loadMapsScript(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve();
      return;
    }
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      window.initGoogleMapsDemo = resolve;
      return;
    }
    window.initGoogleMapsDemo = resolve;
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker&loading=async&callback=initGoogleMapsDemo`;
    script.async = true;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export function GoogleMapsClusterDemo({ mapHeight = 460 }: { mapHeight?: number }) {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing-key" | "error">("loading");
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey) {
      setStatus("missing-key");
      return;
    }

    let cancelled = false;

    loadMapsScript(apiKey)
      .then(() => {
        if (cancelled || !mapDivRef.current) return;

        const map = new window.google.maps.Map(mapDivRef.current, {
          zoom: INITIAL_ZOOM,
          center: MAP_CENTER,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "DEMO_MAP_ID",
        });

        const infoWindow = new window.google.maps.InfoWindow();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const markers: any[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const markerMeta = new Map<any, { city: string; province: string; complex: string }>();

        for (const building of ALL_BUILDINGS) {
          const pinEl = document.createElement("div");
          pinEl.style.cssText = "cursor:pointer;transition:transform 0.15s ease;";
          pinEl.innerHTML = `<svg width="30" height="42" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg">
  <filter id="bpin-shadow" x="-30%" y="-20%" width="160%" height="150%">
    <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#00000055"/>
  </filter>
  <path d="M15 0C6.716 0 0 6.716 0 15c0 9.665 13.41 25.133 14.38 26.225a.82.82 0 001.24 0C16.59 40.133 30 24.665 30 15 30 6.716 23.284 0 15 0z" fill="#EA4335" filter="url(#bpin-shadow)"/>
  <circle cx="15" cy="15" r="11" fill="white"/>
  <rect x="7" y="8" width="16" height="14" rx="1" fill="#EA4335"/>
  <rect x="9"  y="10" width="3" height="2.5" rx="0.4" fill="white"/>
  <rect x="13.5" y="10" width="3" height="2.5" rx="0.4" fill="white"/>
  <rect x="18" y="10" width="3" height="2.5" rx="0.4" fill="white"/>
  <rect x="9"  y="14" width="3" height="2.5" rx="0.4" fill="white"/>
  <rect x="13.5" y="14" width="3" height="2.5" rx="0.4" fill="white"/>
  <rect x="18" y="14" width="3" height="2.5" rx="0.4" fill="white"/>
  <rect x="12.5" y="18" width="5" height="4" rx="0.4" fill="white"/>
</svg>`;
          pinEl.addEventListener("mouseenter", () => { pinEl.style.transform = "scale(1.2)"; });
          pinEl.addEventListener("mouseleave", () => { pinEl.style.transform = "scale(1)"; });

          const marker = new window.google.maps.marker.AdvancedMarkerElement({
            position: { lat: building.lat, lng: building.lng },
            map,
            title: building.title,
            content: pinEl,
          });

          markerMeta.set(marker, { city: building.city, province: building.province, complex: building.complex });

          marker.addListener("gmp-click", () => {
            infoWindow.setContent(
              `<div style="width:220px;font-family:sans-serif;padding:2px 0">` +
                `<img src="${building.imageUrl}" width="220" height="120" style="object-fit:cover;display:block;border-radius:4px;margin-bottom:8px" />` +
                `<strong style="font-size:13px;line-height:1.4;display:block;margin-bottom:4px;color:#000;font-weight:bold">${building.title}</strong>` +
                `<span style="font-size:11px;color:#666;display:block;margin-bottom:6px">${building.address}</span>` +
                `<a href="${building.propertyUrl}" target="_blank" rel="noopener noreferrer" style="font-size:11px;color:#1a73e8;display:block">View property &rarr;</a>` +
                `</div>`,
            );
            infoWindow.open({ anchor: marker, map });
          });

          markers.push(marker);
        }

        new MarkerClusterer({
          map,
          markers,
          algorithm: new GridAlgorithm({ gridSize: 60 }),
          renderer: {
            render(cluster) {
              const { count, position, markers: clusterMarkers = [] } = cluster;
              const label = clusterLabel(clusterMarkers, markerMeta);
              const { svg, width: iconW, height: iconH } = clusterSvg(count, label);

              const svgContainer = document.createElement("div");
              svgContainer.innerHTML = svg;
              const svgEl = svgContainer.firstElementChild as HTMLElement;
              // shift element down so the circle center (y=25) sits at the cluster position
              svgEl.style.marginBottom = `${25 - iconH}px`;
              return new window.google.maps.marker.AdvancedMarkerElement({
                position,
                content: svgEl,
                zIndex: 1000 + count,
              });
            },
          },
        });

        if (!cancelled) setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
      delete window.initGoogleMapsDemo;
    };
  }, [apiKey]);

  if (status === "missing-key") {
    return (
      <div
        style={{
          padding: "2rem",
          borderRadius: "8px",
          border: "1px dashed var(--neutral-alpha-medium)",
          textAlign: "center",
          color: "var(--neutral-on-background-weak)",
          fontSize: "14px",
        }}
      >
        Add{" "}
        <code style={{ background: "var(--neutral-alpha-weak)", padding: "2px 6px", borderRadius: "4px" }}>
          NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        </code>{" "}
        to{" "}
        <code style={{ background: "var(--neutral-alpha-weak)", padding: "2px 6px", borderRadius: "4px" }}>
          .env.local
        </code>{" "}
        to display the live demo.
      </div>
    );
  }

  if (status === "error") {
    return (
      <div
        style={{
          padding: "2rem",
          borderRadius: "8px",
          border: "1px dashed var(--neutral-alpha-medium)",
          textAlign: "center",
          color: "var(--danger-on-background-weak)",
          fontSize: "14px",
        }}
      >
        Failed to load the Google Maps demo. Check the API key and CSP headers.
      </div>
    );
  }

  return (
    <figure style={{ margin: "2rem 0" }}>
      <div
        style={{
          position: "relative",
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid var(--neutral-alpha-medium)",
        }}
      >
        {status === "loading" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--neutral-background-weak)",
              color: "var(--neutral-on-background-weak)",
              fontSize: "14px",
              zIndex: 1,
            }}
          >
            Loading map…
          </div>
        )}
        <div ref={mapDivRef} style={{ width: "100%", height: `${mapHeight}px` }} />
      </div>
      <figcaption
        style={{
          marginTop: "0.5rem",
          fontSize: "0.85em",
          opacity: 0.6,
          fontStyle: "italic",
          textAlign: "center",
        }}
      >
        Twelve Oxford Properties complexes across Canada — clusters in Ontario (Toronto, Vaughan,
        Brampton, Milton), Alberta (Calgary, Edmonton), and BC (Burnaby, New Westminster). Zoom in
        on any cluster to reveal individual building pins; click a pin to see its photo and details.
      </figcaption>
    </figure>
  );
}
