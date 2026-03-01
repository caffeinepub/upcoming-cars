import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Int "mo:core/Int";

import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  type CarId = Nat;
  type NewsArticleId = Nat;

  type CarType = { #ev; #petrol };

  type Car = {
    id : CarId;
    name : Text;
    brand : Text;
    carType : CarType;
    expectedLaunchDate : Time.Time;
    expectedPriceInr : Nat;
    engineOrBatterySpecs : Text;
    range : Nat;
    mileage : Nat;
    topSpeed : Nat;
    interiorFeatures : [Text];
    exteriorFeatures : [Text];
    safetyFeatures : [Text];
    pros : [Text];
    cons : [Text];
    expertReview : Text;
    images : [Storage.ExternalBlob];
    isTrending : Bool;
    isFeatured : Bool;
  };

  module Car {
    public func compare(car1 : Car, car2 : Car) : Order.Order {
      Nat.compare(car1.id, car2.id);
    };
  };

  type NewsArticle = {
    id : NewsArticleId;
    title : Text;
    category : Text;
    content : Text;
    image : Storage.ExternalBlob;
    publishedAt : Time.Time;
    tags : [Text];
  };

  module NewsArticle {
    public func compare(article1 : NewsArticle, article2 : NewsArticle) : Order.Order {
      Int.compare(article1.publishedAt, article2.publishedAt);
    };
  };

  type UserRating = {
    carId : CarId;
    rating : Nat;
    count : Nat;
  };

  type ComparisonResult = {
    car1 : Car;
    car2 : Car;
  };

  var nextCarId = 1;
  var nextArticleId = 1;

  let cars = Map.empty<CarId, Car>();
  let articles = Map.empty<NewsArticleId, NewsArticle>();

  // Admin functions
  public shared ({ caller }) func adminAddCar(
    name : Text,
    brand : Text,
    carType : CarType,
    expectedLaunchDate : Time.Time,
    expectedPriceInr : Nat,
    engineOrBatterySpecs : Text,
    range : Nat,
    mileage : Nat,
    topSpeed : Nat,
    interiorFeatures : [Text],
    exteriorFeatures : [Text],
    safetyFeatures : [Text],
    pros : [Text],
    cons : [Text],
    expertReview : Text,
    images : [Storage.ExternalBlob],
    isTrending : Bool,
    isFeatured : Bool,
  ) : async CarId {
    let carId = nextCarId;
    nextCarId += 1;

    let car = {
      id = carId;
      name;
      brand;
      carType;
      expectedLaunchDate;
      expectedPriceInr;
      engineOrBatterySpecs;
      range;
      mileage;
      topSpeed;
      interiorFeatures;
      exteriorFeatures;
      safetyFeatures;
      pros;
      cons;
      expertReview;
      images;
      isTrending;
      isFeatured;
    };

    cars.add(carId, car);
    carId;
  };

  public shared ({ caller }) func adminUpdateCar(car : Car) : async () {
    if (not cars.containsKey(car.id)) {
      Runtime.trap("Car not found");
    };
    cars.add(car.id, car);
  };

  public shared ({ caller }) func adminDeleteCar(carId : CarId) : async () {
    if (not cars.containsKey(carId)) {
      Runtime.trap("Car not found");
    };
    cars.remove(carId);
  };

  public shared ({ caller }) func adminAddNews(
    title : Text,
    category : Text,
    content : Text,
    image : Storage.ExternalBlob,
    tags : [Text],
  ) : async NewsArticleId {
    let articleId = nextArticleId;
    nextArticleId += 1;

    let article = {
      id = articleId;
      title;
      category;
      content;
      image;
      publishedAt = Time.now();
      tags;
    };

    articles.add(articleId, article);
    articleId;
  };

  public shared ({ caller }) func adminUpdateNews(article : NewsArticle) : async () {
    if (not articles.containsKey(article.id)) {
      Runtime.trap("Article not found");
    };
    articles.add(article.id, article);
  };

  public shared ({ caller }) func adminDeleteNews(articleId : NewsArticleId) : async () {
    if (not articles.containsKey(articleId)) {
      Runtime.trap("Article not found");
    };
    articles.remove(articleId);
  };

  // Public query functions
  public query ({ caller }) func getCarsByFilter(
    carType : ?CarType,
    minPrice : ?Nat,
    maxPrice : ?Nat,
    brand : ?Text,
    launchYear : ?Nat,
  ) : async [Car] {
    let filteredCars = cars.values().toArray().filter(
      func(car) {
        let typeMatches = switch (carType) {
          case (null) { true };
          case (?desiredType) { car.carType == desiredType };
        };
        let minPriceMatches = switch (minPrice) {
          case (null) { true };
          case (?min) { car.expectedPriceInr >= min };
        };
        let maxPriceMatches = switch (maxPrice) {
          case (null) { true };
          case (?max) { car.expectedPriceInr <= max };
        };
        let brandMatches = switch (brand) {
          case (null) { true };
          case (?desiredBrand) { car.brand == desiredBrand };
        };
        let launchYearMatches = switch (launchYear) {
          case (null) { true };
          case (?year) {
            // Convert Time to year (approx)
            let carYear = 1970 + (car.expectedLaunchDate / (365 * 24 * 60 * 60 * 1000000000));
            carYear == year;
          };
        };
        typeMatches and minPriceMatches and maxPriceMatches and brandMatches and launchYearMatches
      }
    );
    filteredCars;
  };

  public query ({ caller }) func searchCars(search : Text) : async [Car] {
    cars.values().toArray().filter<Car>(
      func(car) {
        car.name.contains(#text(search)) or
        car.brand.contains(#text(search));
      }
    );
  };

  public query ({ caller }) func getCarComparison(carId1 : CarId, carId2 : CarId) : async ComparisonResult {
    switch (cars.get(carId1), cars.get(carId2)) {
      case (?car1, ?car2) { { car1; car2 } };
      case (null, _) { Runtime.trap("Car with id " # carId1.toText() # " not found") };
      case (_, null) { Runtime.trap("Car with id " # carId2.toText() # " not found") };
    };
  };

  public query ({ caller }) func getCar(carId : CarId) : async Car {
    switch (cars.get(carId)) {
      case (?car) { car };
      case (null) { Runtime.trap("Car not found") };
    };
  };

  public query ({ caller }) func getArticle(articleId : NewsArticleId) : async NewsArticle {
    switch (articles.get(articleId)) {
      case (?article) { article };
      case (null) { Runtime.trap("Article not found") };
    };
  };

  public query ({ caller }) func getAllCars() : async [Car] {
    cars.values().toArray();
  };

  public query ({ caller }) func getAllArticles() : async [NewsArticle] {
    articles.values().toArray();
  };
};
