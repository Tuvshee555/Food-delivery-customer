export type FoodType = {
  id: string;
  categoryId: string;
  _id: string;
  foodName: string;
  price: number;
  image?: string | File; // allow local file or URL
  ingredients: string;
  category: string;

  // Optional fields for admin/fetch purposes
  refreshFood?: () => void;
  foodData?: FoodType[];
  categories?: string;
};

export type FoodCardPropsType = {
  food: FoodType;
};

export type AddFoodOrderProps = {
  food: FoodType;
};

// Other types (unchanged)
export type ValidationFunction = (
  value: string,
  nextStep: () => void,
  setError: (error: string) => void
) => void;

// export type SignUpEmailStepType = {
//   nextStep: () => void;
//   stepBack?: () => void;
//   setUser: React.Dispatch<
//     React.SetStateAction<{
//       email: string;
//       password: string;
//       repassword: string;
//       role: string;
//     }>
//   >;
//   user: { email: string; password: string; repassword: string };
// };

export type SignUpEmailStepType = {
  nextStep: () => void;
  stepBack?: () => void;
  setUser: React.Dispatch<React.SetStateAction<User>>; // use User type
  user: User; // use full User type
};

export type InputEventType = {
  target: { value: string };
};

export type Datas = {
  id: string;
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

export type User = {
  email: string;
  password: string;
  repassword: string;
  role?: string;
};

// props for CreatePassword
export type UserType = {
  setUser: React.Dispatch<React.SetStateAction<User>>;
  nextStep: () => void;
  stepBack: () => void;
  user: User;
};
