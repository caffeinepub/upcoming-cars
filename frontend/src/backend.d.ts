import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export type CarId = bigint;
export interface NewsArticle {
    id: NewsArticleId;
    title: string;
    content: string;
    tags: Array<string>;
    publishedAt: Time;
    category: string;
    image: ExternalBlob;
}
export type NewsArticleId = bigint;
export interface ComparisonResult {
    car1: Car;
    car2: Car;
}
export interface Car {
    id: CarId;
    mileage: bigint;
    engineOrBatterySpecs: string;
    cons: Array<string>;
    expertReview: string;
    name: string;
    pros: Array<string>;
    expectedLaunchDate: Time;
    exteriorFeatures: Array<string>;
    isFeatured: boolean;
    safetyFeatures: Array<string>;
    brand: string;
    carType: CarType;
    topSpeed: bigint;
    interiorFeatures: Array<string>;
    expectedPriceInr: bigint;
    range: bigint;
    isTrending: boolean;
    images: Array<ExternalBlob>;
}
export enum CarType {
    ev = "ev",
    petrol = "petrol"
}
export interface backendInterface {
    adminAddCar(name: string, brand: string, carType: CarType, expectedLaunchDate: Time, expectedPriceInr: bigint, engineOrBatterySpecs: string, range: bigint, mileage: bigint, topSpeed: bigint, interiorFeatures: Array<string>, exteriorFeatures: Array<string>, safetyFeatures: Array<string>, pros: Array<string>, cons: Array<string>, expertReview: string, images: Array<ExternalBlob>, isTrending: boolean, isFeatured: boolean): Promise<CarId>;
    adminAddNews(title: string, category: string, content: string, image: ExternalBlob, tags: Array<string>): Promise<NewsArticleId>;
    adminDeleteCar(carId: CarId): Promise<void>;
    adminDeleteNews(articleId: NewsArticleId): Promise<void>;
    adminUpdateCar(car: Car): Promise<void>;
    adminUpdateNews(article: NewsArticle): Promise<void>;
    getAllArticles(): Promise<Array<NewsArticle>>;
    getAllCars(): Promise<Array<Car>>;
    getArticle(articleId: NewsArticleId): Promise<NewsArticle>;
    getCar(carId: CarId): Promise<Car>;
    getCarComparison(carId1: CarId, carId2: CarId): Promise<ComparisonResult>;
    getCarsByFilter(carType: CarType | null, minPrice: bigint | null, maxPrice: bigint | null, brand: string | null, launchYear: bigint | null): Promise<Array<Car>>;
    searchCars(search: string): Promise<Array<Car>>;
}
