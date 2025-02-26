import { useNavigate } from "@remix-run/react";
import { createContext, useContext } from "react";

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
