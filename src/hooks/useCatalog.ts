"use client";

import { useEffect, useState } from "react";
import type { Article, Course, Review } from "@/types";
import {
  getArticles,
  getCourses,
  getCourseWithReviews,
} from "@/lib/supabase/catalog";

type AsyncState<T> = {
  data: T;
  isLoading: boolean;
  error: string | null;
};

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "ไม่สามารถโหลดข้อมูลจากฐานข้อมูลได้";
}

export function useCourses(): AsyncState<Course[]> {
  const [state, setState] = useState<AsyncState<Course[]>>({
    data: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    getCourses()
      .then((courses) => {
        if (isActive) {
          setState({ data: courses, isLoading: false, error: null });
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          setState({
            data: [],
            isLoading: false,
            error: getErrorMessage(error),
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return state;
}

export function useArticles(): AsyncState<Article[]> {
  const [state, setState] = useState<AsyncState<Article[]>>({
    data: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    getArticles()
      .then((articles) => {
        if (isActive) {
          setState({ data: articles, isLoading: false, error: null });
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          setState({
            data: [],
            isLoading: false,
            error: getErrorMessage(error),
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return state;
}

export function useArticle(slug: string): AsyncState<Article | undefined> {
  const [state, setState] = useState<AsyncState<Article | undefined>>({
    data: undefined,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isActive = true;
    setState({ data: undefined, isLoading: true, error: null });

    getArticles()
      .then((articles) => {
        if (isActive) {
          const article = articles.find((a) => a.id === slug);
          setState({ data: article, isLoading: false, error: null });
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          setState({
            data: undefined,
            isLoading: false,
            error: getErrorMessage(error),
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [slug]);

  return state;
}

export function useCourse(code: string): AsyncState<{
  course?: Course;
  reviews: Review[];
}> {
  const [state, setState] = useState<
    AsyncState<{ course?: Course; reviews: Review[] }>
  >({
    data: { course: undefined, reviews: [] },
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isActive = true;
    setState({
      data: { course: undefined, reviews: [] },
      isLoading: true,
      error: null,
    });

    getCourseWithReviews(code)
      .then((data) => {
        if (isActive) setState({ data, isLoading: false, error: null });
      })
      .catch((error: unknown) => {
        if (isActive) {
          setState({
            data: { course: undefined, reviews: [] },
            isLoading: false,
            error: getErrorMessage(error),
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [code]);

  return state;
}
