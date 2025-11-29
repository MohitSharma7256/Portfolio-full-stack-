import { useQuery } from "@tanstack/react-query";
import API from "../api/axios";

const fetcher = async (url) => {
  const { data } = await API.get(url);
  return data;
};

export const useProfileQuery = () =>
  useQuery({
    queryKey: ["profile"],
    queryFn: () => fetcher("/profile"),
  });

export const useSkillsQuery = () =>
  useQuery({
    queryKey: ["skills"],
    queryFn: () => fetcher("/skills"),
  });

export const useExperienceQuery = () =>
  useQuery({
    queryKey: ["experience"],
    queryFn: () => fetcher("/experience"),
  });

export const useEducationQuery = () =>
  useQuery({
    queryKey: ["education"],
    queryFn: () => fetcher("/education"),
  });

export const useProjectsQuery = () =>
  useQuery({
    queryKey: ["projects"],
    queryFn: () => fetcher("/projects"),
  });

export const useSocialLinksQuery = () =>
  useQuery({
    queryKey: ["socialLinks"],
    queryFn: () => fetcher("/social"),
  });

