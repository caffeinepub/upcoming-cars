import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Car, CarType, NewsArticle, ExternalBlob } from '../backend';

// ─── Cars ────────────────────────────────────────────────────────────────────

export function useGetAllCars() {
  const { actor, isFetching } = useActor();
  return useQuery<Car[]>({
    queryKey: ['cars'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCars();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCar(carId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Car>({
    queryKey: ['car', carId?.toString()],
    queryFn: async () => {
      if (!actor || carId === null) throw new Error('No actor or carId');
      return actor.getCar(carId);
    },
    enabled: !!actor && !isFetching && carId !== null,
  });
}

export function useSearchCars(search: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Car[]>({
    queryKey: ['cars', 'search', search],
    queryFn: async () => {
      if (!actor) return [];
      if (!search.trim()) return actor.getAllCars();
      return actor.searchCars(search);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCarsByFilter(
  carType: CarType | null,
  minPrice: bigint | null,
  maxPrice: bigint | null,
  brand: string | null,
  launchYear: bigint | null
) {
  const { actor, isFetching } = useActor();
  return useQuery<Car[]>({
    queryKey: ['cars', 'filter', carType, minPrice?.toString(), maxPrice?.toString(), brand, launchYear?.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCarsByFilter(carType, minPrice, maxPrice, brand, launchYear);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCarComparison(carId1: bigint | null, carId2: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['comparison', carId1?.toString(), carId2?.toString()],
    queryFn: async () => {
      if (!actor || carId1 === null || carId2 === null) throw new Error('Missing params');
      return actor.getCarComparison(carId1, carId2);
    },
    enabled: !!actor && !isFetching && carId1 !== null && carId2 !== null,
  });
}

// ─── Admin Cars ───────────────────────────────────────────────────────────────

export function useAdminAddCar() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string; brand: string; carType: CarType;
      expectedLaunchDate: bigint; expectedPriceInr: bigint;
      engineOrBatterySpecs: string; range: bigint; mileage: bigint;
      topSpeed: bigint; interiorFeatures: string[]; exteriorFeatures: string[];
      safetyFeatures: string[]; pros: string[]; cons: string[];
      expertReview: string; images: ExternalBlob[];
      isTrending: boolean; isFeatured: boolean;
    }) => {
      if (!actor) throw new Error('No actor');
      return actor.adminAddCar(
        params.name, params.brand, params.carType,
        params.expectedLaunchDate, params.expectedPriceInr,
        params.engineOrBatterySpecs, params.range, params.mileage,
        params.topSpeed, params.interiorFeatures, params.exteriorFeatures,
        params.safetyFeatures, params.pros, params.cons,
        params.expertReview, params.images, params.isTrending, params.isFeatured
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cars'] }),
  });
}

export function useAdminUpdateCar() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (car: Car) => {
      if (!actor) throw new Error('No actor');
      return actor.adminUpdateCar(car);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cars'] }),
  });
}

export function useAdminDeleteCar() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (carId: bigint) => {
      if (!actor) throw new Error('No actor');
      return actor.adminDeleteCar(carId);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cars'] }),
  });
}

// ─── Articles ─────────────────────────────────────────────────────────────────

export function useGetAllArticles() {
  const { actor, isFetching } = useActor();
  return useQuery<NewsArticle[]>({
    queryKey: ['articles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllArticles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetArticle(articleId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<NewsArticle>({
    queryKey: ['article', articleId?.toString()],
    queryFn: async () => {
      if (!actor || articleId === null) throw new Error('No actor or articleId');
      return actor.getArticle(articleId);
    },
    enabled: !!actor && !isFetching && articleId !== null,
  });
}

// ─── Admin Articles ───────────────────────────────────────────────────────────

export function useAdminAddNews() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      title: string; category: string; content: string;
      image: ExternalBlob; tags: string[];
    }) => {
      if (!actor) throw new Error('No actor');
      return actor.adminAddNews(params.title, params.category, params.content, params.image, params.tags);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['articles'] }),
  });
}

export function useAdminUpdateNews() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (article: NewsArticle) => {
      if (!actor) throw new Error('No actor');
      return actor.adminUpdateNews(article);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['articles'] }),
  });
}

export function useAdminDeleteNews() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (articleId: bigint) => {
      if (!actor) throw new Error('No actor');
      return actor.adminDeleteNews(articleId);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['articles'] }),
  });
}
