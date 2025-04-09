export const generateDummyProducts = (userId: string) => [
  {
    name: "Sample Product 1",
    description: "This is a great product",
    category: "Electronics",
    price: 199.99,
    rating: 4.5,
    userId,
  },
  {
    name: "Sample Product 2",
    description: "Another awesome item",
    category: "Books",
    price: 29.99,
    rating: 4.0,
    userId,
  },
  {
    name: "Sample Product 3",
    description: "Top-rated product for daily use",
    category: "Home",
    price: 89.99,
    rating: 4.8,
    userId,
  },
];
