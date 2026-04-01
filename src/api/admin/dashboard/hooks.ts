import { useQuery } from "@tanstack/react-query";
import {
  getTotalCourses,
  getActiveSubscriptions,
  getMostPopularCourse,
  getNewUsers,
  getTotalStudents
} from "./index";

export const useTotalCourses = () => {
  return useQuery({
    queryKey: ['dashboard-total-courses'],
    queryFn: getTotalCourses,
  });
};

export const useActiveSubscriptions = () => {
  return useQuery({
    queryKey: ['dashboard-active-subscriptions'],
    queryFn: getActiveSubscriptions,
  });
};

export const useMostPopularCourse = () => {
  return useQuery({
    queryKey: ['dashboard-most-popular-course'],
    queryFn: getMostPopularCourse,
  });
};

export const useNewUsers = (months: number) => {
  return useQuery({
    queryKey: ['dashboard-new-users', months],
    queryFn: () => getNewUsers(months),
  });
};


export const useTotalStudents = () => {
  return useQuery({
    queryKey: ['dashboard-total-students'],
    queryFn: getTotalStudents,
  });
};