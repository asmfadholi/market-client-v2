export interface ResponseProduct {
  data: Datum[];
  meta: Meta;
}

export interface Datum {
  id: number;
  attributes: DatumAttributes;
}

export interface DatumAttributes {
  name: string;
  price: string;
  unit: string;
  uniqueName: string;
  stock: null;
  basePrice: null;
  productId: null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  image: Image;
  shop: Image;
  grocery: null;
}

export interface Image {
  data: Data | null;
}

export interface Data {
  id: number;
  attributes: DataAttributes;
}

export interface DataAttributes {
  name: string;
  alternativeText: null;
  caption: null;
  width: number;
  height: number;
  formats: Formats;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: null;
  provider: string;
  provider_metadata: null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Formats {
  large: Large;
  small: Large;
  medium: Large;
  thumbnail: Large;
}

export interface Large {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: null;
  size: number;
  width: number;
  height: number;
}

export interface Meta {
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}
