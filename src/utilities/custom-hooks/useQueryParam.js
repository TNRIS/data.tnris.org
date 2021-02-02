import { useLocation } from "react-router-dom";

export default function useQueryParam() {
  return new URLSearchParams(useLocation().search);
}

export function useAllQueryParams() {
  const params = new URLSearchParams(useLocation().search);
  const parameters = {};
  for (let p of params) {
    parameters[p[0]] = p[1];
  }
  return parameters
}
