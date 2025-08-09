export const sampleData = {
  categories: [
    {
      id: 1,
      name: "Men",
      description: "Exclusive fragrances for men",
      color: "blue",
      brands: [
        {
          id: 1,
          name: "Dior",
          imageUrl: "https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=DIOR",
          description: "Luxury French fashion house",
          perfumes: [
            { id: 1, name: "Sauvage", number: "001" },
            { id: 2, name: "Fahrenheit", number: "002" },
            { id: 3, name: "Eau Sauvage", number: "003" }
          ]
        },
        {
          id: 2,
          name: "Chanel",
          imageUrl: "https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=CHANEL",
          description: "Iconic French luxury brand",
          perfumes: [
            { id: 4, name: "Bleu de Chanel", number: "004" },
            { id: 5, name: "Antaeus", number: "005" },
            { id: 6, name: "Platinum Égoïste", number: "006" }
          ]
        },
        {
          id: 3,
          name: "Tom Ford",
          imageUrl: "https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=TOM+FORD",
          description: "Modern luxury and sophistication",
          perfumes: [
            { id: 7, name: "Tobacco Vanille", number: "007" },
            { id: 8, name: "Oud Wood", number: "008" },
            { id: 9, name: "Tuscan Leather", number: "009" }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Women",
      description: "Elegant fragrances for women",
      color: "pink",
      brands: [
        {
          id: 4,
          name: "Chanel",
          imageUrl: "https://via.placeholder.com/300x200/EC4899/FFFFFF?text=CHANEL",
          description: "Iconic French luxury brand",
          perfumes: [
            { id: 10, name: "N°5", number: "010" },
            { id: 11, name: "Coco Mademoiselle", number: "011" },
            { id: 12, name: "Chance", number: "012" }
          ]
        },
        {
          id: 5,
          name: "Dior",
          imageUrl: "https://via.placeholder.com/300x200/EC4899/FFFFFF?text=DIOR",
          description: "Luxury French fashion house",
          perfumes: [
            { id: 13, name: "J'adore", number: "013" },
            { id: 14, name: "Poison", number: "014" },
            { id: 15, name: "Miss Dior", number: "015" }
          ]
        },
        {
          id: 6,
          name: "Yves Saint Laurent",
          imageUrl: "https://via.placeholder.com/300x200/EC4899/FFFFFF?text=YSL",
          description: "French luxury fashion house",
          perfumes: [
            { id: 16, name: "Black Opium", number: "016" },
            { id: 17, name: "Libre", number: "017" },
            { id: 18, name: "Mon Paris", number: "018" }
          ]
        }
      ]
    },
    {
      id: 3,
      name: "Unisex",
      description: "Versatile fragrances for everyone",
      color: "purple",
      brands: [
        {
          id: 7,
          name: "Jo Malone",
          imageUrl: "https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=JO+MALONE",
          description: "British luxury fragrance house",
          perfumes: [
            { id: 19, name: "Wood Sage & Sea Salt", number: "019" },
            { id: 20, name: "English Pear & Freesia", number: "020" },
            { id: 21, name: "Lime Basil & Mandarin", number: "021" }
          ]
        },
        {
          id: 8,
          name: "Le Labo",
          imageUrl: "https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=LE+LABO",
          description: "Artisanal fragrances",
          perfumes: [
            { id: 22, name: "Santal 33", number: "022" },
            { id: 23, name: "Rose 31", number: "023" },
            { id: 24, name: "Bergamote 22", number: "024" }
          ]
        },
        {
          id: 9,
          name: "Byredo",
          imageUrl: "https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=BYREDO",
          description: "Swedish luxury fragrance house",
          perfumes: [
            { id: 25, name: "Gypsy Water", number: "025" },
            { id: 26, name: "Mojave Ghost", number: "026" },
            { id: 27, name: "Bal d'Afrique", number: "027" }
          ]
        }
      ]
    }
  ]
};

export const getCategoryById = (id) => {
  return sampleData.categories.find(category => category.id === id);
};

export const getBrandById = (id) => {
  for (const category of sampleData.categories) {
    const brand = category.brands.find(brand => brand.id === id);
    if (brand) return brand;
  }
  return null;
};

export const getAllPerfumes = () => {
  return sampleData.categories.flatMap(category => 
    category.brands.flatMap(brand => 
      brand.perfumes.map(perfume => ({
        ...perfume,
        brandName: brand.name,
        categoryName: category.name
      }))
    )
  );
};
