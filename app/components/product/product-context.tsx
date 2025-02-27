import { useNavigate, useSearchParams } from "@remix-run/react";
import { createContext, useContext, useMemo, useState } from "react";

type ProductState = {
  [key: string]: string;
} & {
  image?: string;
};

type ProductContextType = {
  state: ProductState;
  updateOption: (name: string, value: string) => ProductState;
  updateImage: (index: string) => ProductState;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [searchParams] = useSearchParams();
  const getInitialState = () => {
    const params: ProductState = {};

    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    return params;
  };

  const [state, setState] = useState(getInitialState());

  const updateOption = (name: string, value: string) => {
    const newState = { [name]: value };
    setState(newState);
    return { ...state };
  };

  const updateImage = (index: string) => {
    const newState = { image: index };
    setState(newState);
    return { ...state };
  };

  const value = useMemo(
    () => ({
      state,
      updateOption,
      updateImage,
    }),
    [state]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProduct() {
  const context = useContext(ProductContext);

  if (context === undefined) {
    throw new Error("useProduct must be user within a ProductProvider");
  }

  return context;
}

export function useUpdateURL() {
  const navigate = useNavigate();
  return (state: ProductState) => {
    const newParams = new URLSearchParams(window.location.search);
    Object.entries(state).forEach(([key, value]) => {
      newParams.set(key, value);
    });

    navigate(`?${newParams.toString()}`, { preventScrollReset: true });
  };
}
