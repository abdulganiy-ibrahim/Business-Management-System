export interface Business {
  id: string;
  userId: string;
  name: string;
  category: string;
  phone: string;
  slug: string;
}

export interface BusinessFormValues {
  name: string;
  category: string;
  phone: string;
};