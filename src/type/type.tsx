export type ValidationFunction = (
  value: string,
  nextStep: () => void,
  setError: (error: string) => void
) => void;

export type SignUpEmailStepType = {
  nextStep: () => void;
  stepBack?: () => void;
  setUser: React.Dispatch<
    React.SetStateAction<{
      email: string;
      password: string;
      repassword: string;
    }>
  >;
  user: { email: string; password: string; repassword: string };
};

export type InputEventType = {
  target: { value: string };
};
export type Datas = {
  categoryName: string;
  _id: string;
  foodCount: number;
};

export type CategoriesProps = {
  category: CategoryType[];
};
export type CategoryType = {
  categoryName: string;
  _id: string;
  foodCount: number;
};

export type FoodCardPropsType = {
  food: FoodType;
};
export type FoodType = {
  _id: string;
  foodName: string;
  price: number;
  image?: string
  ingredients: string;
  category: string;
  refreshFood: () => void;
  foodData: any[];
  categories: string;
};
export type AddFoodOrderProps = {
  food: FoodType;
};
