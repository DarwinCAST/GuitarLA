export type Guitar = {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
};

export type CartItem = Pick<
  Guitar,
  "id" | "name" | "image" | "description" | "price"
> & {
  quantity: number;
};
